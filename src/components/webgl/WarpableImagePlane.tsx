import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface WarpableImagePlaneProps {
  imageSrc: string
  alt: string
  accent?: string
}

export function WarpableImagePlane({ imageSrc, alt, accent }: WarpableImagePlaneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const planeMeshRef = useRef<THREE.Mesh | null>(null)
  const uniformsRef = useRef<{
    uTexture: { value: THREE.Texture | null }
    uOffset: { value: THREE.Vector2 }
  }>({
    uTexture: { value: null },
    uOffset: { value: new THREE.Vector2(0, 0) }
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create scene, camera, and renderer
    const scene = new THREE.Scene()
    const width = container.clientWidth || 320
    const height = container.clientHeight || 180

    // Set up a perspective camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 2.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Load the image texture
    const loader = new THREE.TextureLoader()
    const texture = loader.load(imageSrc, (tex) => {
      tex.generateMipmaps = false
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
    })

    // Custom Shaders for fluid distortion
    const vertexShader = `
      uniform vec2 uOffset;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Fluid ripple deformation proportional to movement offsets
        float dist = distance(uv, vec2(0.5));
        
        // Warp Z (depth) coordinate based on vertical velocity
        pos.z += sin(uv.x * 3.14159) * sin(uv.y * 3.14159) * uOffset.y * 0.45 * (1.0 - dist * 0.5);
        // Warp X coordinate slightly based on horizontal movement
        pos.x += sin(uv.y * 3.14159) * uOffset.x * 0.15;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uOffset;
      varying vec2 vUv;
      void main() {
        // Displace UVs according to velocity vectors to create elastic fluid distortion
        vec2 displacedUv = vUv;
        displacedUv.x += sin(vUv.y * 6.28) * uOffset.x * 0.08;
        displacedUv.y += sin(vUv.x * 6.28) * uOffset.y * 0.08;
        
        // Keep UVs bounded
        displacedUv = clamp(displacedUv, 0.0, 1.0);
        
        vec4 texColor = texture2D(uTexture, displacedUv);
        gl_FragColor = texColor;
      }
    `

    // Initialize uniforms
    uniformsRef.current.uTexture.value = texture

    // Material with custom shaders
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
      side: THREE.DoubleSide
    })

    // Create a mesh plane with enough segments for smooth bending
    const geometry = new THREE.PlaneGeometry(2.8, 1.6, 32, 32)
    const planeMesh = new THREE.Mesh(geometry, material)
    scene.add(planeMesh)
    planeMeshRef.current = planeMesh

    // Track scroll velocity, drag velocity, and mouse positions
    let lastScrollY = window.scrollY
    const scrollContainer = document.querySelector('.scroll-container')
    if (scrollContainer) {
      lastScrollY = scrollContainer.scrollTop
    }

    let scrollVelocity = 0
    let dragVelocityX = 0
    let dragVelocityY = 0

    // Interaction states
    let isDragging = false
    let startMouseX = 0
    let startMouseY = 0
    let targetRotationX = 0
    let targetRotationY = 0

    // Handlers
    const handleScroll = () => {
      let currentScrollY = window.scrollY
      if (scrollContainer) {
        currentScrollY = scrollContainer.scrollTop
      }
      const diff = currentScrollY - lastScrollY
      scrollVelocity = diff * 0.02
      lastScrollY = currentScrollY
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Normalize mouse coordinates around the center (-0.5 to 0.5)
      const nx = (x / rect.width) - 0.5
      const ny = (y / rect.height) - 0.5

      // Set target tilts (limited angles)
      targetRotationY = nx * 0.35
      targetRotationX = ny * -0.35

      if (isDragging) {
        const dx = e.clientX - startMouseX
        const dy = e.clientY - startMouseY
        dragVelocityX = dx * 0.005
        dragVelocityY = dy * 0.005
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      startMouseX = e.clientX
      startMouseY = e.clientY
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    const handleMouseLeave = () => {
      isDragging = false
      targetRotationX = 0
      targetRotationY = 0
    }

    // Attach listeners
    window.addEventListener('scroll', handleScroll, true)
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('mouseleave', handleMouseLeave)

    // Resize handling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width
        const newHeight = entry.contentRect.height
        renderer.setSize(newWidth, newHeight)
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
      }
    })
    resizeObserver.observe(container)

    // Render loop
    let animationFrameId = 0
    const tick = () => {
      // Smoothly tilt mesh on hover
      if (planeMesh) {
        planeMesh.rotation.x = THREE.MathUtils.lerp(planeMesh.rotation.x, targetRotationX, 0.08)
        planeMesh.rotation.y = THREE.MathUtils.lerp(planeMesh.rotation.y, targetRotationY, 0.08)
      }

      // Decelerate velocities and decay scroll offsets back to zero
      scrollVelocity = THREE.MathUtils.lerp(scrollVelocity, 0, 0.08)
      dragVelocityX = THREE.MathUtils.lerp(dragVelocityX, 0, 0.08)
      dragVelocityY = THREE.MathUtils.lerp(dragVelocityY, 0, 0.08)

      // Set uniform offsets
      uniformsRef.current.uOffset.value.set(
        dragVelocityX,
        scrollVelocity + dragVelocityY
      )

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(tick)
    }
    tick()

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('mouseup', handleMouseUp)
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mousedown', handleMouseDown)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
      resizeObserver.disconnect()

      // Dispose resources
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [imageSrc])

  return (
    <div className="relative w-full h-[180px] overflow-hidden rounded-[1.35rem] bg-black/40 border border-white/5 cursor-grab active:cursor-grabbing">
      {/* 3D WebGL Canvas container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Screen gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-[#070709] pointer-events-none" />

      {/* Fallback element for accessible SEO reading and screen readers */}
      <img
        src={imageSrc}
        alt={alt}
        className="sr-only"
        aria-hidden="true"
      />

      {accent && (
        <div className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/80 px-3 py-1 text-[9px] uppercase tracking-[0.25em] text-[#22d3ee] backdrop-blur-sm pointer-events-none select-none">
          {accent}
        </div>
      )}
    </div>
  )
}

export default WarpableImagePlane

