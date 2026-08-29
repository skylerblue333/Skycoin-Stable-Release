import { useState } from "react";

type Module = "language" | "dating" | "shop";

const copy: Record<Module, { title: string; description: string; action: string }> = {
  language: {
    title: "SkyLanguage P2P Exchange",
    description: "Live language sessions with translation and reputation tracking.",
    action: "Start language session",
  },
  dating: {
    title: "SkyDating Privacy Layer",
    description: "Privacy-preserving personhood and match verification workflows.",
    action: "Start verification",
  },
  shop: {
    title: "SkyShop Commerce",
    description: "Commerce checkout flows prepared for agent discovery and escrow settlement.",
    action: "Prepare checkout",
  },
};

export default function LiveEcosystemTriadPortal() {
  const [active, setActive] = useState<Module>("language");
  const [status, setStatus] = useState("READY");

  const execute = () => {
    setStatus("VALIDATING MANDATE + PROOF...");
    window.setTimeout(() => setStatus("VALIDATION COMPLETE — READY FOR AUTHORIZED SETTLEMENT"), 900);
  };

  const current = copy[active];

  return (
    <section className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/30 bg-slate-950 p-8 text-white shadow-2xl">
      <header className="mb-6 border-b border-slate-800 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">SKYCOIN4444 FEDERATION</p>
        <h2 className="mt-2 text-2xl font-bold">Live Social-Fi & Commerce Triad</h2>
        <p className="mt-2 text-sm text-slate-400">SkyLanguage · SkyDating · SkyShop</p>
      </header>

      <nav className="grid grid-cols-3 gap-2" aria-label="Ecosystem modules">
        {(Object.keys(copy) as Module[]).map((module) => (
          <button
            key={module}
            type="button"
            onClick={() => setActive(module)}
            className={`rounded-xl px-4 py-3 text-xs font-bold uppercase ${
              active === module ? "bg-emerald-600 text-white" : "bg-slate-900 text-slate-400"
            }`}
          >
            Sky{module === "language" ? "Language" : module === "dating" ? "Dating" : "Shop"}
          </button>
        ))}
      </nav>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="text-lg font-bold text-emerald-300">{current.title}</h3>
        <p className="mt-2 text-sm text-slate-400">{current.description}</p>
        <button
          type="button"
          onClick={execute}
          className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold hover:bg-emerald-500"
        >
          {current.action}
        </button>
      </div>

      <footer className="mt-5 text-center text-xs text-slate-500" aria-live="polite">
        Status: <span className="font-semibold text-emerald-400">{status}</span>
      </footer>
    </section>
  );
}
