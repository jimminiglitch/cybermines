import { useState, useEffect, useRef } from 'react'

export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export function useCyberminesSound() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)

  const audioContextRef = useRef<AudioContext | null>(null)
  const particleIdRef = useRef(0)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as Window & {
        AudioContext?: typeof AudioContext
        webkitAudioContext?: typeof AudioContext
      }
      const AudioCtx = win.AudioContext || win.webkitAudioContext
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx()
      }

      const savedSound = localStorage.getItem('cyber-mines-sound')
      if (savedSound !== null) {
        setSoundEnabled(savedSound === 'true')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cyber-mines-sound', soundEnabled ? 'true' : 'false')
  }, [soundEnabled])

  const playSound = (
    frequency: number,
    duration: number,
    type: OscillatorType = 'square'
  ) => {
    if (!soundEnabled || !audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(
      frequency,
      audioContextRef.current.currentTime
    )
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContextRef.current.currentTime + duration
    )

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }

  const playClickSound = () => playSound(800, 0.1, 'square')
  const playFlagSound = () => playSound(600, 0.15, 'triangle')
  const playExplosionSound = () => {
    playSound(150, 0.3, 'sawtooth')
    setTimeout(() => playSound(100, 0.2, 'square'), 100)
  }
  const playWinSound = () => {
    playSound(523, 0.2, 'sine')
    setTimeout(() => playSound(659, 0.2, 'sine'), 200)
    setTimeout(() => playSound(784, 0.3, 'sine'), 400)
  }

  const createParticles = (
    x: number,
    y: number,
    count: number,
    colors: string[]
  ) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 60,
        maxLife: 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
      })
    }
    setParticles((prev) => [...prev, ...newParticles])
  }

  const updateParticles = () => {
    setParticles((prev) =>
      prev
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vx: particle.vx * 0.98,
          vy: particle.vy * 0.98,
          life: particle.life - 1,
        }))
        .filter((particle) => particle.life > 0)
    )
  }

  useEffect(() => {
    const animate = () => {
      updateParticles()
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    particles,
    setParticles,
    soundEnabled,
    setSoundEnabled,
    playClickSound,
    playFlagSound,
    playExplosionSound,
    playWinSound,
    createParticles,
  }
}
