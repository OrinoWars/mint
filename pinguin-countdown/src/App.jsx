import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const TARGET_DATE_UTC = '2026-04-09T14:00:00Z'

function getTimeLeft(targetMs) {
  const nowMs = Date.now()
  const diffMs = Math.max(0, targetMs - nowMs)

  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { diffMs, days, hours, minutes, seconds }
}

function App() {
  const targetMs = useMemo(() => Date.parse(TARGET_DATE_UTC), [])
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetMs))
  const canvasRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetMs))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetMs])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = ['#d42b2b', '#f5c518', '#1e8a8a', '#e07b30', '#1a2b4a']
    const puckCount = 14
    let animationId = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pucks = Array.from({ length: puckCount }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 10 + Math.random() * 16,
      vx: (Math.random() - 0.5) * 2.8,
      vy: (Math.random() - 0.5) * 2.8,
      color: colors[i % colors.length],
      spin: (Math.random() - 0.5) * 0.12,
      angle: Math.random() * Math.PI * 2,
      trail: [],
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      pucks.forEach((p) => {
        p.angle += p.spin
        p.x += p.vx
        p.y += p.vy

        if (p.x - p.r < 0) {
          p.x = p.r
          p.vx = Math.abs(p.vx)
        }
        if (p.x + p.r > canvas.width) {
          p.x = canvas.width - p.r
          p.vx = -Math.abs(p.vx)
        }
        if (p.y - p.r < 0) {
          p.y = p.r
          p.vy = Math.abs(p.vy)
        }
        if (p.y + p.r > canvas.height) {
          p.y = canvas.height - p.r
          p.vy = -Math.abs(p.vy)
        }

        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > 10) p.trail.shift()

        for (let t = 0; t < p.trail.length; t += 1) {
          const alphaHex = Math.round((t / p.trail.length) * 56)
            .toString(16)
            .padStart(2, '0')
          ctx.beginPath()
          ctx.arc(p.trail[t].x, p.trail[t].y, p.r * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = `${p.color}${alphaHex}`
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
        ctx.globalAlpha = 1

        ctx.restore()
      })

      animationId = window.requestAnimationFrame(draw)
    }

    animationId = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const utcLaunchTime = '9 April 2026, 14:00 UTC'

  return (
    <main className="page">
      <div className="bg-halftone" aria-hidden="true" />
      <canvas ref={canvasRef} className="puck-canvas" aria-hidden="true" />
      <div className="stripe stripe-top" aria-hidden="true" />
      <div className="stripe stripe-bottom" aria-hidden="true" />

      <section className="ticket">
        <header className="ticket-header">
          <span>ADMIT ONE</span>
          <span className="stars">★ ★ ★ ★ ★</span>
          <span>EST. 1940s</span>
        </header>

        <div className="hero">
          <p className="tagline">A Bullet-Hell Roguelike</p>
          <h1 className="title">PINGUIN</h1>
          <div className="mascot-row" aria-hidden="true">
            <img
              className="mascot-penguin-img"
              src="/penguin-apple.png"
              alt=""
              width="96"
              height="96"
            />
            <span className="mascot-hockey">🏒</span>
          </div>
          <p className="subtitle">Bounce Hard - Bounce Well - Don't Stop</p>
        </div>

        <div className="lights-row" aria-hidden="true">
          <div className="light" />
          <div className="light" />
          <div className="light" />
          <div className="light" />
          <div className="light" />
          <div className="light" />
          <div className="light" />
          <div className="light" />
          <div className="light" />
          <div className="light" />
        </div>

        <div className="countdown-wrap">
          <h2 className="countdown-title">Time Left Until Launch</h2>
          <div className="countdown-grid" role="timer" aria-live="polite">
            <div className="time-box">
              <strong>{String(timeLeft.days).padStart(2, '0')}</strong>
              <span>Days</span>
            </div>
            <div className="time-box">
              <strong>{String(timeLeft.hours).padStart(2, '0')}</strong>
              <span>Hours</span>
            </div>
            <div className="time-box">
              <strong>{String(timeLeft.minutes).padStart(2, '0')}</strong>
              <span>Minutes</span>
            </div>
            <div className="time-box">
              <strong>{String(timeLeft.seconds).padStart(2, '0')}</strong>
              <span>Seconds</span>
            </div>
          </div>

          <p className="launch-utc">
            Launch (UTC): <strong>{utcLaunchTime}</strong>
          </p>
        </div>

        <div className="features">
          <a
            className="pill pill-link"
            href="https://wlchecker.pinguingame.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Go to Whitelist Checker"
          >
            Whitelist Checker
          </a>
        </div>

        <div className="stamp-row">
          <div className="stamp">Coming Soon</div>
        </div>

        <footer className="ticket-stub">
          <span>🐧 Pinguin © 2026</span>
          <div className="socials">
            <a
              className="social-link"
              href="https://x.com/pinguinHQ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
            >
              Twitter
            </a>
            <a
              className="social-link"
              href="https://discord.gg/pinguin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              Discord
            </a>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default App
