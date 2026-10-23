const analyzeBtn = document.getElementById("analyze-btn");
const copyBtn = document.getElementById("copy-btn");
const codeInput = document.getElementById("code-input");
const outputDiv = document.getElementById("output");

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "gemma3:4b";

async function getActivePageText() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return "";

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText.slice(0, 4000)
    });
    return results[0]?.result || "";
  } catch (err) {
    return "Could not auto-read tab. Relying on pasted code/constraints.";
  }
}

analyzeBtn.addEventListener("click", async () => {
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "🦥 Sloth is thinking...";
  outputDiv.style.display = "block";
  outputDiv.textContent = "Reading problem statement from active tab and waking up local Gemma model...";
  copyBtn.style.display = "none";

  const pageText = await getActivePageText();
  const userCode = codeInput.value.trim();

  const prompt = `You are CP Sloth, a lazy but brilliant Competitive Programming and DSA assistant.
A developer is too lazy to write tricky edge-case inputs or dry-run their code manually.

--- ACTIVE PAGE PROBLEM CONTEXT ---
${pageText}

--- USER'S CODE (IF PROVIDED) ---
${userCode || "No code provided. Focus on problem constraints."}

Respond concisely in plain text with EXACTLY these 3 sections:
1. 5 NASTY EDGE CASES: Ready-to-copy raw test inputs (empty/single element, max constraints, negative values, duplicates, or tricky graph/tree shapes).
2. COMPLEXITY & TLE VERDICT: Estimated Time and Space Complexity, and whether it risks Time Limit Exceeded (TLE) or integer overflow (e.g., needing long long in C++).
3. LAZY SLOTH FIX: A 2-line tip on how to fix or optimize the approach with minimum effort.`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama returned status ${response.status}. Make sure OLLAMA_ORIGINS="chrome-extension://*" is set.`);
    }

    const data = await response.json();
    outputDiv.textContent = data.response.trim();
    copyBtn.style.display = "block";
  } catch (error) {
    outputDiv.textContent = `Error connecting to local Ollama:\n${error.message}\n\nQuick Fix: Run 'OLLAMA_ORIGINS="chrome-extension://*" ollama serve' in your terminal.`;
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "🦥 Do the Thinking";
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(outputDiv.textContent);
  copyBtn.textContent = "Copied! ✅";
  setTimeout(() => (copyBtn.textContent = "Copy Output"), 1500);
});