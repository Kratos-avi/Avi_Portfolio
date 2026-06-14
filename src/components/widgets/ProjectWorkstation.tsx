import { useState, useEffect, useRef } from 'react'
import { soundManager } from '../../utils/SoundManager'
import { Folder, FileCode, Play, Terminal, TerminalSquare, Layers } from 'lucide-react'

// Define the file layouts and templates for the 4 projects
interface CodeFile {
  name: string
  language: 'hcl' | 'dart' | 'kotlin' | 'csharp' | 'python'
  content: string
}

interface ProjectData {
  id: string
  title: string
  accent: string
  files: CodeFile[]
  terminalCmd: string
  simText: string
  logs: string[]
}

const PROJECTS_WORKSPACE: ProjectData[] = [
  {
    id: 'aws',
    title: 'AWS Terraform Cloud IaC',
    accent: '#22d3ee', // Gold
    terminalCmd: 'terraform apply -auto-approve',
    simText: 'Execute Terraform IaC Stacks',
    files: [
      {
        name: 'main.tf',
        language: 'hcl',
        content: `# Provisioning Application Load Balancer target groups
resource "aws_lb_target_group" "api_tg" {
  name     = "avi-portfolio-api-tg"
  port     = 443
  protocol = "HTTPS"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/healthz"
    protocol            = "HTTPS"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "aws_autoscaling_group" "api_asg" {
  name                = "avi-portfolio-asg"
  desired_capacity    = 2
  max_size            = 5
  min_size            = 2
  target_group_arns   = [aws_lb_target_group.api_tg.arn]
  vpc_zone_identifier = aws_subnet.private[*].id
}`
      },
      {
        name: 'variables.tf',
        language: 'hcl',
        content: `variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS operational target region"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Application deployment tier"
}`
      },
      {
        name: 'outputs.tf',
        language: 'hcl',
        content: `output "alb_dns_name" {
  value       = aws_lb.external_alb.dns_name
  description = "Application public endpoint"
}

output "db_endpoint" {
  value       = aws_db_instance.primary_db.endpoint
  description = "Relational database endpoint URL"
}`
      }
    ],
    logs: [
      'Initializing the backend...',
      'Initializing provider plugins...',
      'Terraform has been successfully initialized!',
      'Terraform will perform the following actions:',
      '  + aws_lb_target_group.api_tg will be created',
      '  + aws_autoscaling_group.api_asg will be created',
      'Plan: 2 to add, 0 to change, 0 to destroy.',
      'aws_lb_target_group.api_tg: Creating...',
      'aws_lb_target_group.api_tg: Creation complete after 3s',
      'aws_autoscaling_group.api_asg: Creating...',
      'aws_autoscaling_group.api_asg: Still creating... (10s elapsed)',
      'aws_autoscaling_group.api_asg: Creation complete after 12s',
      'Apply complete! Resources: 2 added, 0 changed, 0 destroyed.'
    ]
  },
  {
    id: 'mobile',
    title: 'Flutter & Kotlin Mobile Stacks',
    accent: '#22D3EE', // Cyan
    terminalCmd: 'flutter pub get && flutter run',
    simText: 'Simulate Mobile Local Database Sync',
    files: [
      {
        name: 'main.dart',
        language: 'dart',
        content: `import 'package:flutter/material.dart';

void main() => runApp(MobileDashboard());

class MobileDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Telemetry HUD',
      theme: ThemeData.dark().copyWith(
        primaryColor: Color(0xFFD4AF37),
        scaffoldBackgroundColor: Color(0xFF070709),
      ),
      home: Scaffold(
        body: DashboardScreen(syncStatus: 'Active'),
      ),
    );
  }
}`
      },
      {
        name: 'local_db.kt',
        language: 'kotlin',
        content: `import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class DatabaseHelper(context: Context) : 
    SQLiteOpenHelper(context, "local_cache.db", null, 1) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(
            "CREATE TABLE telemetry (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "metric_key TEXT UNIQUE, " +
            "value REAL, " +
            "timestamp INTEGER)"
        )
    }
}`
      }
    ],
    logs: [
      'Resolving flutter dependencies...',
      'Running Kotlin Gradle build task...',
      'Launching on Android Simulator (Pixel 7 Pro)...',
      'Initializing SQLite database local_cache.db...',
      'DB: Created table "telemetry" [STATUS: OK]',
      'Establishing secure JWT handshake with node server API...',
      'JWT: Handshake completed. Token signed.',
      'Syncing telemetry queues [24 pending packets]...',
      'Sync success! Server database synced (0 discrepancies).',
      'App running. Listening to broadcast channels...'
    ]
  },
  {
    id: 'game',
    title: 'Unity C# Physics Mechanics',
    accent: '#34D399', // Emerald
    terminalCmd: 'mcs -out:PhysicsEngine.dll PhysicsEngine.cs',
    simText: 'Compile Physics Collision Loop',
    files: [
      {
        name: 'PhysicsEngine.cs',
        language: 'csharp',
        content: `using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class PhysicsEngine : MonoBehaviour {
    [SerializeField] private float gravityScale = -9.81f;
    [SerializeField] private float bounciness = 0.72f;

    private Rigidbody2D rb;

    void Start() {
        rb = GetComponent<Rigidbody2D>();
    }

    void FixedUpdate() {
        Vector2 force = new Vector2(0f, gravityScale * rb.mass);
        rb.AddForce(force, ForceMode2D.Force);
    }
}`
      }
    ],
    logs: [
      'mcs -out:PhysicsEngine.dll PhysicsEngine.cs',
      'Compiling Assembly-CSharp references...',
      'Loaded UnityEngine.CoreModule references.',
      'Analyzing syntax tokens: C# 11 compliant.',
      'Compiling vertex/normal math buffers...',
      'Compilation successful: 0 warnings, 0 errors.',
      'PhysicsEngine.dll output written.'
    ]
  },
  {
    id: 'render',
    title: 'Blender Python Render Pipelines',
    accent: '#EF4444', // Crimson
    terminalCmd: 'blender --background --python render_job.py',
    simText: 'Boot Blender Raytrace Engine',
    files: [
      {
        name: 'render_job.py',
        language: 'python',
        content: `import bpy

def setup_cycles_engine(ray_depth, device="GPU"):
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    
    # Configure path tracing bounces
    cycles = scene.cycles
    cycles.device = device
    cycles.max_bounces = ray_depth
    cycles.diffuse_bounces = min(4, ray_depth)
    cycles.glossy_bounces = min(4, ray_depth)
    
    print(f"Blender Staging: Cycles initialized on {device}.")
    print(f"Bounces configured: {ray_depth}")`
      }
    ],
    logs: [
      'blender --background --python render_job.py',
      'Blender 4.0.2 (headless) initialized.',
      'Loading scene data assets...',
      'Blender Staging: Cycles initialized on GPU.',
      'Bounces configured: 8',
      'Partitioning CUDA tile buffers: 32x32 tiles.',
      'Staging CPU/GPU caches [Status: Active]',
      'Render Tile [0,0]: Rendering...',
      'Render Tile [0,1]: Rendering...',
      'Frame 1 complete. Saved to S3 storage bucket.',
      'Blender thread closing. Success.'
    ]
  }
]

