import React from "react";
import CinematicLayout from "../components/cinema/CinematicLayout";

const PricingPage = () => {
  return (
    <CinematicLayout>
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="h-px w-24 bg-white/20 mb-6" />
          <h1 className="text-[34px] md:text-[44px] leading-[1.2] text-white/90 font-light tracking-[0.01em]">
            Pricing, without noise
          </h1>
          <p className="mt-4 text-sm text-gray-400 max-w-md">
            Deliberate tiers for different tempos of learning.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Free", "Pro", "Team"].map((plan) => (
              <div key={plan} className="p-8 border border-white/10 rounded-2xl bg-white/5">
                <div className="text-lg text-white/80 font-normal">{plan}</div>
                <div className="mt-4 h-px w-12 bg-white/10" />
                <p className="mt-4 text-sm text-gray-400">Designed to begin, progress, or collaborate.</p>
                <button className="mt-8 px-6 py-2 rounded-full bg-[#2EE6A6]/10 text-[#2EE6A6] border border-[#2EE6A6]/20 w-full">Select</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </CinematicLayout>
  );
};

export default PricingPage;
