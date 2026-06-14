import { TechOrbit } from '../webgl/TechOrbit'

export function About() {
  return (
    <section id="about" className="scroll-section relative z-10 px-4 py-24 md:px-8 border-t border-white/5 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold block mb-1">
            <span className="text-primary/50">//01</span> Profile
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif mt-2 font-medium tracking-tight text-[#f8fafc]">
            Systems-minded tech builder.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr_1fr] items-start">
          {/* Story Col */}
          <div className="space-y-6">
            <p className="text-xl text-[#f8fafc] leading-relaxed font-serif italic">
              "Detail-oriented IT support professional, game systems developer, and Mobile/Web Development graduate."
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-[#94a3b8]">
              Over the past 7 years, I have worked across hardware diagnostics support, OS stage staging, network router configuration, AWS cloud deployments, and 3D rendering pipelines. I like resolving system bottlenecks, building redundant cloud infrastructure-as-code deployments (Terraform), and structuring clear interfaces that remain clean and premium under the hood.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-[#94a3b8]">
              I specialize in combining hardware diagnostic logic and firewall rules with full-stack programming (Flutter, Node.js, SQLite/MySQL). My process is practical and detail-oriented: I like reducing manual operations, building stable systems, and writing documentation that makes onboarding easy.
            </p>
          </div>

          {/* Core Skills Summary (Holo Card) */}
          <div className="holo-card rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-wider text-primary mb-4 font-bold">Systems Matrix</h3>
            <div className="space-y-4 text-xs sm:text-sm text-[#94a3b8]">
              <div>
                <span className="block text-[10px] font-bold text-white uppercase tracking-wider mb-1">Hardware & Networks</span>
                <p className="text-xs text-[#94a3b8]/90 leading-relaxed">
                  Diagnostics & Repair, component level replacements, LAN/WAN configurations, secure enterprise firewall rule audits, and client OS installations (Windows/Linux).
                </p>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-white uppercase tracking-wider mb-1">Cloud & Infrastructure</span>
                <p className="text-xs text-[#94a3b8]/90 leading-relaxed">
                  Terraform configuration management, AWS cloud instances provisioning (ALB scaling groups, serverless Lambdas, secure S3 asset buckets, IAM policies).
                </p>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-white uppercase tracking-wider mb-1">Mobile & Web Dev</span>
                <p className="text-xs text-[#94a3b8]/90 leading-relaxed">
                  Full-stack product builds (Flutter, Node.js, Express, JavaScript, Kotlin, SQLite, relational MySQL database schemas, and JSON Web Token authorization).
                </p>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-white uppercase tracking-wider mb-1">Game Dev & Creative</span>
                <p className="text-xs text-[#94a3b8]/90 leading-relaxed">
                  C# scripting, Unity physical vectors, custom enemy AI paths, rendering speedups, and layout design in Figma.
                </p>
              </div>
            </div>
          </div>

          {/* 3D Tech Orbit Cloud Col */}
          <div className="flex flex-col items-center justify-center" data-cursor-text="ROTATE CONCENTRIC TAG SPHERES">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[#94a3b8] mb-2 font-bold font-mono">Planet Galaxy</h3>
            <TechOrbit />
            <p className="text-[10px] text-[#94a3b8]/60 mt-2 text-center uppercase tracking-widest font-mono select-none">
              Concentric rings rotate on separate axes
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

