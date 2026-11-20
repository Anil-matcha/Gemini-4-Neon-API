// Minimal Gemini 4 Neon client for the Muapi API (Node 18+).
const BASE = "https://api.muapi.ai/api/v1";

function headers() {
  const key = process.env.MUAPI_API_KEY;
  if (!key) throw new Error("Set MUAPI_API_KEY first");
  return { "x-api-key": key, "Content-Type": "application/json" };
}

export async function askNeon(prompt, { systemPrompt, imageUrl, reasoningEffort = "high", pollMs = 2000, timeoutMs = 600000 } = {}) {
  const body = { prompt, reasoning_effort: reasoningEffort };
  if (systemPrompt) body.system_prompt = systemPrompt;
  if (imageUrl) body.image_url = imageUrl;

  const submit = await fetch(`${BASE}/gemini-4-neon`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
  if (!submit.ok) throw new Error(`Submit failed: ${submit.status} ${await submit.text()}`);
  const { request_id: requestId } = await submit.json();

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await fetch(`${BASE}/predictions/${requestId}/result`, { headers: headers() });
    if (!res.ok) throw new Error(`Poll failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    if (data.status === "completed") return data.outputs[0];
    if (data.status === "failed") throw new Error(`Request ${requestId} failed: ${data.error ?? JSON.stringify(data)}`);
    await new Promise((r) => setTimeout(r, pollMs));
  }
  throw new Error(`Request ${requestId} did not finish in time; check it before resubmitting`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(await askNeon("Explain the difference between a list comprehension and a generator expression in Python, with one example each."));
}
