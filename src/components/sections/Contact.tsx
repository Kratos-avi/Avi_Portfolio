import React from 'react'
import {
  Mail,
  Phone,
  ExternalLink,
  MapPin,
  ArrowRight,
  Check,
  Send,
} from 'lucide-react'
import { soundManager } from '../../utils/SoundManager'

interface ContactProps {
  flipped: boolean
  setFlipped: (f: boolean) => void
  formData: { name: string; email: string; message: string }
  formSubmitted: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleFormSubmit: (e: React.FormEvent) => void
}

export function Contact({
  flipped,
  setFlipped,
  formData,
  formSubmitted,
  handleInputChange,
  handleFormSubmit,
}: ContactProps) {
  return (
    <section id="contact" className="scroll-section relative z-10 px-4 py-24 md:px-8 border-t border-white/5">
      <div className="mx-auto max-w-4xl text-center mb-12">
        <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase font-bold block mb-1">
          <span className="text-primary/50">//05</span> Contact
        </span>
        <h2 className="text-4xl sm:text-5xl font-serif mt-2 font-medium tracking-tight text-[#f8fafc]">
          Establish Contact.
        </h2>
        <p className="text-sm text-[#94a3b8] mt-3 max-w-lg mx-auto">
          Click the holographic card below to flip between direct coordinates and the secure messaging payload screen.
        </p>
      </div>

      {/* 3D Flipping Container */}
      <div className="mx-auto max-w-xl h-[420px] w-full" data-cursor-text="FLIP CONTACT CARD PAYLOAD">
        <div 
          className={`flip-card w-full h-full cursor-pointer ${flipped ? 'flipped' : ''}`} 
          onClick={() => {
            if (!flipped) {
              setFlipped(true)
              soundManager.playSuccess()
            }
          }}
        >
          <div className="flip-card-inner">
            
            {/* Front Face: Contact Info */}
            <div className="flip-card-front">
              <div className="holo-card p-8 rounded-[2rem] flex flex-col justify-between h-full hover:border-primary/40 transition-all select-none">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">Avinash.S DOCK</span>
                    <span className="text-[9px] bg-primary/15 text-primary font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Active Connection</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#f8fafc] mt-8 leading-tight">
                    Avinash Suhagiya
                  </h3>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    IT Diagnostics Specialist & Developer
                  </p>
 
                  <div className="mt-6 space-y-3.5 text-xs text-[#94a3b8]">
                    <a href="mailto:avisuhagiya007@gmail.com" className="flex items-center gap-3 hover:text-primary transition-colors">
                      <Mail className="h-4.5 w-4.5 text-primary" />
                      <span>avisuhagiya007@gmail.com</span>
                    </a>
                    <a href="tel:+12266068863" className="flex items-center gap-3 hover:text-primary transition-colors">
                      <Phone className="h-4.5 w-4.5 text-primary" />
                      <span>+1 226-606-8863</span>
                    </a>
                    <a href="https://www.linkedin.com/in/avinashsuhagiya007" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                      <ExternalLink className="h-4.5 w-4.5 text-primary" />
                      <span>linkedin.com/in/avinashsuhagiya007</span>
                    </a>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4.5 w-4.5 text-primary" />
                      <span>Ontario, Canada</span>
                    </div>
                  </div>
                </div>
 
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                  <span className="text-[10px] text-[#94a3b8]/60 uppercase tracking-widest font-mono font-bold">Click card to compose message</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-black">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
 
            {/* Back Face: Contact Form */}
            <div className="flip-card-back" onClick={(e) => e.stopPropagation()}>
              <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-center mb-4 select-none">
                    <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">Payload Form</span>
                    <button 
                      onClick={() => {
                        setFlipped(false)
                        soundManager.playSuccess()
                      }}
                      className="text-[10px] text-[#94a3b8] hover:text-primary uppercase tracking-wider font-mono"
                    >
                      [ Back ]
                    </button>
                  </div>
 
                  {formSubmitted ? (
                    <div className="flex flex-col items-center justify-center h-[260px] text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/35 animate-pulse">
                        <Check className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-lg font-bold text-[#f8fafc]">Payload Transmitted</h4>
                      <p className="text-xs text-[#94a3b8] mt-1 max-w-[28ch]">
                        I will process your inquiry and establish coordinates shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#94a3b8]/70 block mb-1">Name</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="John Doe"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#f8fafc] focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#94a3b8]/70 block mb-1">Email</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="john@example.com"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#f8fafc] focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#94a3b8]/70 block mb-1">Message</label>
                        <textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          placeholder="Hello, I would like to discuss..."
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#f8fafc] focus:outline-none focus:border-primary resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-black transition-transform hover:scale-[1.01]"
                      >
                        <span>Transmit Message</span>
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
 
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact

