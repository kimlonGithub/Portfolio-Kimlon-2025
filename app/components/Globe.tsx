"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Color } from "three"

interface OrbProps {
  position?: [number, number, number];
  scale?: number;
  className?: string;
}

export default function TheOrb({ position = [0, 0, 0], scale = 1, className = "" }: OrbProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return

    // Create scene, camera, and renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    // Make renderer responsive
    const updateSize = () => {
      const container = mountRef.current
      if (container) {
        const width = container.clientWidth
        const height = container.clientHeight
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }
    }
    
    updateSize()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)

    // Create a cosmic particle field - reduced for background use
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1000
    const positions = new Float32Array(particlesCount * 3)
    const colors = new Float32Array(particlesCount * 3)
    
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30
      
      // Create cosmic colors with more subtle variations
      const color = new THREE.Color()
      color.setHSL(Math.random() * 0.2 + 0.5, 0.6, Math.random() * 0.3 + 0.4)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Create The Orb - Main sphere with energy field
    const orbGeometry = new THREE.SphereGeometry(3, 64, 64)
    
    // Create energy field shader
    const energyVertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    
    const energyFragmentShader = `
      uniform vec3 energyColor;
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        float wave = sin(vPosition.y * 10.0 + time * 2.0) * 0.5 + 0.5;
        float pulse = sin(time * 3.0) * 0.3 + 0.7;
        gl_FragColor = vec4(energyColor, 1.0) * intensity * wave * pulse;
      }
    `
    
    const energyMaterial = new THREE.ShaderMaterial({
      vertexShader: energyVertexShader,
      fragmentShader: energyFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        energyColor: { value: new Color(0x8b5cf6) },
        time: { value: 0.0 },
      },
    })
    
    const energyField = new THREE.Mesh(orbGeometry, energyMaterial)
    energyField.scale.setScalar(1.2)
    scene.add(energyField)

    // Create wireframe orb structure
    const wireframeGeometry = new THREE.SphereGeometry(3, 32, 32)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    })
    const wireframeOrb = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    scene.add(wireframeOrb)

    // Create solid orb core
    const solidGeometry = new THREE.SphereGeometry(2.8, 64, 64)
    const solidMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e1b4b,
      transparent: true,
      opacity: 0.8,
      shininess: 100,
      specular: new THREE.Color(0x8b5cf6),
    })
    const solidOrb = new THREE.Mesh(solidGeometry, solidMaterial)
    scene.add(solidOrb)
    
    // Create inner glow
    const innerGlowGeometry = new THREE.SphereGeometry(2.5, 32, 32)
    const innerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.3,
    })
    const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial)
    scene.add(innerGlow)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // Add dynamic point lights
    const pointLight1 = new THREE.PointLight(0x8b5cf6, 1, 100)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)
    
    const pointLight2 = new THREE.PointLight(0x3b82f6, 0.8, 100)
    pointLight2.position.set(-5, -5, 5)
    scene.add(pointLight2)

    camera.position.z = 8

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.2
    controls.enableZoom = false
    controls.enablePan = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    const orbColors = [
      new Color(0x8b5cf6), // Purple
      new Color(0x3b82f6), // Blue
      new Color(0x06b6d4), // Cyan
      new Color(0x10b981), // Emerald
      new Color(0xf59e0b), // Amber
    ]
    let colorIndex = 0
    let nextColorIndex = 1
    let colorT = 0
    const colorTransitionSpeed = 0.003

    const lerpColor = (a: Color, b: Color, t: number) => {
      const color = new Color()
      color.r = a.r + (b.r - a.r) * t
      color.g = a.g + (b.g - a.g) * t
      color.b = a.b + (b.b - a.b) * t
      return color
    }

    let animationId: number
    let time = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.01

      // Color transition logic
      colorT += colorTransitionSpeed
      if (colorT >= 1) {
        colorT = 0
        colorIndex = nextColorIndex
        nextColorIndex = (nextColorIndex + 1) % orbColors.length
      }

      const currentColor = lerpColor(orbColors[colorIndex], orbColors[nextColorIndex], colorT)

      // Update materials with new color
      if (wireframeOrb.material instanceof THREE.MeshBasicMaterial) {
        wireframeOrb.material.color = currentColor
      }
      if (solidOrb.material instanceof THREE.MeshPhongMaterial) {
        solidOrb.material.specular = currentColor
      }
      if (energyField.material instanceof THREE.ShaderMaterial) {
        energyField.material.uniforms.energyColor.value = currentColor
        energyField.material.uniforms.time.value = time
      }

      // Rotate the orb components
      wireframeOrb.rotation.y += 0.002
      solidOrb.rotation.y += 0.001
      energyField.rotation.y += 0.0005
      innerGlow.rotation.y += 0.001
      particles.rotation.y += 0.0002
      
      // Animate lights
      pointLight1.position.x = Math.sin(time * 0.5) * 3
      pointLight1.position.y = Math.cos(time * 0.5) * 3
      pointLight2.position.x = Math.sin(time * 0.3 + Math.PI) * 4
      pointLight2.position.y = Math.cos(time * 0.3 + Math.PI) * 4
      
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Set loaded state
    setIsLoaded(true)

    // Add resize listener
    window.addEventListener('resize', updateSize)

    const hintTimer = setTimeout(() => {
      setShowHint(false)
    }, 3000) // Hide hint after 3 seconds

    return () => {
      window.removeEventListener('resize', updateSize)
      cancelAnimationFrame(animationId)
      mountRef.current?.removeChild(renderer.domElement)
      controls.dispose()
      clearTimeout(hintTimer)
    }
  }, [])

  return (
    <div ref={mountRef} className={`w-full h-full relative ${className}`}>
      {showHint && (
        <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full transition-opacity duration-1000 opacity-60 hover:opacity-100">
          Drag to explore
        </div>
      )}
     
    </div>
  )
}
