import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { soundManager } from '../../utils/SoundManager'

interface ThreeDWebGLBackgroundProps {
  gravity: number
  speed: number
  theme: string
  density: number
  wireframe: boolean
  glitch: boolean
}

const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uMouse;
  uniform float uGravity;
  uniform float uSpeed;

  attribute vec3 aColor;
  attribute float aSpeed;
  attribute vec3 aRandomness;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    
    vec3 pos = position;
    float radius = length(pos.xz);
    
    // Orbital mechanics: stars closer to core spin faster (Keplerian-ish rotation)
    float baseAngle = uTime * (uSpeed * 0.08 * aSpeed + (12.0 / (radius + 20.0)));
    float cosA = cos(baseAngle);
    float sinA = sin(baseAngle);
    
    // Rotate coordinates around Y-axis (galactic plane is XZ)
    vec3 rotatedPos = vec3(
      pos.x * cosA - pos.z * sinA,
      pos.y,
      pos.x * sinA + pos.z * cosA
    );

    // Dynamic mouse gravity swirler (Black Hole core simulation at cursor)
    // Convert normalized mouse coordinates [-1, 1] to world space units
    vec3 targetMouse = vec3(uMouse.x * 220.0, 0.0, -uMouse.y * 220.0);
    float distToMouse = distance(rotatedPos, targetMouse);
    
    if (distToMouse < 160.0) {
      float force = (160.0 - distToMouse) / 160.0;
      
      // Swirl rotation around the mouse gravity center
      float swirlAngle = force * 0.85 * (uGravity + 0.15);
      float cosS = cos(swirlAngle);
      float sinS = sin(swirlAngle);
      vec3 localPos = rotatedPos - targetMouse;
      
      rotatedPos = targetMouse + vec3(
        localPos.x * cosS - localPos.z * sinS,
        localPos.y,
        localPos.x * sinS + localPos.z * cosS
      );
      
      // Pull force towards the core center
      vec3 pullDir = normalize(targetMouse - rotatedPos);
      rotatedPos += pullDir * force * (uGravity * 55.0);
    }

    vec4 mvPosition = modelViewMatrix * vec4(rotatedPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Star sizing: make stars larger and stand out crisp and bright
    gl_PointSize = (3.5 + abs(aRandomness.y) * 0.15) * (450.0 / -mvPosition.z);
    
    // Fade out stars at the outer boundary edges and far camera plane
    float edgeFade = 1.0 - (radius / 270.0);
    vAlpha = clamp(edgeFade, 0.0, 1.0) * (1.0 - (-mvPosition.z / 1000.0));
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft circular radial gradient drawing (soft stars)
    float r = length(gl_PointCoord - vec2(0.5));
    if (r > 0.5) discard;
    
    float intensity = smoothstep(0.5, 0.0, r);
    
    // Core of star is bright warm white, borders are theme-colored arms
    vec3 starColor = mix(vColor, vec3(1.0, 0.96, 0.88), intensity * 0.6);
    
    gl_FragColor = vec4(starColor, intensity * vAlpha * 0.95);
  }
`

// Atmospheric sparkles shaders
const sparksVertexShader = `
  uniform float uTime;
  varying float vAlpha;
  
  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  }

  void main() {
    vec3 pos = position;
    
    float yOffset = mod(pos.y + uTime * 15.0 + hash(pos) * 600.0, 600.0) - 300.0;
    pos.y = yOffset;
    
    pos.x += sin(uTime * 0.4 + pos.y * 0.008) * 40.0;
    pos.z += cos(uTime * 0.35 + pos.x * 0.008) * 40.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    gl_PointSize = (2.2 + hash(pos.zxy) * 3.0) * (320.0 / -mvPosition.z);
    
    float edgeFade = 1.0 - (abs(pos.y) / 300.0);
    float twinkle = sin(uTime * (3.0 + hash(pos) * 4.0) + hash(pos.zxy) * 6.28) * 0.4 + 0.6;
    vAlpha = clamp(edgeFade, 0.0, 1.0) * (1.0 - (-mvPosition.z / 700.0)) * twinkle;
  }
`

const sparksFragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float r = length(gl_PointCoord - vec2(0.5));
    if (r > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, r);
    gl_FragColor = vec4(uColor, glow * vAlpha * 0.5);
  }
`

