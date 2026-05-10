import { useState } from "react";
import TranslationForm from "../components/TranslationForm";
import TranslationResult from "../components/TranslationResult";
import api from "../services/api";

export default function TranslatePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleTranslate(payload) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.translate(payload);
      setResult(res);
    } catch (e) {
      console.error(e);
      setError(e.message || "Translation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCorrection(payload) {
    try {
      await api.submitCorrection(payload);
      setResult((r) => ({ ...(r || {}), correctionSubmitted: true }));
    } catch (e) {
      console.error(e);
      setError("Failed to submit correction");
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-2xl font-semibold text-lingorush-700">Translate — EN / ES / DE / FR / PT</h2>
        <p className="text-sm text-gray-600 mt-1">Type text and translate between supported languages.</p>
      </div>

      <TranslationForm onTranslate={handleTranslate} loading={loading} />

      {loading && (
        <div className="p-4 bg-white rounded-xl shadow text-gray-600">Translating — please wait…</div>
      )}

      {error && (
        <div className="p-4 bg-red-50 rounded-xl text-red-700">{error}</div>
      )}

      {result && (
        <div>
          <TranslationResult result={result} onSubmitCorrection={handleCorrection} />
        </div>
      )}
    </div>
  );
}
