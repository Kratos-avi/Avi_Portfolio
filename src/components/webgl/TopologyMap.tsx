import { useState } from 'react'
import { soundManager } from '../../utils/SoundManager'
import { Server, Database, Cloud, ShieldAlert, Cpu } from 'lucide-react'

interface NodeData {
  id: string
  label: string
  type: 'gateway' | 'compute' | 'storage' | 'database' | 'security'
  x: number
  y: number
  description: string
  metrics: string[]
}

const NODES: NodeData[] = [
  {
    id: 'alb',
    label: 'Application Load Balancer',
    type: 'gateway',
    x: 80,
    y: 150,
    description: 'Directs incoming client traffic down to redundant targets, offloading secure SSL handshakes.',
    metrics: ['Routing: Round-Robin', 'Port: 443 HTTPS', 'Status: Active']
  },
  {
    id: 'asg',
    label: 'Auto Scaling Group',
    type: 'compute',
    x: 220,
    y: 90,
    description: 'EC2 instances scaling dynamically based on metrics, ensuring stable response times.',
    metrics: ['Staged Nodes: 2 - 5 instances', 'Health: 100%', 'Metric: CPU Utilization']
  },
  {
    id: 'lambda',
    label: 'AWS Lambda (Serverless)',
    type: 'compute',
    x: 220,
    y: 210,
    description: 'Triggers atomic serverless scripts for media and database conversions on demand.',
    metrics: ['Execution Limit: 15s', 'Trigger: S3 uploads', 'Concurrences: Stable']
  },
  {
    id: 's3',
    label: 'Amazon S3 Bucket',
    type: 'storage',
    x: 360,
    y: 210,
    description: 'Secure static storage bucket storing document assets and rendered frame animations.',
    metrics: ['Bucket Size: 1.2 TB', 'Policy: Least-privilege IAM', 'Access: Secured']
  },
  {
    id: 'db',
    label: 'MySQL Relational DB',
    type: 'database',
    x: 360,
    y: 90,
    description: 'Main storage cluster, containing structured user records and schedule pipelines.',
    metrics: ['Database Engines: InnoDB', 'Auth: JWT Signatures', 'Status: Active']
  }
]

const CONNECTIONS = [
  { from: 'alb', to: 'asg' },
  { from: 'alb', to: 'lambda' },
  { from: 'asg', to: 'db' },
  { from: 'lambda', to: 's3' },
  { from: 's3', to: 'db' }
]

interface TopologyMapProps {
  activeNodes?: string[]
}

export function TopologyMap({ activeNodes = ['alb', 'asg', 'lambda', 's3', 'db'] }: TopologyMapProps) {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(NODES[0])

  const handleNodeClick = (node: NodeData) => {
    soundManager.playSuccess()
    setSelectedNode(node)
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'gateway':
        return <Cloud className="h-5 w-5 text-primary" />
      case 'compute':
        return <Cpu className="h-5 w-5 text-primary" />
      case 'storage':
        return <Server className="h-5 w-5 text-[#34D399]" />
      case 'database':
        return <Database className="h-5 w-5 text-[#EF4444]" />
      case 'security':
      default:
        return <ShieldAlert className="h-5 w-5 text-white" />
    }
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#101012]/60 select-none">
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
          Interactive Cloud Topology Visualizer
        </span>
        <span className="text-[9px] bg-primary/15 text-primary px-2 py-0.5 rounded uppercase tracking-wider font-mono">
          System Live
        </span>
      </div>

      {/* SVG Network diagram map */}
      <div className="relative w-full h-[300px] border border-white/5 rounded-xl bg-black/45 p-4 flex items-center justify-center">
        <svg viewBox="0 0 440 300" className="w-full h-full max-w-[420px]">
          {/* Draw Connection lines */}
          {CONNECTIONS.map((conn, idx) => {
            const fromNode = NODES.find((n) => n.id === conn.from)
            const toNode = NODES.find((n) => n.id === conn.to)
            if (!fromNode || !toNode) return null

            const isLinkActive = activeNodes.includes(conn.from) && activeNodes.includes(conn.to)

            return (
              <line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isLinkActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.02)'}
                strokeOpacity={isLinkActive ? 0.35 : 1}
                strokeWidth="1.5"
                strokeDasharray={isLinkActive ? '4 4' : '0'}
                className={isLinkActive ? 'animate-[dash_20s_linear_infinite] transition-all duration-500' : 'transition-all duration-500'}
              />
            )
          })}

          {/* Draw Node circles */}
          {NODES.map((node) => {
            const isSelected = selectedNode?.id === node.id
            const isActive = activeNodes.includes(node.id)
            return (
              <g
                key={node.id}
                onClick={() => {
                  if (isActive) handleNodeClick(node)
                }}
                className={`transition-all duration-300 ${isActive ? 'cursor-pointer group' : 'cursor-not-allowed pointer-events-none'}`}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="22"
                  style={isSelected ? { filter: 'drop-shadow(0 0 6px var(--primary))' } : undefined}
                  className={`transition-all duration-500 ${
                    isSelected
                      ? 'fill-primary/20 stroke-primary stroke-[2px]'
                      : isActive
                      ? 'fill-[#161618]/90 stroke-white/10 group-hover:stroke-primary/45 stroke-[1.5px]'
                      : 'fill-[#070709]/40 stroke-white/5 opacity-20 stroke-[1px]'
                  }`}
                />
                {/* Embedded HTML Icon */}
                <foreignObject
                  x={node.x - 10}
                  y={node.y - 10}
                  width="20"
                  height="20"
                  className={`pointer-events-none transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-10'}`}
                >
                  <div className="flex items-center justify-center w-full h-full">
                    {getNodeIcon(node.type)}
                  </div>
                </foreignObject>
                
                {/* Hover label */}
                <text
                  x={node.x}
                  y={node.y + 35}
                  textAnchor="middle"
                  className={`font-mono text-[8px] tracking-wider transition-colors duration-500 ${
                    isSelected ? 'fill-primary font-bold' : isActive ? 'fill-white/60 group-hover:fill-white' : 'fill-white/10'
                  }`}
                >
                  {node.id.toUpperCase()}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Selected Node Details Card */}
      {selectedNode && (
        <div className="mt-5 bg-black/45 border border-white/5 rounded-xl p-4 transition-all duration-500 animate-fadeIn">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-bold text-[#f8fafc] leading-tight">
              {selectedNode.label}
            </h4>
            <span className="text-[8px] text-[#94a3b8]/60 uppercase tracking-widest font-mono">
              Type: {selectedNode.type}
            </span>
          </div>
          
          <p className="text-xs text-[#94a3b8] mb-4 leading-relaxed">
            {selectedNode.description}
          </p>

          <div className="border-t border-white/5 pt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[10px] font-mono text-primary">
            {selectedNode.metrics.map((metric, idx) => (
              <span key={idx}>• {metric}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

