import { useState } from "react";

const LANGUAGES = [
  { code: "auto", label: "Auto-detect" },
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "fr", label: "French" },
  { code: "pt", label: "Portuguese" }
];

export default function TranslationForm({ onTranslate, loading }) {
  const [sourceText, setSourceText] = useState("");
  const [srcLang, setSrcLang] = useState("auto");
  const [tgtLang, setTgtLang] = useState("en");

  function submit(e) {
    e.preventDefault();
    if (!sourceText.trim()) return;
    if (sourceText.length > 2000) {
      alert("Please keep text under 2000 characters for this demo.");
      return;
    }
    onTranslate({ source_text: sourceText.trim(), src_lang: srcLang, tgt_lang: tgtLang });
  }

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Source</span>
          <select value={srcLang} onChange={(e)=>setSrcLang(e.target.value)} disabled={loading}
                  className="mt-1 block w-full rounded-md border-gray-200 p-2">
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-gray-700">Target</span>
          <select value={tgtLang} onChange={(e)=>setTgtLang(e.target.value)} disabled={loading}
                  className="mt-1 block w-full rounded-md border-gray-200 p-2">
            {LANGUAGES.filter(l=>l.code!=='auto').map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </label>
      </div>

      <label className="block mt-4">
        <span className="text-sm font-medium text-gray-700">Text to translate</span>
        <textarea rows={6} value={sourceText} onChange={(e)=>setSourceText(e.target.value)}
          placeholder="Type or paste text here"
          className="mt-1 block w-full rounded-md border-gray-200 p-3 focus:ring-lingorush-300 focus:border-lingorush-300" />
      </label>

      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-lingorush-500 hover:bg-lingorush-600 text-white px-4 py-2 rounded-md">
          {loading ? "Translating…" : "Translate"}
        </button>
      </div>
    </form>
  );
}
