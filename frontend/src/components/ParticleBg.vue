<template>
  <canvas ref="canvasRef" class="particle-bg"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)

// Neon color palette matching design tokens
const NEON_COLORS = ['#00e5ff', '#ff0080', '#7b2fff']

let animationId = null
let particles = []
let mouseX = -9999
let mouseY = -9999

// Particle definition
class Particle {
  constructor(w, h) {
    this.reset(w, h, true)
  }

  reset(w, h, initial = false) {
    this.x = Math.random() * w
    this.y = initial
      ? Math.random() * h
      : -4 // spawn just above canvas when recycling
    this.radius = 1 + Math.random() * 2 // 1-3px
    this.speedY = -(0.15 + Math.random() * 0.35) // upward drift
    this.speedX = (Math.random() - 0.5) * 0.3 // slight horizontal drift
    this.opacity = 0.4 + Math.random() * 0.6

    // ~10% chance of being a neon star
    this.isNeon = Math.random() < 0.1
    this.color = this.isNeon
      ? NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)]
      : '#ffffff'
  }

  update(w, h, dt) {
    // Frame-rate independent movement
    this.x += this.speedX * dt
    this.y += this.speedY * dt

    // Mouse repulsion: particles within 150px are gently pushed away
    const dx = this.x - mouseX
    const dy = this.y - mouseY
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 150 && dist > 0) {
      const force = (150 - dist) / 150
      const pushX = (dx / dist) * force * 2 * dt
      const pushY = (dy / dist) * force * 2 * dt
      this.x += pushX
      this.y += pushY
    }

    // Recycle off-screen
    if (this.y < -10 || this.x < -10 || this.x > w + 10) {
      this.reset(w, h)
    }
    if (this.y > h + 10) {
      this.y = -4
    }
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.opacity
    ctx.fill()

    // Neon glow for special particles
    if (this.isNeon) {
      ctx.shadowBlur = 12
      ctx.shadowColor = this.color
      ctx.fill()
      ctx.shadowBlur = 0
    }

    ctx.globalAlpha = 1
  }
}

function initParticles(w, h) {
  const count = 80 + Math.floor(Math.random() * 41) // 80-120
  particles = []
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(w, h))
  }
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function animate(timestamp) {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  // Clear canvas
  ctx.clearRect(0, 0, w, h)

  // Calculate dt in frames (at 60fps, 1 frame = 1)
  // Using a baseline of 16.67ms per frame
  if (!animate._lastTime) animate._lastTime = timestamp
  const dt = Math.min((timestamp - animate._lastTime) / 16.667, 4) // cap dt to prevent large jumps
  animate._lastTime = timestamp

  // Update and draw each particle
  for (const p of particles) {
    p.update(w, h, dt)
    p.draw(ctx)
  }

  animationId = requestAnimationFrame(animate)
}

function onMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function onMouseLeave() {
  mouseX = -9999
  mouseY = -9999
}

onMounted(() => {
  resizeCanvas()
  initParticles(canvasRef.value.width, canvasRef.value.height)
  animate._lastTime = 0
  animationId = requestAnimationFrame(animate)

  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseleave', onMouseLeave)
  particles = []
})
</script>

<style lang="scss" scoped>
.particle-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style>
