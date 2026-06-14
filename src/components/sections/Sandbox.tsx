import { InteractiveTerminal } from '../widgets/InteractiveTerminal'

export function Sandbox() {
  return (
    <section id="sandbox" className="scroll-section relative z-10 px-4 py-24 md:px-8 border-t border-white/5 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold block mb-1">
              <span className="text-primary/50">//04</span> System HUD
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight text-[#f8fafc] mt-2">CLI Interactive Shell Terminal</h2>
            <p className="text-sm sm:text-base text-[#94a3b8] mt-4 leading-relaxed max-w-xl">
              Audit system metrics in real-time. Type terminal commands inside the retro shell to trigger system outputs!
            </p>
            <div className="mt-4 border border-white/5 rounded-xl p-4 bg-black/45 font-mono text-xs text-[#94a3b8] max-w-md select-none">
              <span className="text-primary block font-bold mb-1">DIAGNOSTIC KEYS:</span>
              • Type <span className="text-[#34D399]">"game"</span> to launch retro canvas snake arcade mockup.<br />
              • Type <span className="text-[#34D399]">"diagnostic"</span> to trigger complete hardware diagnostic check script.<br />
              • Type <span className="text-[#34D399]">"matrix"</span> to activate falling binary green text stream.
            </div>
          </div>

          <div data-cursor-text="LAUNCH PORTFOLIO ARCADE MINI-GAME">
            <InteractiveTerminal />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Sandbox

