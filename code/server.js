import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';  // for loading GEMINI_API_KEY from .env


dotenv.config();              // loads GEMINI_API_KEY from .env


const app = express();
app.use(express.json());
app.use(express.static('public'));


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
 model: 'gemini-flash-latest',
 generationConfig: { temperature: 0 },
});


app.post('/review', async (req, res) => {
 const { code, language } = req.body;


 if (!code || !code.trim()) {
   return res.status(400).json({ error: 'No code provided.' });
 }


 const prompt = `You are a senior code reviewer. Review this ${language} code.
 Return ONLY valid JSON in this exact format — no markdown, no explanation:
 {
   "perfect": false,
   "bugs": ["bug description 1", "bug description 2"],
   "security": ["security issue 1"],
   "improvements": ["suggestion 1", "suggestion 2"],
   "verdict": "one sentence overall summary",
   "fixedCode": "the complete rewritten code with all bugs, security issues and improvements applied — as a plain
    string with real newlines, no markdown fences"
 }


 Important rules:
 - Assume all inputs (function arguments, variables) are trusted and well-formed — of the type and shape the
 code's evident logic expects — UNLESS the code itself is clearly the boundary that receives untrusted external
 input (e.g. an HTTP request handler reading req.body/query/params, a function parsing a file/network/user-
 supplied string). Missing null/type/shape checks on trusted internal values are NOT bugs and NOT improvements —
 do not mention them at all.
 - Specifically: if a variable or array's name, usage, or surrounding context implies a numeric type (e.g. a
 parameter named "arr" being summed, prices, counts, indices), assume it actually contains numbers. Do NOT flag
 "what if it contains a string" / type-coercion scenarios for such values — that is inventing a malformed input,
 which the rule above already forbids.
 - Only report a "bug" if, GIVEN trusted well-typed inputs, the code produces incorrect output or crashes (e.g.
 wrong operator, off-by-one, wrong formula, incorrect condition, unhandled case within the domain the code is
 evidently meant to handle). Do not invent hypothetical malformed-input scenarios to justify a "bug".
 - Only report a "security" issue if it is a genuine, exploitable vulnerability at a real trust boundary (e.g.
 injection, unsafe eval, hardcoded secrets, missing auth on an actual external-facing endpoint) — not generic
 best-practice advice, and not missing validation on internal/trusted values.
 - Only report an "improvement" if it meaningfully affects correctness, performance, or readability. Do NOT
 report purely stylistic nitpicks (naming preferences, comment style, formatting, minor refactors that don't
 change behavior) if the code is already reasonably clean and idiomatic for ${language}.
 - Do not flag something as an issue merely because a different valid approach exists. Working, reasonably
 clean code should be treated as acceptable, not rewritten for the sake of rewriting it.
 - Validation and hardening have no natural end point — you can always demand one more check (null, NaN,
 Infinity, range, type, argument count, etc.). Do NOT chase this. Once code has zero or one reasonable layer of
 defensive checking, do not ask for more layers.
 - If the code has NO bugs, NO security issues, and NO meaningful improvements by the above criteria, set
 "perfect": true, write a short warm congratulations message in "verdict", and set "bugs", "security",
 "improvements" to empty arrays and "fixedCode" to an empty string.
 - If there are any issues at all, set "perfect": false and fill in all fields as normal.


 Code to review:
 ${code}`;


 try {
   const result = await model.generateContent(prompt);
   const text = result.response.text();
   const clean = text.replace(/```json|```/g, '').trim();
   const json = JSON.parse(clean);
   res.json(json);
 } catch (err) {
   console.error('Review error:', err.message);
   res.status(500).json({ error: err.message });
 }
});


const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
 console.log(`Server running on port ${port}`);
});
