import { TopologyMap } from '../webgl/TopologyMap'
import { MobilePreview } from '../widgets/MobilePreview'
import { GameSim } from '../widgets/GameSim'
import { RenderQueue } from '../widgets/RenderQueue'

export function Projects() {
  return (
    <section id="projects" className="scroll-section relative z-10 px-4 py-24 md:px-8 bg-transparent border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold block mb-1">
            <span className="text-primary/50">//03</span> Cases
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight text-[#f8fafc] mt-2">Projects Case Studies</h2>
          <p className="text-sm text-[#94a3b8] mt-3 max-w-lg mx-auto leading-relaxed">
            Explore dynamic workspaces by clicking and adjusting controls inside live infrastructure topology screens, mobile frameworks, vector physics sandboxes, and rendering HUD farms.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 items-center">
          
          {/* Project 1: Cloud Topology map */}
          <div className="space-y-4" data-cursor-text="READ CLOUD ARCHITECTURE CASE STUDY">
            <span className="text-[10px] font-bold font-mono text-primary uppercase tracking-wider">AWS IaC Deployments</span>
            <h3 className="text-2xl font-bold text-white leading-tight">Cloud Infrastructure Automation</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Automated full-scale AWS cloud infrastructure provisioning utilizing Terraform templates. Maintained secure routing security groups, S3 buckets, and serverless AWS Lambdas. Click nodes inside the live topology grid to audit routing.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] text-[#94a3b8]/60 font-mono">
              <span>#AWSCloud</span> <span>#TerraformIaC</span> <span>#Serverless</span> <span>#SecurityGroups</span>
            </div>
          </div>
          <div className="w-full" data-cursor-text="CLICK TOPOLOGY NODES TO TEST">
            <TopologyMap />
          </div>

          {/* Project 2: Mobile simulator */}
          <div className="space-y-4" data-cursor-text="READ MOBILE DASHBOARD CASE STUDY">
            <span className="text-[10px] font-bold font-mono text-primary uppercase tracking-wider">Cross-Platform Flutter & Android</span>
            <h3 className="text-2xl font-bold text-white leading-tight">Mobile Productivity Dashboard</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Designed and built a complete productivity application using Flutter for the mobile viewport and native Android Kotlin tools. Tap the tabs and checkboxes on the live smartphone simulation to explore SQLite/REST sync behaviors.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] text-[#94a3b8]/60 font-mono">
              <span>#Flutter</span> <span>#Kotlin</span> <span>#SQLiteDB</span> <span>#JWTAuth</span>
            </div>
          </div>
          <div className="w-full" data-cursor-text="TAP BUTTONS TO INTERACT">
            <MobilePreview />
          </div>

          {/* Project 3: Game physics */}
          <div className="space-y-4" data-cursor-text="READ GAME PHYSICS CASE STUDY">
            <span className="text-[10px] font-bold font-mono text-primary uppercase tracking-wider">C# & Unity Engine</span>
            <h3 className="text-2xl font-bold text-white leading-tight">2D Rigid-Body Physics Sandbox</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Implemented vector calculations and boundary collision logic in gameplay environments. Modify the physics forces below using live sliders to see particles bounce off deflector obstacles.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] text-[#94a3b8]/60 font-mono">
              <span>#Unity3D</span> <span>#C-Sharp</span> <span>#PhysicsEngine</span> <span>#VectorMath</span>
            </div>
          </div>
          <div className="w-full" data-cursor-text="CLICK CANVAS TO DROP RIGID BODIES">
            <GameSim />
          </div>

          {/* Project 4: Render farm */}
          <div className="space-y-4" data-cursor-text="READ RENDERING ARCHITECTURE CASE STUDY">
            <span className="text-[10px] font-bold font-mono text-primary uppercase tracking-wider">3D Rendering Pipelines</span>
            <h3 className="text-2xl font-bold text-white leading-tight">Distributed Render Farm HUD</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Designed rendering sequences and automated assets directories on local rendering grids. Adjust ray depth options and click 'Start Render' to trigger processing tile maps and tracking live frame outputs.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] text-[#94a3b8]/60 font-mono">
              <span>#3DAnimation</span> <span>#RenderPipeline</span> <span>#GPUTracking</span> <span>#VRAMAllocation</span>
            </div>
          </div>
          <div className="w-full" data-cursor-text="MUTATE SLIDERS TO COMMENCE RENDER">
            <RenderQueue />
          </div>

        </div>
      </div>
    </section>
  )
}

export default Projects

