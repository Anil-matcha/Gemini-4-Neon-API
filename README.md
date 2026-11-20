# Gemini 4 Neon API

Call Google's Gemini 4 Neon through Muapi's asynchronous REST API, with copy-paste `curl`, Python, and JavaScript examples, a `reasoning_effort` guide (including `xhigh`), per-token pricing, and a code-review script.

[Muapi Gemini 4 Neon page](https://muapi.ai/gemini-4-neon) · [Gemini 4 hub](https://muapi.ai/gemini-4) · [Gemini 4 Neon playground](https://muapi.ai/playground/gemini-4-neon) · [API reference](https://muapi.ai/docs/api-reference) · [Create an API key](https://muapi.ai/access-keys) · [muapi.ai](https://muapi.ai)

## Related Projects

- [Gemini-4-Hydrogen-API](https://github.com/Anil-matcha/Gemini-4-Hydrogen-API)
- [Gemini-4-Carbon-API](https://github.com/Anil-matcha/Gemini-4-Carbon-API)
- [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI)

## What Gemini 4 Neon is

Gemini 4 Neon sits between Gemini 4 Hydrogen and Gemini 4 Carbon in Google's Gemini 4 series, built for high-frequency complex work such as coding, analysis, and research. It has a context window of 1,048,576 tokens shared across input, thinking, and output, a default maximum output of 65,536 tokens (thinking counts toward that budget), and four thinking levels.

On Muapi it is a single text endpoint: `gemini-4-neon`, taking text plus an optional image.

## Gemini 4 Neon vs Gemini 4 Hydrogen vs Gemini 4 Carbon

| | Gemini 4 Neon | Gemini 4 Hydrogen | Gemini 4 Carbon |
|---|---|---|---|
| Muapi endpoint | `gemini-4-neon` | `gemini-4-hydrogen` | `gemini-4-carbon` |
| Positioning | High-frequency complex work | Fast, efficient everyday coding | Security-focused frontier reasoning |
| Input | Text, optional image, optional system prompt | Text, optional image, optional system prompt | Text, optional image, optional system prompt |
| `reasoning_effort` | `low`, `medium`, `high` (default), `xhigh` | `low`, `medium`, `high` (default), `xhigh` | `low`, `medium` (default), `high` |
| Price (per 1M tokens, in / out) | $4.00 / $20.00 | $1.50 / $7.50 | $4.00 / $20.00 |
| Minimum charge per call | $0.0004 | $0.00015 | $0.0004 |
| Best for | Coding, analysis, and research at volume | Coding, analysis, research, long-document Q&A | Vulnerability analysis, secure code review |

See the [Gemini 4 API page](https://muapi.ai/gemini-4) for the live lineup.

## Quick start

Muapi is asynchronous: submit a request, save the returned `request_id`, then poll the result endpoint.

```bash
export MUAPI_API_KEY="your-key"

curl -X POST https://api.muapi.ai/api/v1/gemini-4-neon \
  -H "x-api-key: $MUAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Review this module for bugs and summarize the main risks.",
    "system_prompt": "You are a senior software engineer. Be concise.",
    "reasoning_effort": "high"
  }'
# {"request_id":"REQUEST_ID","status":"processing"}

curl "https://api.muapi.ai/api/v1/predictions/REQUEST_ID/result" \
  -H "x-api-key: $MUAPI_API_KEY"
```

Poll until `status` is `completed` or `failed`. On completion the generated text is in `outputs[0]`. You can also pass `?webhook=https://your.app/hook` on the submit call to be notified instead of polling.

## Request fields

| Field | Requirement | Notes |
|---|---|---|
| `prompt` | Required | The user message or instruction. |
| `image_url` | Optional | Public image URL for multimodal questions (screenshots, diagrams, scanned pages). |
| `system_prompt` | Optional | System-level instruction for role, tone, and output format. |
| `reasoning_effort` | Optional | `low`, `medium`, `high` (default), or `xhigh`. |

### Choosing `reasoning_effort`

- `low`: quick classification, summarisation, or extraction where latency and cost matter most.
- `medium`: routine coding help and Q&A.
- `high` (default): multi-step debugging, refactors, and long-document questions.
- `xhigh`: the hardest tasks. Slowest, and reasoning tokens are billed as output tokens, so expect a higher bill.

## Pricing

Billing is per token: **$4.00 per 1M input tokens and $20.00 per 1M output tokens**, with a minimum charge of **$0.0004 per call** and no subscription. Reasoning tokens count as output. A call is charged the minimum up front and topped up to the actual token cost when it completes. Confirm current pricing on the [model page](https://muapi.ai/playground/gemini-4-neon).

## Examples

| Path | What it does |
|---|---|
| [`examples/curl/submit_and_poll.sh`](examples/curl/submit_and_poll.sh) | Submit, poll, and print the text with `curl` and `jq`. |
| [`examples/python/neon.py`](examples/python/neon.py) | Minimal Python client (`requests`) with polling. |
| [`examples/python/code_review.py`](examples/python/code_review.py) | Reviews a source file for bugs and refactors and drafts patches. |
| [`examples/javascript/neon.mjs`](examples/javascript/neon.mjs) | Minimal Node 18+ client using `fetch`. |
| [`examples/javascript/code_review.mjs`](examples/javascript/code_review.mjs) | Node version of the code-review script. |

```bash
pip install -r requirements.txt
export MUAPI_API_KEY="your-key"
python examples/python/code_review.py path/to/file.py
node examples/javascript/code_review.mjs path/to/file.js
```

> These examples have not been run against a live Gemini 4 Neon call yet; check the playground first.

## Errors and production notes

- Keep the API key in an environment variable; never commit credentials.
- Handle non-success HTTP responses and `failed` task states. Failed tasks are refunded.
- Do not resubmit after a timeout without checking the original `request_id`; duplicate submissions are billed.
- Model output is advice: have a human review generated code and patches before merging.
- Only send code you are authorised to share.

## License

MIT
