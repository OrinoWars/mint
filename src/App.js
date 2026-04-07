import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Countdown from "react-countdown";
import ReactGA from "react-ga4";
import { PuckCanvas } from "./PuckCanvas";

ReactGA.initialize("G-L9PXVE5P5L");

const StyledTextDescription = styled(s.TextDescription)`
  text-align: center;
  width: 20px;
  font-size: 1.05rem;
  color: var(--ink);
  font-family: 'Bangers', Impact, 'Arial Black', sans-serif;
  letter-spacing: 2px;
`;

const MintPhaseTitle = styled(s.TextTitle)`
  text-align: center;
  color: var(--teal);
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  letter-spacing: 6px;
  text-transform: uppercase;
  font-family: 'Bangers', Impact, 'Arial Black', sans-serif;
  line-height: 1;
  margin: 4px 0 16px 0;
  padding: 0;
`;

const StyledTextTitle = styled(s.TextTitle)`
  text-align: center;
  color: var(--yellow);
  font-size: clamp(3.2rem, 12vw, 7rem);
  letter-spacing: 5px;
  -webkit-text-stroke: 3px var(--ink);
  text-shadow: 6px 8px 0 var(--red), 8px 10px 0 var(--ink);
  text-transform: uppercase;
  font-family: 'Bangers', Impact, 'Arial Black', sans-serif;
  line-height: 0.9;
  margin: 0 0 12px 0;
  padding: 0;

  @media (max-width: 768px) {
    text-shadow: 3px 4px 0 var(--red), 4px 5px 0 var(--ink);
  }
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 384px;
  width: 100%;
  padding: 12px 16px;
  align-items: center;
  font-size: 1.05rem;
  font-family: 'Bangers', Impact, 'Arial Black', sans-serif;
  letter-spacing: 3px;
  color: var(--ink);
  background: var(--cream);
  border: 3px solid var(--ink);
  border-radius: 6px;
  box-shadow: 3px 3px 0 var(--ink);
  margin-top: 8px;

  & > span:last-child:not([style]) {
    color: var(--teal);
    font-size: 1.15rem;
  }

  @media (max-width: 768px) {
    font-size: 0.92rem;
    padding: 10px 12px;
  }
`;

export const StyledButton = styled.button`
  font-family: 'Bangers', Impact, 'Arial Black', sans-serif;
  font-size: 1.35rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  padding: 18px 56px;
  border: 3px solid var(--ink);
  border-radius: 6px;
  background: var(--red);
  color: var(--cream);
  cursor: pointer;
  box-shadow: 4px 4px 0 var(--ink);
  text-shadow: 1px 1px 0 var(--ink);
  transition: transform 0.12s, box-shadow 0.12s;

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--ink);
  }

  &:active:not(:disabled) {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 var(--ink);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: 4px 4px 0 var(--ink);
  }

  @media (max-width: 768px) {
    font-size: 1.15rem;
    padding: 14px 24px;
  }
`;

export const StyledRoundButton = styled.button`
  font-family: 'Bangers', Impact, 'Arial Black', sans-serif;
  font-size: 1rem;
  font-weight: bold;
  color: var(--ink);
  background: var(--cream);
  width: 26px;
  height: 26px;
  border: 2px solid var(--ink);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0 var(--ink);
  transition: transform 0.12s, box-shadow 0.12s;
  line-height: 1;

  &:hover:not(:disabled) {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--ink);
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
  color: var(--secondary);
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
      <div className="stripe-top" />
      <div className="stripe-bottom" />
      <PuckCanvas />
      <div className="mint-wrapper">
        <div className="mint-ticket">
          <div className="mint-ticket-header">
            <a
              className="mint-header-trailer"
              href="https://www.youtube.com/watch?v=HTIZYjeU9lE"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg>
              Watch Trailer
            </a>
          </div>
          <div className="mint-ticket-body">
            <div className="mint-hero-block">
              <StyledTextTitle>Pinguin</StyledTextTitle>
            </div>

            <div className="mint-lights-row" aria-hidden="true">
              {[0,1,2,3,4,5,6,7,8,9].map((i) => (
                <div key={i} className="mint-light" />
              ))}
            </div>

            <Countdown
              date={new Date(Date.UTC(2025, 3, 9, 14, 0, 0))}
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
              <button className="mint-info-btn mint-info-btn--orange" onClick={() => openModal('contest')}>$2000 Mint Contest</button>
              <button className="mint-info-btn mint-info-btn--teal" onClick={() => openModal('holdEarn')}>Hold &amp; Earn System</button>
            </div>

            {activeModal && (
              <div
                className="info-modal-backdrop"
                onClick={(e) => { if (e.target.className === 'info-modal-backdrop') closeModal(); }}
              >
                <div className="info-modal">
                  <div className="info-modal-header">
                    <span className="info-modal-title">
                      {activeModal === 'mintInfo' && 'MINT INFO'}
                      {activeModal === 'contest' && '$2000 MINT CONTEST'}
                      {activeModal === 'holdEarn' && 'HOLD & EARN SYSTEM'}
                    </span>
                    <button className="info-modal-close" onClick={closeModal}>✕</button>
                  </div>
                  <div className="info-modal-body">
                    {activeModal === 'mintInfo' && (
                      <>
                        <h3>What is Mechibis?</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                        <h3>Mint Details</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        <h3>Smart Contract</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                      </>
                    )}
                    {activeModal === 'contest' && (
                      <>
                        <h3>About the Contest</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                        <h3>Prizes</h3>
                        <ul>
                          <li>🥇 1st Place — $1000</li>
                          <li>🥈 2nd Place — $500</li>
                          <li>🥉 3rd Place — $300</li>
                          <li>4th–10th — $200 each</li>
                        </ul>
                        <h3>How to Enter</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                      </>
                    )}
                    {activeModal === 'holdEarn' && (
                      <>
                        <h3>What is Hold & Earn?</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                        <h3>How it Works</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat.</p>
                        <h3>Rewards</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                    <span>400</span>
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
                                        <div className="mint-gift-banner">
                      ★ Mint 5 NFTs and get 1 extra NFT as a GIFT!
                    </div>
                    {feedback && (
                      <s.TextDescription
                        id="feedback"
                        style={{
                          textAlign: "center",
                          color: "var(--ink)",
                          border: "3px solid var(--ink)",
                          background: claimingNft ? "var(--navy)" : "#137e25",
                          boxShadow: "4px 4px 0 var(--ink)",
                          borderRadius: "8px",
                          padding: "16px 20px",
                          fontFamily: "'Bangers', Impact, 'Arial Black', sans-serif",
                          fontSize: "1rem",
                          letterSpacing: "2px",
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
              <a className="mint-stub-social-link" href="https://opensea.io/collection/pinguingame" target="_blank" rel="noopener noreferrer">OPENSEA</a>
              <a className="mint-stub-social-link" href="https://wlchecker.pinguingame.com/" target="_blank" rel="noopener noreferrer">WHITELIST CHECKER</a>
              <a className="mint-stub-social-link" href="https://tracker.pinguingame.com/" target="_blank" rel="noopener noreferrer">YIELD TRACKER</a>
            </div>
            <div className="mint-stub-socials">
              <a className="mint-stub-social-link" href="https://x.com/pinguinHQ" target="_blank" rel="noopener noreferrer">TWITTER</a>
              <a className="mint-stub-social-link" href="https://discord.gg/pinguin" target="_blank" rel="noopener noreferrer">DISCORD</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
