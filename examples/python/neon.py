"""Minimal Gemini 4 Neon client for the Muapi API."""
import os
import time

import requests

BASE = "https://api.muapi.ai/api/v1"


def _headers():
    key = os.environ.get("MUAPI_API_KEY")
    if not key:
        raise SystemExit("Set MUAPI_API_KEY first")
    return {"x-api-key": key, "Content-Type": "application/json"}


def ask_neon(prompt, system_prompt=None, image_url=None, reasoning_effort="high",
               poll_seconds=2, timeout=600):
    """Submit a prompt to gemini-4-neon, poll until done, and return the text."""
    body = {"prompt": prompt, "reasoning_effort": reasoning_effort}
    if system_prompt:
        body["system_prompt"] = system_prompt
    if image_url:
        body["image_url"] = image_url

    resp = requests.post(f"{BASE}/gemini-4-neon", json=body, headers=_headers(), timeout=60)
    resp.raise_for_status()
    request_id = resp.json()["request_id"]

    deadline = time.time() + timeout
    while time.time() < deadline:
        r = requests.get(f"{BASE}/predictions/{request_id}/result", headers=_headers(), timeout=60)
        r.raise_for_status()
        data = r.json()
        if data.get("status") == "completed":
            return data["outputs"][0]
        if data.get("status") == "failed":
            raise RuntimeError(f"Request {request_id} failed: {data.get('error') or data}")
        time.sleep(poll_seconds)
    raise TimeoutError(f"Request {request_id} did not finish in {timeout}s; check it before resubmitting")


if __name__ == "__main__":
    print(ask_neon("Explain the difference between a list comprehension and a generator expression in Python, with one example each."))
