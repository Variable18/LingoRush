import React from "react";
import CinematicLayout from "../components/cinema/CinematicLayout";

const ProductPage = () => {
  return (
    <CinematicLayout>
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="pt-8">
            <div className="h-px w-24 bg-white/20 mb-6" />
            <h1 className="text-[34px] md:text-[44px] leading-[1.2] text-white/90 font-light tracking-[0.01em]">
              The product
              <br />
              in quiet focus
            </h1>
            <p className="mt-6 text-sm text-gray-400 max-w-sm">
              Tools designed for heavy, deliberate learning. Subtle interfaces, precise outcomes.
            </p>
          </div>

          {/* Feature scaffold */}
          <div className="mt-8 md:mt-16 grid grid-cols-1 gap-6">
            {["Adaptive difficulty", "Cinematic feedback", "Editor-grade typography"].map((f) => (
              <div key={f} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm text-gray-400">{f}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </CinematicLayout>
  );
};

export default ProductPage;
