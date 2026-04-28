import { useEffect, useRef } from 'react'

export function BackgroundFX() {
  const bleedRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const bleed = bleedRef.current
    const hero = heroRef.current

    function onMouseMove(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      if (bleed) bleed.style.translate = `${-x * 6}px ${-y * 4}px`
      if (hero)  hero.style.translate  = `${-x * 10}px ${-y * 6}px`
      const ticket = document.querySelector('.mint-ticket')
      if (ticket) ticket.style.translate = `${x * 6}px ${y * 4}px`
    }

    document.addEventListener('mousemove', onMouseMove)
    return () => document.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <>
      <div
        className="bleed"
        ref={bleedRef}
        style={{ backgroundImage: 'url(/assets/hero.png)' }}
      />
      <img className="hero-bg" src="/assets/hero.png" alt="" ref={heroRef} />
      <div className="grade" />
      <div className="grade-top" />
      <div className="noise" aria-hidden="true" />
    </>
  )
}
