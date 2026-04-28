import React, { useEffect, useState, useRef } from "react";
import { PiCalendarDotsDuotone, PiCurrencyEthDuotone, PiDiamondDuotone, PiLinkDuotone, PiCheckCircleDuotone, PiStarDuotone, PiYoutubeLogo, PiSparkleDuotone, PiClockCountdownDuotone } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Countdown from "react-countdown";
import ReactGA from "react-ga4";
import { BackgroundFX } from "./BackgroundFX";

ReactGA.initialize("G-9PKXFVYL92");

// ── Mint phases ────────────────────────────────────────────────────────────
const PHASES = [
  {
    name: "GTD",
    label: "Guaranteed",
    start: new Date(Date.UTC(2026, 3, 28, 19, 44, 0)), // Apr 30 13:00 UTC
    weiCost: 6000000000000000,
    displayCost: 0.006,
    maxAmount: 3,
    color: "var(--green)",
  },
  {
    name: "FCFS",
    label: "First Come",
    start: new Date(Date.UTC(2026, 3, 30, 14, 0, 0)), // Apr 30 14:00 UTC
    weiCost: 8000000000000000,
    displayCost: 0.008,
    maxAmount: 4,
    color: "var(--yellow-deep)",
  },
  {
    name: "PUBLIC",
    label: "Public Sale",
    start: new Date(Date.UTC(2026, 3, 30, 15, 0, 0)), // Apr 30 15:00 UTC
    weiCost: 11000000000000000,
    displayCost: 0.011,
    maxAmount: 4,
    color: "var(--magenta)",
  },
];

function getActivePhase() {
  const now = new Date();
  let active = null;
  for (const phase of PHASES) {
    if (now >= phase.start) active = phase;
  }
  return active; // null = not started yet
}

function getNextPhase(current) {
  if (!current) return PHASES[0];
  const idx = PHASES.findIndex((p) => p.name === current.name);
  return idx < PHASES.length - 1 ? PHASES[idx + 1] : null;
}
// ───────────────────────────────────────────────────────────────────────────

const StyledTextDescription = styled(s.TextDescription)`
  text-align: center;
  width: 20px;
  font-size: 1.05rem;
  color: var(--yellow);
  font-family: 'Luckiest Guy', Verdana, sans-serif;
  letter-spacing: 2px;
`;


const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 384px;
  width: 100%;
  padding: 12px 16px;
  align-items: center;
  font-size: 1.05rem;
  font-family: 'Luckiest Guy', Verdana, sans-serif;
  letter-spacing: 3px;
  color: var(--cream);
  background: rgba(18, 10, 31, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 3px solid var(--ink);
  border-radius: 8px;
  box-shadow: 3px 3px 0 var(--ink), 0 0 18px rgba(233, 30, 140, 0.18);
  margin-top: 8px;

  & > span:first-child {
    color: var(--cream);
    opacity: 0.85;
  }

  & > span:last-child:not([style]) {
    color: var(--yellow);
    font-size: 1.15rem;
    text-shadow: 1px 1px 0 var(--ink);
  }

  @media (max-width: 768px) {
    font-size: 0.92rem;
    padding: 10px 12px;
  }
`;

export const StyledButton = styled.button`
  font-family: 'Luckiest Guy', Verdana, sans-serif;
  font-size: 1.35rem;
  letter-spacing: 5px;
  text-transform: uppercase;
  padding: 18px 56px;
  border: 3px solid var(--ink);
  border-radius: 14px;
  background: var(--yellow);
  color: var(--ink);
  cursor: pointer;
  box-shadow:
    0 6px 0 var(--ink),
    0 0 35px rgba(255, 204, 31, 0.45);
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-3px) rotate(-1deg);
    box-shadow:
      0 10px 0 var(--ink),
      0 0 55px rgba(255, 204, 31, 0.6);
  }

  &:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 2px 0 var(--ink);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 6px 0 var(--ink);
  }

  @media (max-width: 768px) {
    font-size: 1.15rem;
    padding: 14px 24px;
  }