export function ThreeDWebGLBackground({
  gravity,
  speed,
  theme,
  density,
  wireframe,
  glitch,
}: ThreeDWebGLBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const mouseTargetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene & Camera setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    )
    camera.position.set(0, 0, 520)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    // Parsed Theme Colors
    const getThemeColor = () => {
      switch (theme) {
        case 'matrix':
          return new THREE.Color(0x34d399) // Emerald
        case 'cyan':
          return new THREE.Color(0x22d3ee) // Cyan
        case 'crimson':
          return new THREE.Color(0xef4444) // Red
        case 'gold':
        default:
          return new THREE.Color(0xd4af37) // Gold
      }
    }

    const themeColor = getThemeColor()

    // 1. Galaxy geometry construction (High Density for cinematic look)
    const starsCount = Math.floor(12000 * density)
    const branches = 3
    const maxRadius = 260.0
    const spinMultiplier = 1.1
    const randomPower = 3.5

    const positions = new Float32Array(starsCount * 3)
    const colors = new Float32Array(starsCount * 3)
    const starSpeeds = new Float32Array(starsCount)
    const starRandomness = new Float32Array(starsCount * 3)

    for (let i = 0; i < starsCount; i++) {
      const radius = Math.random() * maxRadius
      const spinAngle = radius * spinMultiplier
      const branchAngle = ((i % branches) / branches) * Math.PI * 2

      const randomX = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5 ? 1 : -1) * 45.0
      const randomY = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5 ? 1 : -1) * 22.0
      const randomZ = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5 ? 1 : -1) * 45.0

      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i * 3 + 1] = randomY
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      // Custom attributes to pass to shader
      starSpeeds[i] = 0.5 + Math.random() * 1.5
      starRandomness[i * 3] = randomX
      starRandomness[i * 3 + 1] = randomY
      starRandomness[i * 3 + 2] = randomZ

      // Multi-colored galaxy arms (Cyan, Blue, Purple)
      let armColor: THREE.Color
      const armIndex = i % branches
      if (armIndex === 0) {
        armColor = new THREE.Color(0xa855f7) // Nebular Purple
      } else if (armIndex === 1) {
        armColor = new THREE.Color(0x3b82f6) // Deep Cosmic Blue
      } else {
        armColor = new THREE.Color(0x00f0ff) // Vibrant Cyan
      }

      const mixedColor = armColor.clone()
      if (radius < maxRadius * 0.18) {
        // Star core is bright warm white
        mixedColor.lerp(new THREE.Color('#ffffff'), 0.85 - (radius / (maxRadius * 0.18)) * 0.45)
      } else {
        // Outer arms have subtle variations
        mixedColor.lerp(armColor, 0.5)
      }

      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }

    const galaxyGeometry = new THREE.BufferGeometry()
    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    galaxyGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3)) // Explicit standard name
    galaxyGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(starSpeeds, 1))
    galaxyGeometry.setAttribute('aRandomness', new THREE.BufferAttribute(starRandomness, 3))

    const uniforms = {
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: themeColor },
      uGravity: { value: gravity },
      uSpeed: { value: speed },
    }

    const galaxyMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const galaxyParticles = new THREE.Points(galaxyGeometry, galaxyMaterial)
    scene.add(galaxyParticles)

    // Optional orbital radar rings
    let orbitRing: THREE.LineLoop | null = null
    if (wireframe) {
      const ringGeometry = new THREE.BufferGeometry()
      const ringPoints = []
      const ringSegments = 64
      const ringRadius = 150.0
      for (let i = 0; i < ringSegments; i++) {
        const theta = (i / ringSegments) * Math.PI * 2
        ringPoints.push(Math.cos(theta) * ringRadius, 0, Math.sin(theta) * ringRadius)
      }
      ringGeometry.setAttribute('position', new THREE.Float32BufferAttribute(ringPoints, 3))
      const ringMaterial = new THREE.LineBasicMaterial({
        color: themeColor,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
      })
      orbitRing = new THREE.LineLoop(ringGeometry, ringMaterial)
      scene.add(orbitRing)
    }

    // 2. Central Core Nebulae Glow
    const coreCount = 200
    const coreGeometry = new THREE.BufferGeometry()
    const corePositions = new Float32Array(coreCount * 3)
    const coreColors = new Float32Array(coreCount * 3)

    for (let i = 0; i < coreCount; i++) {
      const radius = Math.random() * 45.0
      const angle = Math.random() * Math.PI * 2
      const elev = (Math.random() - 0.5) * 15.0

      corePositions[i * 3] = Math.cos(angle) * radius
      corePositions[i * 3 + 1] = elev
      corePositions[i * 3 + 2] = Math.sin(angle) * radius

      const color = themeColor.clone().lerp(new THREE.Color('#ffffff'), 0.75)
      coreColors[i * 3] = color.r
      coreColors[i * 3 + 1] = color.g
      coreColors[i * 3 + 2] = color.b
    }

    coreGeometry.setAttribute('position', new THREE.BufferAttribute(corePositions, 3))
    coreGeometry.setAttribute('aColor', new THREE.BufferAttribute(coreColors, 3))

    const coreMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec3 aColor;
        uniform float uTime;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vColor = aColor;
          vec3 pos = position;
          pos.x += sin(uTime * 0.8 + pos.y) * 1.5;
          pos.z += cos(uTime * 0.8 + pos.x) * 1.5;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = (6.0 + sin(uTime + pos.x) * 2.0) * (360.0 / -mvPosition.z);
          vAlpha = 1.0 - (length(pos) / 50.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          float intensity = smoothstep(0.5, 0.0, r);
          gl_FragColor = vec4(vColor, intensity * vAlpha * 0.5);
        }
      `,
      uniforms: {
        uTime: uniforms.uTime
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const coreMesh = new THREE.Points(coreGeometry, coreMaterial)
    scene.add(coreMesh)

    // 2.2 Supermassive Black Hole event horizon sphere & Accretion Disk (Interstellar style)
    const bhGeometry = new THREE.SphereGeometry(30, 32, 32)
    const bhMaterial = new THREE.MeshBasicMaterial({
      color: 0x010103, // absolute pitch black hole core
      transparent: true,
      opacity: 0.98
    })
    const blackHoleMesh = new THREE.Mesh(bhGeometry, bhMaterial)
    scene.add(blackHoleMesh)

    const diskGeometry = new THREE.RingGeometry(35, 120, 64)
    const diskMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          float dist = length(vPosition.xy);
          float angle = atan(vPosition.y, vPosition.x);
          float spiral = sin(angle * 4.0 - dist * 0.12 + uTime * 2.2) * 0.5 + 0.5;
          
          float alpha = smoothstep(35.0, 50.0, dist) * smoothstep(120.0, 75.0, dist);
          
          vec3 plasmaColor = mix(uColor, vec3(1.0, 0.95, 0.7), spiral * 0.45);
          float innerGlow = smoothstep(42.0, 35.0, dist) * 2.5;
          plasmaColor += vec3(1.0, 0.8, 0.4) * innerGlow;
          
          gl_FragColor = vec4(plasmaColor, alpha * 0.8);
        }
      `,
      uniforms: {
        uTime: uniforms.uTime,
        uColor: uniforms.uColor
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
    const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial)
    accretionDisk.rotation.x = Math.PI * 0.45 // tilted Gargantua disc
    accretionDisk.rotation.y = Math.PI * 0.05
    scene.add(accretionDisk)

    // 2.3 NEW: COSMIC COORDINATES NAV GRID CAGE (Fictional Spaceship Nav HUD)
    const navCageGeom = new THREE.SphereGeometry(245, 12, 12)
    const navCageMat = new THREE.MeshBasicMaterial({
      color: themeColor,
      wireframe: true,
      transparent: true,
      opacity: 0.035,
      blending: THREE.AdditiveBlending
    })
    const navCage = new THREE.Mesh(navCageGeom, navCageMat)
    scene.add(navCage)

    // 2.4 NEW: PROCEDURAL 3D ASTEROID BELT
    const asteroidGroup = new THREE.Group()
    const asteroidsCount = Math.floor(95 * density)
    const asteroidsData: Array<{
      mesh: THREE.Group
      orbitRadius: number
      angle: number
      orbitSpeed: number
      spinSpeedX: number
      spinSpeedY: number
    }> = []

    for (let i = 0; i < asteroidsCount; i++) {
      const asteroid = new THREE.Group()
      
      const size = 1.0 + Math.random() * 2.5
      // Scanned rocky geometry
      const geom = new THREE.DodecahedronGeometry(size, 0)
      
      // 1. Dark core
      const astCoreMat = new THREE.MeshBasicMaterial({
        color: 0x05050a,
        transparent: true,
        opacity: 0.88
      })
      const astCore = new THREE.Mesh(geom, astCoreMat)
      asteroid.add(astCore)
      
      // 2. Outer glow scanned shell
      const astShellMat = new THREE.MeshBasicMaterial({
        color: themeColor,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      })
      const astShell = new THREE.Mesh(geom, astShellMat)
      asteroid.add(astShell)

      // Placement parameters (swirling orbit)
      const orbitRadius = 125 + Math.random() * 55
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 16

      asteroid.position.set(
        Math.cos(angle) * orbitRadius,
        height,
        Math.sin(angle) * orbitRadius
      )

      // Random starting rotation
      asteroid.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )

      // Random scales
      const scaleY = 0.8 + Math.random() * 0.6
      const scaleX = 0.8 + Math.random() * 0.6
      asteroid.scale.set(scaleX, scaleY, 1.0)

      asteroidGroup.add(asteroid)

      asteroidsData.push({
        mesh: asteroid,
        orbitRadius,
        angle,
        orbitSpeed: (0.01 + Math.random() * 0.015) * (Math.random() < 0.5 ? 1 : -1),
        spinSpeedX: (Math.random() - 0.5) * 0.015,
        spinSpeedY: (Math.random() - 0.5) * 0.015
      })
    }
    scene.add(asteroidGroup)

    // 2.5 NEW: ORBITAL DIGITAL SCANNED PLANETS
    // Planet 1: Inner scanned cyber planet (Alpha)
    const planet1Group = new THREE.Group()
    const p1OrbitRadius = 85
    let p1Angle = Math.random() * Math.PI * 2

    const p1Geom = new THREE.SphereGeometry(4.2, 10, 10)
    const p1CoreMat = new THREE.MeshBasicMaterial({ color: 0x030306 })
    const p1Core = new THREE.Mesh(p1Geom, p1CoreMat)
    planet1Group.add(p1Core)

    const p1WireMat = new THREE.MeshBasicMaterial({
      color: themeColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    })
    const p1Wire = new THREE.Mesh(p1Geom, p1WireMat)
    planet1Group.add(p1Wire)

    // Orbital satellite tracking ring around Planet 1
    const p1RingGeom = new THREE.RingGeometry(6.0, 7.8, 24)
    const p1RingMat = new THREE.MeshBasicMaterial({
      color: themeColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12,
      wireframe: true
    })
    const p1Ring = new THREE.Mesh(p1RingGeom, p1RingMat)
    p1Ring.rotation.x = Math.PI * 0.38
    planet1Group.add(p1Ring)
    scene.add(planet1Group)

    // Planet 2: Outer Gas Giant (Beta) with Saturation Accretion Ring & Moon
    const planet2Group = new THREE.Group()
    const p2OrbitRadius = 195
    let p2Angle = Math.random() * Math.PI * 2

    const p2Geom = new THREE.SphereGeometry(8.5, 16, 16)
    const p2CoreMat = new THREE.MeshBasicMaterial({ color: 0x030306 })
    const p2Core = new THREE.Mesh(p2Geom, p2CoreMat)
    planet2Group.add(p2Core)

    // Gas giant cloud bands striped custom shader
    const p2ShaderMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          // Horizontal stripes
          float stripes = sin(vUv.y * 30.0) * 0.5 + 0.5;
          vec3 baseColor = mix(uColor * 0.25, uColor * 0.9, stripes * 0.7);
          
          // Outer horizon atmospheric neon bloom
          float fresnel = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.8);
          vec3 edgeGlow = uColor * fresnel * 1.6;
          
          gl_FragColor = vec4(baseColor + edgeGlow, 0.95);
        }
      `,
      uniforms: {
        uColor: { value: themeColor }
      },
      transparent: true
    })
    const p2Shield = new THREE.Mesh(p2Geom, p2ShaderMat)
    planet2Group.add(p2Shield)

    // Wide planetary rings
    const p2RingsGeom = new THREE.RingGeometry(13, 23, 64)
    const p2RingsMat = new THREE.MeshBasicMaterial({
      color: themeColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22,
      wireframe: true
    })
    const p2Rings = new THREE.Mesh(p2RingsGeom, p2RingsMat)
    p2Rings.rotation.x = Math.PI * 0.42
    p2Rings.rotation.y = Math.PI * 0.06
    planet2Group.add(p2Rings)

    // Moon orbiting Planet 2
    const moonGroup = new THREE.Group()
    const moonGeom = new THREE.SphereGeometry(1.2, 8, 8)
    const moonMat = new THREE.MeshBasicMaterial({
      color: themeColor,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    })
    const moon = new THREE.Mesh(moonGeom, moonMat)
    moonGroup.add(moon)
    planet2Group.add(moonGroup)
    let moonAngle = 0

    scene.add(planet2Group)

    // 3. ATMOSPHERIC FLOAT SPARKS (Twinkling background stars - denser)
    const sparksCount = Math.floor(150 * density)
    const sparksGeometry = new THREE.BufferGeometry()
    const sparksPositions = new Float32Array(sparksCount * 3)
    
    for (let i = 0; i < sparksCount * 3; i += 3) {
      sparksPositions[i] = (Math.random() - 0.5) * 600
      sparksPositions[i + 1] = (Math.random() - 0.5) * 500
      sparksPositions[i + 2] = (Math.random() - 0.5) * 400
    }
    
    sparksGeometry.setAttribute('position', new THREE.BufferAttribute(sparksPositions, 3))
    
    const sparksMaterial = new THREE.ShaderMaterial({
      vertexShader: sparksVertexShader,
      fragmentShader: sparksFragmentShader,
      uniforms: {
        uTime: uniforms.uTime,
        uColor: uniforms.uColor,
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    
    const sparks = new THREE.Points(sparksGeometry, sparksMaterial)
    scene.add(sparks)

    // Resize handlers
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseTargetRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
      soundManager.updateSynthParams(mouseTargetRef.current.x, mouseTargetRef.current.y)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    // Animation frames loop
    const clock = new THREE.Clock()
    let animationFrameId: number

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      uniforms.uTime.value = elapsedTime

      // Interpolate mouse coordinates (parallax drift)
      mouseRef.current.x += (mouseTargetRef.current.x - mouseRef.current.x) * 0.065
      mouseRef.current.y += (mouseTargetRef.current.y - mouseRef.current.y) * 0.065
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y)

      // Calculate scroll fraction in container
      const scrollContainer = document.querySelector('.scroll-container')
      let scrollY = window.scrollY
      let maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      
      if (scrollContainer) {
        scrollY = scrollContainer.scrollTop
        maxScroll = Math.max(1, scrollContainer.scrollHeight - scrollContainer.clientHeight)
      }
      
      const rawScroll = scrollY / maxScroll
      const progress = isNaN(rawScroll) ? 0 : Math.min(1, Math.max(0, rawScroll))
      uniforms.uScrollProgress.value = progress

      // Interpolate camera positions based on scrollProgress
      let targetCamX: number;
      let targetCamY: number;
      let targetCamZ: number;
      const targetLookAtY = 0;

      if (progress < 0.14) {
        // Hero: Face on view
        targetCamX = 0; targetCamY = 340; targetCamZ = 280;
      } else if (progress < 0.28) {
        // Profile: Zoomed in arm tilt
        targetCamX = 80; targetCamY = 180; targetCamZ = 320;
      } else if (progress < 0.42) {
        // Specs: Edge-on disk view
        targetCamX = 330; targetCamY = 20; targetCamZ = 90;
      } else if (progress < 0.56) {
        // System HUD: Deep center black hole zoom
        targetCamX = 10; targetCamY = 75; targetCamZ = 160;
      } else if (progress < 0.70) {
        // Logs: Vantage angle panning
        targetCamX = -120; targetCamY = 220; targetCamZ = 260;
      } else if (progress < 0.82) {
        // Cases: Wide sweep orbit
        targetCamX = -240; targetCamY = 140; targetCamZ = 220;
      } else if (progress < 0.92) {
        // PDF: Slow tilted drift
        targetCamX = -80; targetCamY = 290; targetCamZ = 240;
      } else {
        // Contact: Centered galaxy view
        targetCamX = 0; targetCamY = 360; targetCamZ = 180;
      }

      // Linear interpolation (lerp) for smooth camera movement
      camera.position.x += (targetCamX - camera.position.x) * 0.05
      camera.position.y += (targetCamY - camera.position.y) * 0.05
      camera.position.z += (targetCamZ - camera.position.z) * 0.05
      
      camera.lookAt(new THREE.Vector3(0, targetLookAtY, 0))

      // Slowly rotate the galaxy disc
      const rotSpeed = 0.05 * speed
      galaxyParticles.rotation.y = elapsedTime * rotSpeed
      coreMesh.rotation.y = elapsedTime * rotSpeed * 1.5
      accretionDisk.rotation.z = -elapsedTime * rotSpeed * 2.0
      if (orbitRing) {
        orbitRing.rotation.y = -elapsedTime * rotSpeed * 0.5
      }

      // Rotate HUD Grid coordinates cage
      navCage.rotation.y = elapsedTime * 0.012
      navCage.rotation.x = elapsedTime * 0.004

      // Orbit and rotate Asteroid Belt
      asteroidsData.forEach((ast) => {
        ast.angle += ast.orbitSpeed * speed * 0.15
        ast.mesh.position.x = Math.cos(ast.angle) * ast.orbitRadius
        ast.mesh.position.z = Math.sin(ast.angle) * ast.orbitRadius
        
        ast.mesh.rotation.x += ast.spinSpeedX * speed
        ast.mesh.rotation.y += ast.spinSpeedY * speed
      })

      // Orbit Planet 1 (Alpha)
      p1Angle += 0.007 * speed
      planet1Group.position.x = Math.cos(p1Angle) * p1OrbitRadius
      planet1Group.position.z = Math.sin(p1Angle) * p1OrbitRadius
      planet1Group.rotation.y = elapsedTime * 0.18

      // Orbit Planet 2 (Beta)
      p2Angle += 0.0028 * speed
      planet2Group.position.x = Math.cos(p2Angle) * p2OrbitRadius
      planet2Group.position.z = Math.sin(p2Angle) * p2OrbitRadius
      planet2Group.rotation.y = elapsedTime * 0.08

      // Moon orbits planet 2
      moonAngle += 0.038 * speed
      moonGroup.position.x = Math.cos(moonAngle) * 16
      moonGroup.position.z = Math.sin(moonAngle) * 16
      moonGroup.rotation.y = elapsedTime * 0.4

      // Sync settings parameters
      uniforms.uColor.value.copy(getThemeColor())
      uniforms.uGravity.value = gravity
      uniforms.uSpeed.value = speed

      // Update shader colors in the custom materials
      if (p2ShaderMat.uniforms.uColor) {
        p2ShaderMat.uniforms.uColor.value.copy(getThemeColor())
      }

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)

      // Clean up WebGL buffers
      galaxyGeometry.dispose()
      galaxyMaterial.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
      bhGeometry.dispose()
      bhMaterial.dispose()
      diskGeometry.dispose()
      diskMaterial.dispose()
      navCageGeom.dispose()
      navCageMat.dispose()

      if (orbitRing) {
        orbitRing.geometry.dispose()
        if (Array.isArray(orbitRing.material)) {
          orbitRing.material.forEach((m) => m.dispose())
        } else {
          orbitRing.material.dispose()
        }
      }

      // Dispose Asteroids
      asteroidsData.forEach((ast) => {
        ast.mesh.children.forEach((mesh) => {
          if (mesh instanceof THREE.Mesh) {
            mesh.geometry.dispose()
            mesh.material.dispose()
          }
        })
      })

      // Dispose Planet 1 Elements
      planet1Group.children.forEach((mesh) => {
        if (mesh instanceof THREE.Mesh) {
          mesh.geometry.dispose()
          mesh.material.dispose()
        }
      })

      // Dispose Planet 2 Elements
      planet2Group.children.forEach((mesh) => {
        if (mesh instanceof THREE.Mesh) {
          mesh.geometry.dispose()
          mesh.material.dispose()
        }
      })
      
      moonGeom.dispose()
      moonMat.dispose()

      sparksGeometry.dispose()
      sparksMaterial.dispose()
      
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [gravity, speed, theme, density, wireframe, glitch])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-85"
    />
  )
}

export default ThreeDWebGLBackground
