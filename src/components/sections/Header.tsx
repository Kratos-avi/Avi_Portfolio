interface HeaderProps {
  navItems: Array<{ label: string; href: string }>
  ambientVolume: number
  handleVolumeChange: (vol: number) => void
  handleInteraction: () => void
}

export function Header({
  navItems,
  ambientVolume,
  handleVolumeChange,
  handleInteraction,
}: HeaderProps) {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      <nav className="glass-panel rounded-full px-6 py-3 md:px-8">
        <div className="flex items-center justify-between">
          <a 
            href="#hero" 
            onMouseEnter={handleInteraction}
            data-cursor-text="NAVIGATE HOME"
            data-magnetic
            className="text-sm font-bold tracking-[0.2em] text-primary uppercase hover:opacity-80 transition-opacity"
          >
            Avinash.S
          </a>
          
          <div className="flex items-center gap-6">
            <ul className="flex items-center gap-3 sm:gap-6 md:gap-8 text-xs md:text-sm">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onMouseEnter={handleInteraction}
                    data-cursor-text={`NAVIGATE TO ${item.label.toUpperCase()}`}
                    data-magnetic
                    className="text-[#94a3b8] hover:text-primary transition-colors duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-primary after:transition-all hover:after:w-full"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Ambient Drone Synthesizer Header Volume Controls */}
            <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-6 text-xs text-[#94a3b8]/75 font-mono">
              <span className="text-[9px] uppercase font-bold text-primary tracking-wider">Hum Drone</span>
              <div className="flex gap-1">
                {[
                  { label: 'MUTE', vol: 0 },
                  { label: '25%', vol: 0.25 },
                  { label: '50%', vol: 0.5 },
                  { label: '100%', vol: 1.0 }
                ].map((v) => (
                  <button
                    key={v.vol}
                    data-cursor-text={`SET DRONE VOL: ${v.label}`}
                    data-magnetic
                    onClick={() => handleVolumeChange(v.vol)}
                    className={`px-1.5 py-0.5 rounded border text-[8px] font-bold transition-all ${
                      ambientVolume === v.vol
                        ? 'bg-primary/15 border-primary text-primary'
                        : 'bg-black/40 border-white/5 text-[#94a3b8]/60 hover:border-white/10'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header

