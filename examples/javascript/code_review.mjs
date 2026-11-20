// Review a source file for bugs and refactoring opportunities with Gemini 4 Neon.
// Usage: node examples/javascript/code_review.mjs path/to/file.js
// Only send code you are authorised to share.
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { askNeon } from "./neon.mjs";

const SYSTEM =
  "You are a senior software engineer doing a code review. " +
  "For each finding give: severity, the affected lines, why it is a problem, " +
  "and a minimal patch as a diff. If the code looks safe, say so. Do not invent issues.";

const file = process.argv[2];
if (!file) {
  console.error("usage: code_review.mjs <file>");
  process.exit(1);
}
const code = readFileSync(file, "utf-8");
const prompt = `Review this file (${basename(file)}) for bugs and refactoring opportunities and propose patches.\n\n\`\`\`\n${code}\n\`\`\``;
console.log(await askNeon(prompt, { systemPrompt: SYSTEM, reasoningEffort: "high" }));
