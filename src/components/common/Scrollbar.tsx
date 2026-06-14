interface ScrollbarProps {
  activeSection: string
  onSectionClick: (sectionId: string) => void
}

const SECTIONS = [
  { id: 'hero', num: '01', label: 'Core Identity' },
  { id: 'experience', num: '02', label: 'Cosmic Trajectory' },
  { id: 'projects', num: '03', label: 'Gravity Pull' },
  { id: 'sandbox', num: '04', label: 'Quantum Matrix' },
  { id: 'contact', num: '05', label: 'Event Horizon' },
]

export function Scrollbar({ activeSection, onSectionClick }: ScrollbarProps) {
  return (
    <div className="hidden md:flex floating-scrollbar">
      {SECTIONS.map((section) => {
        let isActive = activeSection === section.id
        if (section.id === 'hero' && activeSection === 'about') {
          isActive = true
        }
        if (section.id === 'experience' && (activeSection === 'features' || activeSection === 'experience')) {
          isActive = true
        }
        if (section.id === 'contact' && (activeSection === 'resume' || activeSection === 'contact')) {
          isActive = true
        }
        
        return (
          <div
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={`floating-scrollbar__item ${isActive ? 'active' : ''}`}
          >
            <span className="floating-scrollbar__label">
              //{section.num} {section.label}
            </span>
            <div className="floating-scrollbar__dot-wrapper">
              <div className="floating-scrollbar__dot" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Scrollbar

