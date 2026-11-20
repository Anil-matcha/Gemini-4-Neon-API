"""Review a source file for bugs and refactoring opportunities with Gemini 4 Neon.

Usage: python examples/python/code_review.py path/to/file.py
Only send code you are authorised to share.
"""
import sys
from pathlib import Path

from neon import ask_neon

SYSTEM = (
    "You are a senior software engineer doing a code review. "
    "For each finding give: severity, the affected lines, why it is a problem, "
    "and a minimal patch as a diff. If the code looks safe, say so. Do not invent issues."
)


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: code_review.py <file>")
    path = Path(sys.argv[1])
    code = path.read_text(encoding="utf-8")
    prompt = f"Review this file ({path.name}) for bugs and refactoring opportunities and propose patches.\n\n```\n{code}\n```"
    print(ask_neon(prompt, system_prompt=SYSTEM, reasoning_effort="high"))


if __name__ == "__main__":
    main()