`;

export const StyledRoundButton = styled.button`
  font-family: 'Luckiest Guy', Verdana, sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: var(--ink);
  background: var(--yellow);
  width: 26px;
  height: 26px;
  border: 2px solid var(--ink);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0 var(--ink);
  transition: transform 0.12s, box-shadow 0.12s, background 0.12s;
  line-height: 1;

  &:hover:not(:disabled) {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--ink), 0 0 14px rgba(255, 204, 31, 0.5);
    background: var(--cream);
  }

  &:active:not(:disabled) {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 var(--ink);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;



export const StyledLink = styled.a`
  color: var(--magenta);
  text-decoration: none;
`;




function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [isLive, setIsLive] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [activeModal, setActiveModal] = useState(null); // 'mintInfo' | 'contest' | 'holdEarn'
  const [activePhase, setActivePhase] = useState(getActivePhase);
  const [wlStatus, setWlStatus] = useState(null); // null | 'gtd' | 'fcfs' | 'none' | 'checking'
  const [wlConnecting, setWlConnecting] = useState(false);
  const [walletPicker, setWalletPicker] = useState(null); // { wallets, context } | null

  // EIP-6963: wallets announce themselves by RDNS — immune to isMetaMask spoofing
  const eip6963Ref = useRef([]);
  useEffect(() => {
    const ICONS = { metamask: "/assets/metamask.png", phantom: "/assets/phantom.jpeg" };
    const SUPPORTED = {
      "io.metamask": { id: "metamask", name: "MetaMask", icon: ICONS.metamask },
      "app.phantom":  { id: "phantom",  name: "Phantom",  icon: ICONS.phantom  },
    };
    const seen = new Set();
    const handler = (event) => {
      const { info, provider } = event.detail;
      const meta = SUPPORTED[info.rdns];
      if (meta && !seen.has(info.rdns)) {
        seen.add(info.rdns);
        eip6963Ref.current = [...eip6963Ref.current, { ...meta, provider }];
      }
    };
    window.addEventListener("eip6963:announceProvider", handler);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return () => window.removeEventListener("eip6963:announceProvider", handler);
  }, []);

  const getAvailableWallets = () => {
    const ICONS = { metamask: "/assets/metamask.png", phantom: "/assets/phantom.jpeg" };

    // Use EIP-6963 results if any wallet responded — MetaMask first, Phantom second
    const ORDER = ["metamask", "phantom"];
    if (eip6963Ref.current.length > 0)
      return [...eip6963Ref.current].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

    // Fallback: legacy detection for older wallet versions
    const list = [];
    if (window.phantom?.ethereum)
      list.push({ id: "phantom", name: "Phantom", provider: window.phantom.ethereum, icon: ICONS.phantom });
    if (window.ethereum?.isMetaMask && !window.ethereum?.isPhantom)
      list.push({ id: "metamask", name: "MetaMask", provider: window.ethereum, icon: ICONS.metamask });
    return list;
  };

  const doConnect = (walletObj, context) => {
    if (context === "wl") setWlConnecting(true);
    dispatch(connect(walletObj.provider));
    if (context === "main") getData();
    setWalletPicker(null);
  };

  const openWalletPicker = (context) => {
    const wallets = getAvailableWallets();
    if (wallets.length === 0) { dispatch(connect(null)); return; }
    if (wallets.length === 1) { doConnect(wallets[0], context); return; }
    setWalletPicker({ wallets, context });
  };

  const openModal = (name) => {
    setActiveModal(name);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = "auto";
  };
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const onCountdownComplete = () => {
    alert("Minting is now live!");
  };


  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting in progress. Please wait...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        document.getElementById("feedback").style.background = "#248307";
        setFeedback(
          `Mint successful! Verify your wallet on Discord to start Hold Earn!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const phaseMax = activePhase?.maxAmount ?? 5;

  const decrementMintAmount = () => {
    setMintAmount((prev) => Math.max(1, prev - 1));
  };

  const incrementMintAmount = () => {
    setMintAmount((prev) => Math.min(phaseMax, prev + 1));
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const checkWL = async (address) => {
    setWlStatus("checking");
    try {
      const [gtdRes, fcfsRes] = await Promise.all([
        fetch("/gtd.txt"),
        fetch("/fcfs.txt"),
      ]);
      const [gtdText, fcfsText] = await Promise.all([
        gtdRes.text(),
        fcfsRes.text(),
      ]);
      const normalize = (txt) =>
        txt.split("\n").map((a) => a.trim().toLowerCase()).filter(Boolean);
      const addr = address.toLowerCase();
      if (normalize(gtdText).includes(addr)) return setWlStatus("gtd");
      if (normalize(fcfsText).includes(addr)) return setWlStatus("fcfs");
      setWlStatus("none");
    } catch {
      setWlStatus(null);
    }
  };

  const applyPhaseToConfig = (config, phase) => {
    if (!phase) return config;
    return { ...config, WEI_COST: phase.weiCost, DISPLAY_COST: phase.displayCost };
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    const phase = getActivePhase();
    SET_CONFIG(applyPhaseToConfig(config, phase));
    if (phase) {
      setActivePhase(phase);
      setIsLive(true);
    }
  };

  // Phase transition watcher — checks every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const phase = getActivePhase();
      setActivePhase((prev) => {
        if (prev?.name !== phase?.name) {
          SET_CONFIG((c) => applyPhaseToConfig(c, phase));
          if (phase) { setIsLive(true); setMintAmount(1); }
        }
        return phase;
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
    if (blockchain.account && !activePhase) {
      checkWL(blockchain.account);
    }
  }, [blockchain.account]);

  // Stop the WL spinner when the connect attempt finishes (loading false = done)
  useEffect(() => {
    if (wlConnecting && !blockchain.loading) {
      setWlConnecting(false);
    }
  }, [blockchain.loading]);

  return (
    <>
      <div className="bg-halftone" />
      <BackgroundFX />
      <div className="stripe-top" />
      <div className="stripe-bottom" />

      {activeModal && (
        <div
          className="info-modal-backdrop"
          onClick={(e) => { if (e.target.className === 'info-modal-backdrop') closeModal(); }}
        >
          <div className="info-modal">
            <div className="info-modal-header">
              <span className="info-modal-title">
                {activeModal === 'mintInfo' && 'MINT INFO'}
              </span>
              <button className="info-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="info-modal-body">
              {activeModal === 'mintInfo' && (
                <>
                  <h3>Collection Details</h3>
                  <ul>
                    <li><PiDiamondDuotone className="modal-icon" /> <span><strong>Supply:</strong> 1,111 NFTs</span></li>
                    <li><PiCalendarDotsDuotone className="modal-icon" /> <span><strong>Mint Date:</strong> 30 April — 13:00 UTC</span></li>
                    <li><PiLinkDuotone className="modal-icon" /> <span><strong>Chain:</strong> Ethereum</span></li>
                  </ul>

                  <h3>Pricing & Limits</h3>
                  <ul>
                    <li>
                      <PiCurrencyEthDuotone className="modal-icon modal-icon--green" />
                      <span><strong>GTD Phase</strong> <span className="mint-phase-tag mint-phase-tag--gtd">Guaranteed</span></span>
                      <span className="mint-phase-price">0.006 ETH · max 3</span>
                    </li>
                    <li>
                      <PiCurrencyEthDuotone className="modal-icon modal-icon--orange" />
                      <span><strong>FCFS Phase</strong> <span className="mint-phase-tag mint-phase-tag--fcfs">First Come</span></span>
                      <span className="mint-phase-price">0.008 ETH · max 4</span>
                    </li>
                    <li>
                      <PiCurrencyEthDuotone className="modal-icon" />
                      <span><strong>Public Phase</strong> <span className="mint-phase-tag mint-phase-tag--pub">Open</span></span>
                      <span className="mint-phase-price">0.011 ETH · max 4</span>
                    </li>
                  </ul>

                  <h3>Mint Schedule</h3>
                  <ul className="mint-schedule-list">
                    <li>
                      <PiClockCountdownDuotone className="modal-icon modal-icon--green" />
                      <span><strong>GTD</strong></span>
                      <span className="mint-schedule-time">April 30 · 13:00 UTC</span>
                    </li>
                    <li>
                      <PiClockCountdownDuotone className="modal-icon modal-icon--orange" />
                      <span><strong>FCFS</strong></span>
                      <span className="mint-schedule-time">April 30 · 14:00 UTC</span>
                    </li>
                    <li>
                      <PiClockCountdownDuotone className="modal-icon" />
                      <span><strong>PUBLIC</strong></span>
                      <span className="mint-schedule-time">April 30 · 15:00 UTC</span>
                    </li>
                  </ul>

                  <p className="modal-footer-note"><PiStarDuotone className="modal-icon" /> Good luck Pebbles!</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {walletPicker && (
        <div className="wallet-picker-backdrop" onClick={() => setWalletPicker(null)}>
          <div className="wallet-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wallet-picker-header">
              <span className="wallet-picker-title">Select Wallet</span>
              <button className="wallet-picker-close" onClick={() => setWalletPicker(null)}>✕</button>
            </div>
            <div className="wallet-picker-list">
              {walletPicker.wallets.map((w) => (
                <button
                  key={w.id}
                  className={`wallet-btn wallet-btn--${w.id}`}
                  onClick={() => doConnect(w, walletPicker.context)}
                >
                  <span
                    className="wallet-btn-icon"
                    aria-hidden="true"
                    style={w.icon ? {
                      backgroundImage: `url(${w.icon})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "transparent",
                    } : undefined}
                  />
                  {w.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mint-wrapper">
        <div className="mint-ticket">
          <div className="mint-ticket-header">
            <a
              className="mint-header-trailer"
              href="https://www.youtube.com/watch?v=FlTxCTOywaE"
              target="_blank"
              rel="noopener noreferrer"
            >
              <PiYoutubeLogo style={{ width: 18, height: 18, flexShrink: 0 }} />
              Watch Trailer
            </a>
          </div>
          <div className="mint-ticket-body">
            <div className="mint-hero-block">
              <h1 className="mint-title">
                <span className="mint-title-w1">PEBBLE</span><br />
                <span className="mint-title-w2">MAYHEM</span>
              </h1>
            </div>

            <div className="mint-lights-row" aria-hidden="true">
              {[0,1,2,3,4,5,6,7,8,9].map((i) => (
                <div key={i} className="mint-light" />
              ))}
            </div>

            {/* ── Pre-launch countdown (GTD start) ── */}
            <Countdown
              date={PHASES[0].start}
              onComplete={() => {
                const phase = PHASES[0];
                setActivePhase(phase);
                setIsLive(true);
                SET_CONFIG((c) => applyPhaseToConfig(c, phase));
              }}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) return null;
                return (
                  <div className="countdown-wrap">
                    <h2 className="countdown-title">Time Left Until Mint</h2>
                    <div className="countdown-grid" role="timer" aria-live="polite">
                      <div className="time-box">
                        <strong>{String(days).padStart(2, '0')}</strong>
                        <span>Days</span>
                      </div>
                      <div className="time-box">
                        <strong>{String(hours).padStart(2, '0')}</strong>
                        <span>Hours</span>
                      </div>
                      <div className="time-box">
                        <strong>{String(minutes).padStart(2, '0')}</strong>
                        <span>Minutes</span>
                      </div>
                      <div className="time-box">
                        <strong>{String(seconds).padStart(2, '0')}</strong>
                        <span>Seconds</span>
                      </div>
                    </div>
                    <p className="launch-utc">
                      GTD Phase: <strong>30 April 2026, 13:00 UTC</strong>
                    </p>
                  </div>
                );
              }}
            />

            {/* ── Active phase badge + phase-end countdown ── */}
            {activePhase && activePhase.name !== "PUBLIC" && blockchain.account && (
              <div className="phase-status-wrap">
                <div
                  className="phase-badge"
                  style={{ "--phase-color": "var(--green)" }}
                >
                  <span className="phase-badge-dot" />
                  <span className="phase-badge-name">
                    Eligible for {activePhase.name} Phase
                  </span>
                </div>
                {getNextPhase(activePhase) && (
                  <Countdown
                    date={getNextPhase(activePhase).start}
                    onComplete={() => {
                      const next = getNextPhase(activePhase);
                      if (next) {
                        setActivePhase(next);
                        SET_CONFIG((c) => applyPhaseToConfig(c, next));
                      }
                    }}
                    renderer={({ hours, minutes, seconds, completed }) => {
                      if (completed) return null;
                      return (
                        <p className="phase-next-label">
                          <PiClockCountdownDuotone style={{ verticalAlign: "middle", marginRight: 4 }} />
                          {activePhase.name} ends in{" "}
                          <strong>
                            {String(hours).padStart(2, "0")}:
                            {String(minutes).padStart(2, "0")}:
                            {String(seconds).padStart(2, "0")}
                          </strong>
                        </p>
                      );
                    }}
                  />
                )}
              </div>
            )}

            <div className="mint-info-buttons">
              <button className="mint-info-btn mint-info-btn--navy" onClick={() => openModal('mintInfo')}>Mint Info</button>
            </div>

            {/* ── WL Checker — visible only before mint goes live ── */}
            {!activePhase && (
              <div className="wl-checker-wrap">
                <p className="wl-checker-title">Whitelist Checker</p>
                {!blockchain.account ? (
                  wlConnecting ? (
                    <div className="wl-spinner-wrap">
                      <span className="wl-spinner" />
                      <span className="wl-spinner-label">Connecting…</span>
                    </div>
                  ) : (
                  <>
                    <button
                      className="wl-connect-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        openWalletPicker("wl");
                      }}
                    >
                      Check WL Status
                    </button>
                    {blockchain.errorMsg !== "" && (
                      <p className="wl-error-msg">{blockchain.errorMsg}</p>
                    )}
                  </>
                  )
                ) : (
                  <div className="wl-result-wrap">
                    <p className="wl-address">
                      {blockchain.account.slice(0, 6)}…{blockchain.account.slice(-4)}
                    </p>
                    {wlStatus === "checking" && (
                      <div className="wl-result wl-result--checking">Checking…</div>
                    )}
                    {wlStatus === "gtd" && (
                      <div className="wl-result wl-result--gtd">
                        <span className="wl-dot" />
                        GTD Whitelist
                      </div>
                    )}
                    {wlStatus === "fcfs" && (
                      <div className="wl-result wl-result--fcfs">
                        <span className="wl-dot" />
                        FCFS Whitelist
                      </div>
                    )}
                    {wlStatus === "none" && (
                      <div className="wl-result wl-result--none">
                        <span className="wl-dot" />
                        Not on Whitelist
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}


            {activePhase && (
              <div className="mint-info-table">
                {!(Number(data.totalSupply) >= CONFIG.MAX_SUPPLY) && (
                  <StyledDiv>
                    <span>PRICE · {activePhase.name}</span>
                    <span>{CONFIG.DISPLAY_COST} ETH</span>
                  </StyledDiv>
                )}
                {isLive &&
                  blockchain.account &&
                  !(Number(data.totalSupply) >= CONFIG.MAX_SUPPLY) && (
                    <>
                      <hr className="mint-divider" />
                      <StyledDiv>
                        <span>MINTED</span>
                        <span>
                          {data.totalSupply > 0
                            ? `${data.totalSupply} / ${CONFIG.MAX_SUPPLY}`
                            : `0 / ${CONFIG.MAX_SUPPLY}`}
                        </span>
                      </StyledDiv>
                    </>
                  )}
                {(!isLive || !blockchain.account) && (
                  <>
                    <hr className="mint-divider" />
                    <StyledDiv>
                      <span>SUPPLY</span>
                      <span>1111</span>
                    </StyledDiv>
                  </>
                )}
                <hr className="mint-divider" />
              </div>
            )}

            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <div className="mint-sold-out">SOLD OUT</div>
            ) : (
              <>
                {!blockchain.account ? (
                  activePhase && (
                  <div className="mint-action-area">
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        openWalletPicker("main");
                      }}
                    >
                      Connect Wallet
                    </StyledButton>
                    {blockchain.errorMsg !== "" && (
                      <p className="mint-error-msg">{blockchain.errorMsg}</p>
                    )}
                  </div>
                  )
                ) : (
                  <>
                    {activePhase && isLive && (
                    <div className="mint-amount-row">
                      <StyledDiv>
                        <span>AMOUNT</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <StyledRoundButton
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              decrementMintAmount();
                            }}
                          >
                            -
                          </StyledRoundButton>
                          <StyledTextDescription>
                            {mintAmount}
                          </StyledTextDescription>
                          <StyledRoundButton
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              incrementMintAmount();
                            }}
                          >
                            +
                          </StyledRoundButton>
                        </span>
                      </StyledDiv>
                    </div>
                    )}

                    {feedback && (
                      <s.TextDescription
                        id="feedback"
                        style={{
                          textAlign: "center",
                          border: "3px solid var(--ink)",
                          background: claimingNft ? "var(--purple)" : "#ac0d0d",
                          boxShadow: "4px 4px 0 var(--ink), 0 0 28px rgba(233, 30, 140, 0.35)",
                          borderRadius: "10px",
                          padding: "16px 20px",
                          fontFamily: "'Luckiest Guy', Verdana, sans-serif",
                          fontSize: "1rem",
                          letterSpacing: "3px",
                          marginBottom: "16px",
                          color: "var(--cream)",
                          textShadow: "1px 1px 0 var(--ink)",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                    )}
                    {activePhase && isLive && (
                    <div className="mint-action-area">
                      <StyledButton
                        disabled={claimingNft || !isLive || !blockchain.smartContract ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY..." : "MINT"}
                      </StyledButton>
                    </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <div className="mint-nft-strip" aria-hidden="true">
            <div className="mint-nft-track">
              <img src="/config/images/1.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/2.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/3.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/4.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/5.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/6.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/7.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/8.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/9.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/10.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/11.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/12.png" alt="" className="mint-nft-thumb" />
              {/* duplicate for seamless loop */}
              <img src="/config/images/1.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/2.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/3.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/4.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/5.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/6.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/7.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/8.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/9.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/10.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/11.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/12.png" alt="" className="mint-nft-thumb" />
            </div>
          </div>

          <div className="mint-ticket-stub">
            <div className="mint-stub-socials">
              <a className="mint-stub-social-link" href="https://opensea.io/collection/" target="_blank" rel="noopener noreferrer">OPENSEA</a>
              <a className="mint-stub-social-link" href="https://etherscan.io/address/" target="_blank" rel="noopener noreferrer">CONTRACT</a>
            </div>
            <div className="mint-stub-socials">
              <a className="mint-stub-social-link" href="https://x.com/PebbleMayhem" target="_blank" rel="noopener noreferrer">TWITTER</a>
              <a className="mint-stub-social-link" href="https://discord.gg/pebblemayhem" target="_blank" rel="noopener noreferrer">DISCORD</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
