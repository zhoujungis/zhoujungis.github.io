<template>
  <canvas ref="canvasRef" class="particle-bg"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)

// Cute pastel palette
const COLORS = ['#ffb3c6', '#ffd1dc', '#ffe0ec', '#c9b1ff', '#b8e8d0', '#ffe0a0', '#ffc2d9']
const HEART_COLORS = ['#ff85a2', '#ffb3c6', '#ffd1dc', '#ff9eb5']

let animationId, particles = [], mouseX = -9999, mouseY = -9999

class Particle {
  constructor(w, h) {
    this.reset(w, h, true)
  }

  reset(w, h, initial = false) {
    this.x = Math.random() * w
    this.y = initial ? Math.random() * h : -10
    this.radius = 2 + Math.random() * 5
    this.speedY = -(0.2 + Math.random() * 0.5)
    this.speedX = (Math.random() - 0.5) * 0.4
    this.opacity = 0.3 + Math.random() * 0.5
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.isHeart = Math.random() < 0.25
    this.rotation = Math.random() * Math.PI * 2
    this.rotSpeed = (Math.random() - 0.5) * 0.02
  }

  update(w, h, dt) {
    this.x += this.speedX * dt
    this.y += this.speedY * dt
    this.rotation += this.rotSpeed * dt

    const dx = this.x - mouseX, dy = this.y - mouseY
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 120 && dist > 0) {
      const force = (120 - dist) / 120
      this.x += (dx / dist) * force * 1.5 * dt
      this.y += (dy / dist) * force * 1.5 * dt
    }

    if (this.y < -50 || this.x < -50 || this.x > w + 50 || this.y > h + 50) {
      this.reset(w, h)
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.fillStyle = this.color

    if (this.isHeart) {
      // Draw a small heart
      ctx.beginPath()
      const s = this.radius * 0.4
      ctx.moveTo(0, s * 0.3)
      ctx.bezierCurveTo(0, 0, -s, 0, -s, s * 0.6)
      ctx.bezierCurveTo(-s, s * 1.2, 0, s * 1.5, 0, s * 2)
      ctx.bezierCurveTo(0, s * 1.5, s, s * 1.2, s, s * 0.6)
      ctx.bezierCurveTo(s, 0, 0, 0, 0, s * 0.3)
      ctx.fill()
    } else {
      // Draw a soft circle
      ctx.beginPath()
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}

function initParticles(w, h) {
  particles = []
  const count = 60 + Math.floor(Math.random() * 41)
  for (let i = 0; i < count; i++) particles.push(new Particle(w, h))
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
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!animate._lastTime) animate._lastTime = timestamp
  const dt = Math.min((timestamp - animate._lastTime) / 16.667, 4)
  animate._lastTime = timestamp

  for (const p of particles) { p.update(canvas.width, canvas.height, dt); p.draw(ctx) }
  animationId = requestAnimationFrame(animate)
}

function onMouseMove(e) { mouseX = e.clientX; mouseY = e.clientY }
function onMouseLeave() { mouseX = -9999; mouseY = -9999 }

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
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseleave', onMouseLeave)
  particles = []
})
</script>

<style lang="scss" scoped>
.particle-bg {
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: -1; pointer-events: none;
}
</style>
