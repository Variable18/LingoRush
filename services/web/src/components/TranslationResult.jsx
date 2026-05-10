import { useState } from "react";

export default function TranslationResult({ result, onSubmitCorrection }) {
  const [correction, setCorrection] = useState("");
  const { translation, model, src_lang, cached, time_ms, correctionSubmitted } = result;

  function submitCorrection() {
    if (!correction.trim()) return;
    onSubmitCorrection({
      source_text: result.source_text,
      src_lang: result.src_lang,
      tgt_lang: result.tgt_lang,
      corrected: correction.trim()
    });
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div>Detected: <span className="font-medium text-gray-800 ml-1">{src_lang}</span></div>
        <div>Model: <span className="font-medium text-gray-800 ml-1">{model || "—"}</span></div>
        <div>Cached: <span className="font-medium text-gray-800 ml-1">{cached ? "Yes" : "No"}</span></div>
        {time_ms != null && <div>Time: <span className="font-medium">{time_ms} ms</span></div>}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Translation</h3>
        <div className="p-4 bg-lingorush-50 rounded-md text-gray-800 whitespace-pre-wrap">{translation}</div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Suggest a correction</h4>
        {correctionSubmitted ? (
          <div className="p-3 bg-green-50 text-green-700 rounded">Thanks — correction submitted!</div>
        ) : (
          <>
            <textarea rows={3} value={correction} onChange={(e)=>setCorrection(e.target.value)}
              className="w-full rounded-md border-gray-200 p-3 mb-3" placeholder="Type corrected translation (if this is wrong)"></textarea>
            <div className="text-right">
              <button onClick={submitCorrection} className="px-4 py-2 bg-lingorush-500 text-white rounded-md">Submit correction</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
