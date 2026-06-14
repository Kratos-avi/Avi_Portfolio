class SoundManager {
  private ctx: AudioContext | null = null
  public isMuted = true

  // Ambient synth loop handles
  private droneOsc: OscillatorNode | null = null
  private droneOsc2: OscillatorNode | null = null // secondary oscillator for warmth
  private droneFilter: BiquadFilterNode | null = null
  private droneLfo: OscillatorNode | null = null
  private droneLfoGain: GainNode | null = null
  private droneGain: GainNode | null = null
  private droneVolume = 0.05 // Faint ambient hum by default

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted
    if (!this.isMuted) {
      this.initCtx()
      this.startDrone()
    } else {
      this.stopDrone()
    }
    return this.isMuted
  }

  public startDrone() {
    if (this.isMuted) return
    try {
      this.initCtx()
      if (!this.ctx) return

      if (this.droneOsc) return // Already humming

      this.droneOsc = this.ctx.createOscillator()
      this.droneOsc2 = this.ctx.createOscillator()
      this.droneLfo = this.ctx.createOscillator()
      this.droneLfoGain = this.ctx.createGain()
      this.droneFilter = this.ctx.createBiquadFilter()
      this.droneGain = this.ctx.createGain()

      // Primary pitch: Low frequency hum (55Hz / A1)
      this.droneOsc.type = 'sawtooth'
      this.droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime)

      // Secondary pitch: offset slightly (55.4Hz) for an analog chorus beat frequency
      this.droneOsc2.type = 'sine'
      this.droneOsc2.frequency.setValueAtTime(55.4, this.ctx.currentTime)

      // Lowpass Filter for subtractive synthesis
      this.droneFilter.type = 'lowpass'
      this.droneFilter.frequency.setValueAtTime(75, this.ctx.currentTime)
      this.droneFilter.Q.setValueAtTime(2.0, this.ctx.currentTime) // moderate resonance for sweeps

      // LFO modulates the filter cutoff frequency for breathing effect
      this.droneLfo.type = 'sine'
      this.droneLfo.frequency.setValueAtTime(0.2, this.ctx.currentTime) // slow sweep rate
      this.droneLfoGain.gain.setValueAtTime(16.0, this.ctx.currentTime) // mod depth

      // Connections
      this.droneLfo.connect(this.droneLfoGain)
      this.droneLfoGain.connect(this.droneFilter.frequency)

      this.droneOsc.connect(this.droneFilter)
      this.droneOsc2.connect(this.droneFilter)
      
      this.droneFilter.connect(this.droneGain)
      this.droneGain.connect(this.ctx.destination)

      this.droneGain.gain.setValueAtTime(this.droneVolume * 0.05, this.ctx.currentTime)

      this.droneOsc.start()
      this.droneOsc2.start()
      this.droneLfo.start()
    } catch (e) {
      console.warn('Drone synthesis blocked or failed:', e)
    }
  }

  public stopDrone() {
    try {
      if (this.droneOsc) {
        this.droneOsc.stop()
        this.droneOsc.disconnect()
        this.droneOsc = null
      }
      if (this.droneOsc2) {
        this.droneOsc2.stop()
        this.droneOsc2.disconnect()
        this.droneOsc2 = null
      }
      if (this.droneLfo) {
        this.droneLfo.stop()
        this.droneLfo.disconnect()
        this.droneLfo = null
      }
      if (this.droneLfoGain) {
        this.droneLfoGain.disconnect()
        this.droneLfoGain = null
      }
      if (this.droneFilter) {
        this.droneFilter.disconnect()
        this.droneFilter = null
      }
      if (this.droneGain) {
        this.droneGain.disconnect()
        this.droneGain = null
      }
    } catch (e) {
      console.warn('Drone stop failed:', e)
    }
  }

  public updateSynthParams(mouseX: number, mouseY: number) {
    if (this.isMuted || !this.ctx || !this.droneFilter || !this.droneLfo) return
    try {
      // Map mouseY [-1..1] to filter frequency [60Hz .. 130Hz]
      const targetFreq = 75 + (mouseY + 1) * 35
      this.droneFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1)

      // Map mouseX [-1..1] to LFO rate [0.08Hz .. 0.9Hz]
      const targetRate = 0.15 + (mouseX + 1) * 0.4
      this.droneLfo.frequency.setTargetAtTime(targetRate, this.ctx.currentTime, 0.2)
    } catch {
      // Audio nodes busy
    }
  }

  public setDroneVolume(volume: number) {
    this.droneVolume = volume
    if (volume === 0) {
      this.stopDrone()
    } else {
      if (this.isMuted) {
        this.isMuted = false
      }
      this.initCtx()
      if (!this.droneOsc) {
        this.startDrone()
      }
      if (this.droneGain && this.ctx) {
        this.droneGain.gain.setTargetAtTime(volume * 0.05, this.ctx.currentTime, 0.1)
      }
    }
  }

  public playTick(panValue = 0) {
    if (this.isMuted) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1350, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04)

      // Setup stereo spatial panning
      if (this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner()
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panValue)), this.ctx.currentTime)
        osc.connect(gain)
        gain.connect(panner)
        panner.connect(this.ctx.destination)
      } else {
        osc.connect(gain)
        gain.connect(this.ctx.destination)
      }

      osc.start()
      osc.stop(this.ctx.currentTime + 0.04)
    } catch (e) {
      console.warn('Audio tick failed:', e)
    }
  }

  public playSuccess(panValue = 0) {
    if (this.isMuted) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(900, this.ctx.currentTime)
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.18)

      if (this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner()
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panValue)), this.ctx.currentTime)
        osc.connect(gain)
        gain.connect(panner)
        panner.connect(this.ctx.destination)
      } else {
        osc.connect(gain)
        gain.connect(this.ctx.destination)
      }

      osc.start()
      osc.stop(this.ctx.currentTime + 0.18)
    } catch (e) {
      console.warn('Audio success failed:', e)
    }
  }
}

export const soundManager = new SoundManager()
export default soundManager

