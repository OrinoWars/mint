import { useEffect, useRef } from 'react'

const COLORS = ['#d42b2b', '#f5c518', '#1e8a8a', '#e07b30', '#1a2b4a']
const COUNT = 14

export function PuckCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let raf = 0
    let pucks = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      pucks = Array.from({ length: COUNT }, (_, i) => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 10 + Math.random() * 16,
        vx: (Math.random() - 0.5) * 2.8,
        vy: (Math.random() - 0.5) * 2.8,
        color: COLORS[i % COLORS.length],
        spin: (Math.random() - 0.5) * 0.12,
        angle: Math.random() * Math.PI * 2,
        trail: [],
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      pucks.forEach((p) => {
        p.angle += p.spin
        p.x += p.vx
        p.y += p.vy

        if (p.x - p.r < 0) { p.x = p.r; p.vx = Math.abs(p.vx) }
        if (p.x + p.r > canvas.width) { p.x = canvas.width - p.r; p.vx = -Math.abs(p.vx) }
        if (p.y - p.r < 0) { p.y = p.r; p.vy = Math.abs(p.vy) }
        if (p.y + p.r > canvas.height) { p.y = canvas.height - p.r; p.vy = -Math.abs(p.vy) }

        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > 10) p.trail.shift()

        for (let t = 0; t < p.trail.length; t++) {
          const alpha = (t / p.trail.length) * 0.22
          ctx.beginPath()
          ctx.arc(p.trail[t].x, p.trail[t].y, p.r * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2, '0')
          ctx.fill()
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        ctx.beginPath()
        ctx.ellipse(0, 0, p.r, p.r * 0.45, 0, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.55
        ctx.fill()
        ctx.globalAlpha = 0.75
        ctx.lineWidth = 2
        ctx.strokeStyle = '#1a1a1a'
        ctx.stroke()

        ctx.globalAlpha = 0.5
        ctx.beginPath()
        ctx.moveTo(-p.r * 0.6, 0)
        ctx.lineTo(p.r * 0.6, 0)
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.restore()
      })

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas className="puck-canvas" ref={ref} aria-hidden="true" />
}