interface ProjectWorkstationProps {
  onDeployTrigger?: (nodeId: string) => void
  onProjectChange?: (projectId: string) => void
}

export function ProjectWorkstation({ onDeployTrigger, onProjectChange }: ProjectWorkstationProps) {
  const [activeProj, setActiveProj] = useState<ProjectData>(PROJECTS_WORKSPACE[0])
  const [selectedFile, setSelectedFile] = useState<CodeFile>(PROJECTS_WORKSPACE[0].files[0])
  
  // Terminal execution states
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Type or click action to execute workstation simulation queues.',
    'Workstation staged. Ready.'
  ])
  const [isCompiling, setIsCompiling] = useState(false)
  const terminalEndRef = useRef<HTMLDivElement | null>(null)

  // Sync state when active project changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedFile(activeProj.files[0])
    setTerminalHistory([
      `Staging project workspace: ${activeProj.title}`,
      `Staged command: ${activeProj.terminalCmd}`,
      'Ready for execution.'
    ])
    if (onProjectChange) {
      onProjectChange(activeProj.id)
    }
  }, [activeProj, onProjectChange])

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalHistory])

  const runSimulation = async () => {
    if (isCompiling) return
    setIsCompiling(true)
    soundManager.playSuccess()

    setTerminalHistory((prev) => [...prev, '', `$ ${activeProj.terminalCmd}`])

    for (let i = 0; i < activeProj.logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350 + Math.random() * 200))
      soundManager.playTick()
      
      const logLine = activeProj.logs[i]
      setTerminalHistory((prev) => [...prev, logLine])

      // If active project is AWS and log line represents creating alb or database, trigger active mapping links
      if (activeProj.id === 'aws' && onDeployTrigger) {
        if (logLine.includes('api_tg: Creation complete')) {
          onDeployTrigger('alb')
        } else if (logLine.includes('api_asg: Creation complete')) {
          onDeployTrigger('asg')
        } else if (logLine.includes('Creation complete after 12s')) {
          onDeployTrigger('db')
        }
      }
    }

    setIsCompiling(false)
    soundManager.playSuccess()
  }

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 bg-[#0a0a0c]/85 shadow-2xl flex flex-col min-h-[580px]">
      
      {/* 1. Header Bar: Workspace Selectors */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/5 px-6 py-4 bg-black/45 select-none">
        <div className="flex items-center gap-2">
          <TerminalSquare className="h-4 w-4 text-[#22d3ee]" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#f8fafc] uppercase">DEVELOPER WORKSPACE IDE</span>
        </div>

        {/* Tab Project Buttons */}
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {PROJECTS_WORKSPACE.map((proj) => {
            const isActive = activeProj.id === proj.id
            return (
              <button
                key={proj.id}
                onClick={() => {
                  soundManager.playTick()
                  setActiveProj(proj)
                }}
                data-magnetic
                className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold font-mono transition-all ${
                  isActive
                    ? 'bg-[#22d3ee]/15 border-[#22d3ee] text-[#22d3ee]'
                    : 'bg-black/60 border-white/5 text-[#94a3b8]/60 hover:border-white/10'
                }`}
              >
                {proj.id.toUpperCase()} DOCK
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Workspace Body: Left Explorer, Right Editor & Compiler */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[200px_1fr] min-h-[380px]">
        
        {/* Left Side: Directory Explorer */}
        <div className="border-r border-white/5 bg-black/30 p-4 select-none flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[8px] font-bold text-[#94a3b8]/50 uppercase tracking-widest block font-mono">WORKSPACE DIRECTORY</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-white/70 font-semibold font-mono">
                <Folder className="h-4 w-4 text-[#22d3ee]" />
                <span>src/</span>
              </div>
              <div className="pl-4 space-y-1.5">
                {activeProj.files.map((file) => {
                  const isCurrent = selectedFile.name === file.name
                  return (
                    <button
                      key={file.name}
                      onClick={() => {
                        soundManager.playTick()
                        setSelectedFile(file)
                      }}
                      data-magnetic
                      className={`w-full flex items-center gap-2 text-[11px] font-mono text-left py-1 px-2 rounded transition-colors ${
                        isCurrent 
                          ? 'bg-[#22d3ee]/10 text-[#22d3ee] font-semibold' 
                          : 'text-[#94a3b8]/75 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <FileCode className="h-3.5 w-3.5" />
                      <span>{file.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3 mt-4 text-[8px] text-[#94a3b8]/40 font-mono tracking-widest uppercase">
            STATUS: SYNCHRONIZED
          </div>
        </div>

        {/* Right Side: Split Editor & Terminal */}
        <div className="flex flex-col h-full bg-[#0d0d10]/40">
          
          {/* Syntax Code Editor Container */}
          <div className="flex-1 p-4 font-mono text-[10.5px] leading-relaxed text-[#94a3b8] overflow-y-auto max-h-[340px] border-b border-white/5 relative">
            
            {/* Editor File Bar */}
            <div className="absolute top-2 right-4 text-[8px] bg-black/60 border border-white/5 text-[#22d3ee] px-2 py-0.5 rounded uppercase tracking-wider select-none font-bold">
              {selectedFile.language.toUpperCase()} EDITOR
            </div>

            {/* Line Number Rendering & File Code Text */}
            <div className="flex gap-4">
              <div className="text-white/20 select-none text-right pr-2 border-r border-white/5 min-w-[20px]">
                {selectedFile.content.split('\n').map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>
              <pre className="flex-1 whitespace-pre-wrap select-text pr-4 leading-normal text-emerald-400/90 selection:bg-white/10">
                {selectedFile.content}
              </pre>
            </div>
          </div>

          {/* Console Output Terminal */}
          <div className="h-[220px] bg-black/95 p-4 font-mono text-[9px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 select-none">
              <div className="flex items-center gap-2 text-white/50">
                <Terminal className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wider">WORKSPACE COMPILER SHELL</span>
              </div>
              <div className="flex gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-white/40">100% SECURE</span>
              </div>
            </div>

            {/* Terminal logs list */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-1 text-emerald-400 select-text max-h-[140px]">
              {terminalHistory.map((line, idx) => (
                <div 
                  key={idx} 
                  className={line.startsWith('$') ? 'text-[#22d3ee] font-bold' : 'text-emerald-400/85'}
                >
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Build execution action bar */}
            <div className="border-t border-white/5 pt-2 mt-2 flex items-center justify-between select-none">
              <span className="text-[#94a3b8]/45 text-[8px] tracking-wider">SHELL INSTANCE: v1.0.8</span>
              
              <button
                onClick={runSimulation}
                disabled={isCompiling}
                data-magnetic
                className={`px-4 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  isCompiling 
                    ? 'bg-white/5 text-[#94a3b8]/30 cursor-not-allowed border border-white/5' 
                    : 'bg-[#22d3ee] text-black hover:scale-[1.02]'
                }`}
              >
                {isCompiling ? (
                  <>
                    <Layers className="h-3.5 w-3.5 animate-spin" />
                    <span>EXECUTING...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-black" />
                    <span>{activeProj.simText.toUpperCase()}</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ProjectWorkstation

