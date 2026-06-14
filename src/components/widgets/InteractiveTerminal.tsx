import React, { useState, useRef, useEffect } from 'react'
import { soundManager } from '../../utils/SoundManager'
import { Terminal, Gamepad2 } from 'lucide-react'

interface HistoryItem {
  type: 'input' | 'output'
  text: string
}

type Mode = 'shell' | 'matrix' | 'game'

export function InteractiveTerminal() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'output', text: 'AVINASH SHELL [Version 1.0.8]' },
    { type: 'output', text: 'Type "help" to view diagnostic vectors.' },
    { type: 'output', text: '' },
  ])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('shell')
  
  const consoleEndRef = useRef<HTMLDivElement | null>(null)
  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Snake Game State Refs (to avoid loop dependency issues)
  const snakeRef = useRef<Array<{ x: number; y: number }>>([{ x: 10, y: 10 }])
  const directionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 })
  const appleRef = useRef<{ x: number; y: number }>({ x: 5, y: 5 })
  const scoreRef = useRef(0)
  const gameOverRef = useRef(false)

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, mode])

  // 1. Falling Matrix rain effect
  useEffect(() => {
    if (mode !== 'matrix') return

    const canvas = matrixCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.parentElement?.clientWidth || 500
    canvas.height = 300

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@*&%'
    const fontSize = 11
    const columns = canvas.width / fontSize

    const rainDrops: number[] = []
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1
    }

    const intervalId = setInterval(() => {
      ctx.fillStyle = 'rgba(7, 7, 9, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#34D399'
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length))
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize)

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0
        }
        rainDrops[i]++
      }
    }, 33)

    return () => clearInterval(intervalId)
  }, [mode])

  // 2. Playable Snake Game effect
  useEffect(() => {
    if (mode !== 'game') return

    const canvas = gameCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 300
    canvas.height = 200

    const gridSize = 10
    const w = canvas.width / gridSize
    const h = canvas.height / gridSize

    const spawnApple = (width: number, height: number) => {
      appleRef.current = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
      }
    }

    // Reset game variables
    snakeRef.current = [{ x: Math.floor(w / 2), y: Math.floor(h / 2) }]
    directionRef.current = { x: 1, y: 0 }
    scoreRef.current = 0
    gameOverRef.current = false
    spawnApple(w, h)

    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = directionRef.current
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y !== 1) directionRef.current = { x: 0, y: -1 }
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y !== -1) directionRef.current = { x: 0, y: 1 }
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x !== 1) directionRef.current = { x: -1, y: 0 }
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x !== -1) directionRef.current = { x: 1, y: 0 }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    const gameLoop = setInterval(() => {
      if (gameOverRef.current) return

      const snake = [...snakeRef.current]
      const dir = directionRef.current
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }

      // Border check
      if (head.x < 0 || head.x >= w || head.y < 0 || head.y >= h) {
        endGame()
        return
      }

      // Self collision check
      for (const segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
          endGame()
          return
        }
      }

      // Move snake
      snake.unshift(head)

      // Apple collision check
      if (head.x === appleRef.current.x && head.y === appleRef.current.y) {
        scoreRef.current += 10
        soundManager.playSuccess()
        spawnApple(w, h)
      } else {
        snake.pop()
      }

      snakeRef.current = snake

      // Draw loop
      ctx.fillStyle = '#070709'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw Grid Border
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)'
      ctx.strokeRect(0, 0, canvas.width, canvas.height)

      // Draw Apple
      ctx.fillStyle = '#EF4444' // Red Apple
      ctx.fillRect(appleRef.current.x * gridSize + 1, appleRef.current.y * gridSize + 1, gridSize - 2, gridSize - 2)

      // Draw Snake
      ctx.fillStyle = '#22d3ee' // Gold head
      snake.forEach((seg, idx) => {
        if (idx > 0) ctx.fillStyle = '#22D3EE' // Cyan tail segments
        ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2)
      })

      // Draw Score Text
      ctx.fillStyle = '#f8fafc'
      ctx.font = '8px monospace'
      ctx.fillText(`SCORE: ${scoreRef.current}`, 6, 12)
    }, 100)

    const endGame = () => {
      gameOverRef.current = true
      ctx.fillStyle = 'rgba(7,7,9,0.85)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#EF4444'
      ctx.font = '12px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('CRITICAL SYSTEM FAILURE', canvas.width / 2, canvas.height / 2 - 10)
      ctx.fillStyle = '#f8fafc'
      ctx.font = '8px monospace'
      ctx.fillText(`FINAL SCORE: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 + 10)
      ctx.fillText('PRESS ENTER TO RESTART OR TYPE "EXIT"', canvas.width / 2, canvas.height / 2 + 25)
    }

    return () => {
      clearInterval(gameLoop)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mode])

  const runDiagnostic = async () => {
    const steps = [
      'INITIALIZING DIAGNOSTIC SUITE...',
      'SCANNING SYSTEM MEMORY BLOCKS...',
      'MEM CHECK: 16.0 GB ECC RAM [STATUS: PRISTINE]',
      'AUDITING NETWORK ROUTING PORTS...',
      'FW AUDIT: CLIENT TCP HANDSHAKES OK (PORT 443 Open)',
      'TEMPERATURE PROBE: CPU 42C / GPU 45C (STABLE)',
      'AWS DOCKET CHECK: SECURE IAM least-privilege ENFORCED',
      'DIAGNOSTICS COMPLETE. VECTORS FULLY COMPLIANT.'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 380))
      soundManager.playTick()
      setHistory((prev) => [...prev, { type: 'output', text: `  > ${steps[i]}` }])
    }
  }

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim().toLowerCase()
    if (!trimmedInput) return

    soundManager.playSuccess()

    if (mode === 'game' && gameOverRef.current && trimmedInput === '') {
      // Re-trigger game
      setMode('shell')
      setTimeout(() => setMode('game'), 50)
      setInput('')
      return
    }

    if (trimmedInput === 'clear') {
      setHistory([])
      setInput('')
      return
    }

    const newHistory = [...history, { type: 'input' as const, text: `Guest@AvinashPortfolio:~$ ${input}` }]
    let outputText: string

    switch (trimmedInput) {
      case 'help':
        outputText = `Available commands:
  about      - Prints professional biography summary
  skills     - Prints technical capabilities stack
  diagnostic - Runs complete hardware and network security audit
  game       - Boots playable C#/Unity retro console game (Snake)
  matrix     - Activates cascading green rain terminal overlay
  exit       - Disconnects screen overlays returning to shell
  clear      - Wipes diagnostics logs history`
        break
      case 'about':
        outputText = `Avinash Suhagiya - Creative Technologist & Developer.
Holds 2+ years of enterprise IT diagnostics (desktops, routing ports, firewalls) and 1 year of 3D rendering pipeline specialist experience. Diploma in Mobile and Web Dev from Conestoga College ('26).`
        break
      case 'skills':
        outputText = `DEPLOYMENT: AWS (EC2, S3, Lambda, ALB, Auto Scaling), Terraform (IaC), Git.
DEVELOPMENT: Flutter (Dart), Node.js, Express, Kotlin, JavaScript, REST APIs.
DATABASES: MySQL, SQLite, JSON Web Tokens (JWT).
CREATIVE: C# / Unity, Game Physics, Figma, 3D Rendering & Animation.`
        break
      case 'matrix':
        setMode('matrix')
        outputText = 'Code matrix rain activated. Type "exit" to return to shell stdout.'
        break
      case 'game':
        setMode('game')
        outputText = 'Booting Unity physics simulation mockup. Use Arrow Keys or WASD to steer.'
        break
      case 'diagnostic':
        setHistory(newHistory)
        setInput('')
        runDiagnostic()
        return
      case 'exit':
        if (mode !== 'shell') {
          setMode('shell')
          outputText = 'Direct overlay stream closed. Shell terminal restored.'
        } else {
          outputText = 'Console is already active. Type "matrix" or "game" to trigger overlays.'
        }
        break
      default:
        outputText = `Shell error: Command "${input}" not recognized. Type "help" for parameters.`
    }

    setHistory([...newHistory, { type: 'output' as const, text: outputText }])
    setInput('')
  }

  const handleKeyPress = () => {
    soundManager.playTick()
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <div 
      className="relative glass-panel rounded-2xl p-6 bg-[#070709]/95 border border-white/5 font-mono text-xs text-[#34D399] min-h-[360px] flex flex-col justify-between"
      onClick={focusInput}
    >
      {/* 1. Falling Matrix Screen */}
      {mode === 'matrix' && (
        <div className="absolute inset-0 z-20 rounded-2xl overflow-hidden bg-black/90 pointer-events-none">
          <canvas ref={matrixCanvasRef} className="w-full h-full opacity-90" />
          <div className="absolute bottom-4 left-6 text-[10px] text-white/50 animate-pulse font-mono">
            Type "exit" to restore terminal stdout
          </div>
        </div>
      )}

      {/* 2. Embedded Playable Game Canvas */}
      {mode === 'game' && (
        <div className="absolute inset-0 z-20 rounded-2xl overflow-hidden bg-black/90 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2 select-none">
            <Gamepad2 className="h-4 w-4 text-[#22d3ee]" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Playable Arcade Mockup</span>
          </div>
          <canvas ref={gameCanvasRef} className="border border-white/10 rounded" />
          <div className="mt-3 text-[9px] text-[#94a3b8]/70 text-center select-none font-mono">
            W/A/S/D or Arrow Keys to steer. Type "exit" to close game.
          </div>
        </div>
      )}

      {/* Terminal Title Bar */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4 select-none">
        <div className="flex items-center gap-2 text-white/70">
          <Terminal className="h-4 w-4 text-[#22d3ee]" />
          <span className="text-[10px] uppercase tracking-wider font-bold">Diagnose Shell v1.0.8</span>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500/60" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/60" />
          <span className="h-2 w-2 rounded-full bg-green-500/60" />
        </div>
      </div>

      {/* Terminal stdout logs */}
      <div className="flex-grow overflow-y-auto max-h-[220px] mb-4 space-y-2.5 pr-2 select-text">
        {history.map((item, idx) => (
          <div 
            key={idx} 
            className={item.type === 'input' ? 'text-[#22d3ee]' : 'text-emerald-400/90 whitespace-pre-line'}
          >
            {item.text}
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>

      {/* Command Form */}
      <form onSubmit={handleCommandSubmit} className="relative z-30 border-t border-white/5 pt-3 flex items-center gap-3">
        <span className="text-[#22d3ee] select-none">Guest@AvinashPortfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-grow bg-transparent border-none outline-none text-[#f8fafc] font-mono text-xs focus:ring-0 p-0"
          placeholder="type 'help'..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </form>
    </div>
  )
}

