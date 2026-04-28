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

const StyledTextDescription = styled(s.TextDescription)`
  text-align: center;
  width: 20px;
  font-size: 1.05rem;
  color: var(--ink);
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

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 5) {
      newMintAmount = 5;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

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

                  <h3>Pricing</h3>
                  <ul>
                    <li>
                      <PiCurrencyEthDuotone className="modal-icon modal-icon--green" />
                      <span><strong>GTD Phase</strong> <span className="mint-phase-tag mint-phase-tag--gtd">Guaranteed</span></span>
                      <span className="mint-phase-price">0.006 ETH</span>
                    </li>
                    <li>
                      <PiCurrencyEthDuotone className="modal-icon modal-icon--orange" />
                      <span><strong>FCFS Phase</strong> <span className="mint-phase-tag mint-phase-tag--fcfs">First Come</span></span>
                      <span className="mint-phase-price">0.008 ETH</span>
                    </li>
                    <li>
                      <PiCurrencyEthDuotone className="modal-icon" />
                      <span><strong>Public Phase</strong> <span className="mint-phase-tag mint-phase-tag--pub">Open</span></span>
                      <span className="mint-phase-price">0.011 ETH</span>
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

            <Countdown
              date={new Date(Date.UTC(2026, 3, 9, 14, 0, 0))}
              onComplete={() => setIsLive(true)}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) {
                  return null;
                }
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
                      Launch: <strong>9 April 2026, 14:00 UTC</strong>
                    </p>
                  </div>
                );
              }}
            />

            <div className="mint-info-buttons">
              <button className="mint-info-btn mint-info-btn--navy" onClick={() => openModal('mintInfo')}>Mint Info</button>
            </div>


            <div className="mint-info-table">
              {!(Number(data.totalSupply) >= CONFIG.MAX_SUPPLY) && (
                <StyledDiv>
                  <span>PRICE</span>
                  <span>{CONFIG.DISPLAY_COST} ETH</span>
                </StyledDiv>
              )}
              {isLive &&
                !(blockchain.account === "" || blockchain.smartContract === null) &&
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
              {(!isLive ||
                blockchain.account === "" ||
                blockchain.smartContract === null) && (
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

            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <div className="mint-sold-out">SOLD OUT</div>
            ) : (
              <>
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <div className="mint-action-area">
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      Connect Wallet
                    </StyledButton>
                    {blockchain.errorMsg !== "" && (
                      <p className="mint-error-msg">{blockchain.errorMsg}</p>
                    )}
                  </div>
                ) : (
                  <>
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
                    <div className="mint-action-area">
                      <StyledButton
                        disabled={claimingNft || !isLive ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY..." : "MINT"}
                      </StyledButton>
                    </div>
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
              <img src="/config/images/13.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/14.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/15.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/16.png" alt="" className="mint-nft-thumb" />
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
              <img src="/config/images/13.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/14.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/15.png" alt="" className="mint-nft-thumb" />
              <img src="/config/images/16.png" alt="" className="mint-nft-thumb" />
            </div>
          </div>

          <div className="mint-ticket-stub">
            <div className="mint-stub-socials">
              <a className="mint-stub-social-link" href="https://opensea.io/collection/" target="_blank" rel="noopener noreferrer">OPENSEA</a>
              <a className="mint-stub-social-link" href="https://wlchecker.pebblemayhem.com/" target="_blank" rel="noopener noreferrer">WHITELIST CHECKER</a>
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
