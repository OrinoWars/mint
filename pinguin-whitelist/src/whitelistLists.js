import gtdRaw from './data/wallets-gtd.txt?raw'
import fcfsRaw from './data/wallets-fcfs.txt?raw'

/** Canonical key for lookups — always lowercase so user input and list files match regardless of letter case (incl. EIP-55 checksum). */
export function normalizeWallet(input) {
  const trimmed = String(input).trim()
  const key = trimmed.toLowerCase()
  if (key.length < 10) return null
  if (!key.startsWith('0x')) return null
  return key
}

/** One wallet per line; empty lines ignored. */
function textToSet(body) {
  const set = new Set()
  const lines = String(body).split(/\r?\n/)
  for (const line of lines) {
    const n = normalizeWallet(line)
    if (n) set.add(n)
  }
  return set
}

/** Lists are bundled at build time (no runtime fetch — not a separate Network request). */
export function getWhitelistSets() {
  return {
    gtd: textToSet(gtdRaw),
    fcfs: textToSet(fcfsRaw),
  }
}
