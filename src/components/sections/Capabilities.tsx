import { FeatureCard } from '../common/FeatureCard'

export function Capabilities() {
  return (
    <section id="features" className="scroll-section relative z-10 px-4 py-24 md:px-8 bg-transparent border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold block mb-1">
              <span className="text-primary/50">//02</span> Specs
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight text-[#f8fafc] mt-2">Core Capabilities</h2>
          </div>
          <p className="text-[#94a3b8] text-sm sm:text-base max-w-md mt-4 md:mt-0 leading-relaxed">
            Every card combines technical troubleshooting, security controls, and responsive visual layout code to guarantee performance stability.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div data-cursor-text="IT FIREWALL & HARDWARE AUDITS">
            <FeatureCard
              title="Hardware & Networks."
              accent="IT Security & Repairs"
              media={{ type: 'image', src: '/it_networks.png', label: 'IT Console' }}
              description="Diagnostics staging, repair of client terminals, component replacement, LAN/WAN networks, and secure enterprise firewall rules."
              items={[
                'Replaced workstation components reducing downtime',
                'Staged client client OS (Windows/Linux) installations',
                'Audited port access and network security parameters'
              ]}
            />
          </div>
          <div data-cursor-text="AWS CLOUD & TERRAFORM BLUEPRINTS">
            <FeatureCard
              title="Cloud Infrastructure."
              accent="AWS & Terraform IaC"
              media={{ type: 'image', src: '/cloud_devops.png', label: 'Cloud Blueprints' }}
              description="Infrastructure-as-code setups utilizing Terraform scripts to manage redundant load balancers, database instances, and auto-scaling groups."
              items={[
                'Coded server resource templates in Terraform',
                'Configured AWS auto-scaling CPU target metrics',
                'Managed secure IAM least-privilege policies'
              ]}
            />
          </div>
          <div data-cursor-text="FLUTTER & FULLSTACK WEB PRODUCTS">
            <FeatureCard
              title="Fullstack Products."
              accent="Web & Mobile Stacks"
              media={{ type: 'image', src: '/fullstack_dev.png', label: 'Fullstack UI' }}
              description="Responsive frontend mobile apps, server APIs, relational MySQL schemas, local SQLite databases, and security auth tokens."
              items={[
                'Deployed Flutter (Dart) mobile layouts',
                'Programmed Kotlin SQLite persistence data layers',
                'Implemented secure JWT session tracking systems'
              ]}
            />
          </div>
          <div data-cursor-text="UNITY C# GAME ENGINE Formulae">
            <FeatureCard
              title="Game Development."
              accent="C# & Unity Engine"
              media={{ type: 'image', src: '/game_dev.png', label: 'Physics Console' }}
              description="Custom gameplay mechanics scripting, interactive physics formulas, enemy AI paths, frame debugging, and 3D graphics rendering pipeline speedups."
              items={[
                'Wrote modular C# game logic scripts in Unity',
                'Rendered assets and managed scene asset trees',
                'Optimized scene loading caches reducing errors'
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Capabilities

