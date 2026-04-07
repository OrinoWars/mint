import { useCallback, useEffect, useRef, useState } from 'react'
import { PuckCanvas } from './PuckCanvas.jsx'
import { getWhitelistSets, normalizeWallet } from './whitelistLists.js'

const LIGHTS = Array.from({ length: 10 }, (_, i) => i)

const MINT_DETAILS_URL =
  'https://x.com/pinguinHQ/status/2038958967322546600'

const CHECK_DELAY_MS = 5000

function outcomeForAddress(onGtd, onFcfs) {
  /* GTD wins if listed on both */
  if (onGtd) {
    return {
      kind: 'ok',
      headline: 'GTD allowlist confirmed',
      body: 'This address is allowlisted for the guaranteed (GTD) allocation. You have reserved access during the GTD window; further mints up to the per-wallet cap follow the FCFS rules in the mint details.',
      badges: ['GTD'],
    }
  }
  if (onFcfs) {
    return {
      kind: 'ok',
      headline: 'FCFS allowlist confirmed',
      body: "This wallet is allowlisted for the FCFS allocation. You're eligible when mint opens on 9 April at 14:00 UTC.",
      badges: ['FCFS'],
    }
  }
  return {
    kind: 'no',
    headline: 'No allowlist match',
    body: "We couldn't find this address on the current GTD or FCFS snapshot. If you expected a spot, verify the wallet you connected with or ask the team on Discord before mint.",
  }
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      width={22}
      height={22}
    >
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  )
}

export default function App() {
  const [lists] = useState(() => getWhitelistSets())
  const [addressInput, setAddressInput] = useState('')
  const [result, setResult] = useState(null)
  const [checking, setChecking] = useState(false)
  const checkTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (checkTimerRef.current) {
        clearTimeout(checkTimerRef.current)
      }
    }
  }, [])

  const runCheck = useCallback(() => {
    const gtdSet = lists.gtd
    const fcfsSet = lists.fcfs
    if (!(gtdSet instanceof Set) || !(fcfsSet instanceof Set)) {
      setResult({
        kind: 'err',
        headline: 'Hang tight',
        body: 'The allowlist is still loading. Try again in a moment.',
      })
      return
    }

    const addr = normalizeWallet(addressInput)
    if (!addr) {
      setResult({
        kind: 'err',
        headline: 'Invalid wallet',
        body: 'Please double-check the address you entered and try again.',
      })
      return
    }

    if (checkTimerRef.current) {
      clearTimeout(checkTimerRef.current)
      checkTimerRef.current = null
    }

    setChecking(true)
    setResult(null)

    checkTimerRef.current = window.setTimeout(() => {
      checkTimerRef.current = null
      const onGtd = gtdSet.has(addr)
      const onFcfs = fcfsSet.has(addr)
      setResult(outcomeForAddress(onGtd, onFcfs))
      setChecking(false)
    }, CHECK_DELAY_MS)
  }, [addressInput, lists.fcfs, lists.gtd])

  const listsReady = lists.gtd instanceof Set && lists.fcfs instanceof Set

  return (
    <>
      <div className="bg-halftone" />
      <div className="stripe-top" />
      <div className="stripe-bottom" />
      <PuckCanvas />

      <div className="wrapper">
        <div className="ticket">
          <div className="ticket-header">
            <span className="ticket-header-title">WHITELIST CHECKER</span>
          </div>

          <div className="logo-section hero-block">
            <h1 className="title">PINGUIN</h1>
            <div className="mascot-row" aria-hidden="true">
              <img
                className="mascot-penguin-img"
                src={`${import.meta.env.BASE_URL}penguin-apple.png`}
                alt="Penguin mascot"
              />
              <span className="mascot-hockey">🏒</span>
            </div>
            <div className="subtitle">Bounce Hard - Bounce Well - Don&apos;t Stop</div>
          </div>

          <div className="lights-row">
            {LIGHTS.map((i) => (
              <div key={i} className="light" />
            ))}
          </div>

          <div className="wl-section">
            <form
              className="wallet-form"
              onSubmit={(e) => {
                e.preventDefault()
                runCheck()
              }}
            >
              <input
                className="wallet-input"
                type="text"
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="Write your mint wallet address"
                value={addressInput}
                disabled={checking}
                onChange={(e) => {
                  setAddressInput(e.target.value)
                  setResult(null)
                  if (checkTimerRef.current) {
                    clearTimeout(checkTimerRef.current)
                    checkTimerRef.current = null
                  }
                  setChecking(false)
                }}
              />
              <button type="submit" className="check-btn" disabled={!listsReady || checking}>
                Check whitelist
              </button>
            </form>

            <div className="wl-feedback-stack">
              {checking && (
                <div className="wl-form-width wl-check-loading" aria-live="polite">
                  <div className="wl-loading-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <p className="wl-loading-text">Verifying your allowlist status…</p>
                </div>
              )}
              {result && !checking && (
                <div
                  className={`wl-form-width wl-result-card ${result.kind}`}
                  role="status"
                >
                  {result.kind === 'ok' && (
                    <p className="wl-result-kicker">★ PinguList verified ★</p>
                  )}
                  {result.headline && (
                    <h3 className="wl-result-headline">{result.headline}</h3>
                  )}
                  {result.body && <p className="wl-result-body">{result.body}</p>}
                  {result.badges && result.badges.length > 0 && (
                    <div className="wl-result-badges">
                      {result.badges.map((b) => (
                        <span key={b} className="wl-tier-pill">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="wl-form-width mint-announce-only">
              <a
                className="mint-details-link mint-details-link-full"
                href={MINT_DETAILS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="mint-details-link-icon" aria-hidden>
                  <XIcon />
                </span>
                <span className="mint-details-link-text">Read the full mint details on X</span>
              </a>
            </div>
          </div>

          <div className="features">
            <span className="pill teal">Launch: 9 April - 14:00 UTC</span>
          </div>

          <hr className="divider" />

          <div className="stamp-row">
            <div className="stamp stamp-wide">WHITELIST CHECKER</div>
          </div>

          <div className="ticket-stub">
            <span>🐧 pinguin © 2026</span>
            <div className="socials">
              <a className="social-link" href="https://x.com/pinguinHQ" title="Twitter / X">
                TWITTER
              </a>
              <a className="social-link" href="https://discord.gg/pinguin" title="Discord">
                DISCORD
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
