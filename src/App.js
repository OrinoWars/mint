import React, { useEffect, useState, useRef } from "react";
import { PiGlobeDuotone, PiCalendarDotsDuotone, PiCurrencyEthDuotone, PiDiamondDuotone, PiCoinsDuotone, PiHandFistDuotone, PiGiftDuotone, PiLinkDuotone, PiWarningDiamondDuotone, PiCheckCircleDuotone, PiStarDuotone, PiYoutubeLogo, PiSparkleDuotone, PiArrowRightDuotone } from "react-icons/pi";
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
              <PiYoutubeLogo style={{ width: 18, height: 18, flexShrink: 0 }} />
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
                        <ul>
                          <li><PiCalendarDotsDuotone className="modal-icon" /> <span><strong>Date:</strong> 9 April — 14:00 UTC</span></li>
                          <li><PiCurrencyEthDuotone className="modal-icon" /> <span><strong>Cost:</strong> 0.02 ETH</span></li>
                          <li><PiDiamondDuotone className="modal-icon" /> <span><strong>Supply:</strong> 400 NFTs</span></li>
                          <li><PiCoinsDuotone className="modal-icon" /> <span><strong>Hold &amp; Earn:</strong> Earn up to 0.005 ETH weekly for each NFT you hold.</span></li>
                          <li><PiHandFistDuotone className="modal-icon" /> <span><strong>Max Mint per Wallet:</strong> 5</span></li>
                          <li><PiGiftDuotone className="modal-icon" /> <span><strong>Bonus:</strong> Mint 5 NFTs and get 1 extra NFT as a GIFT!</span></li>
                          <li><PiLinkDuotone className="modal-icon" /> <span><strong>Chain:</strong> ETH Mainnet</span></li>
                        </ul>
                        <h3>GTD &amp; FCFS Rules</h3>
                        <ul>
                          <li><PiWarningDiamondDuotone className="modal-icon modal-icon--red" /> <span>GTD and FCFS phases will start <strong>at the same time</strong>.</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /> <span>160 NFTs reserved for GTD wallets for the first 30 minutes (1 per GTD wallet).</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /> <span>The remaining 240 NFTs will be available to FCFS from the start.</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /> <span>Max mint limit is <strong>5 per wallet</strong> for both GTD and FCFS.</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /> <span>For GTD wallets: 1 guaranteed NFT + up to 4 additional NFTs from FCFS supply.</span></li>
                        </ul>
                        <h3>Important Notes</h3>
                        <ul>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /> <span>Hold &amp; Earn System activates immediately after the 1st Drop. <a href="https://discord.gg/pinguin" target="_blank" rel="noopener noreferrer">Details on Discord</a>.</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /> <span>1st Drop is <strong>exclusive to PinguList (WL) owners</strong>. There will be NO Public Phase.</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /> <span>Your PinguList (WL) is valid for <strong>all drops</strong>, not just the 1st Drop.</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /> <span>Those who mint 5 NFTs should open a ticket and provide their mint wallet address to receive their gift NFT.</span></li>
                        </ul>
                        <p className="modal-footer-note"><PiStarDuotone className="modal-icon" /> Good luck Pinguins!</p>
                      </>
                    )}
                    {activeModal === 'contest' && (
                      <>
                        TBA
                      </>
                    )}
                    {activeModal === 'holdEarn' && (
                      <>
                        <h3>How Much Can I Earn By Holding My Pinguin NFT?</h3>
                        <p>Depending on its Bounce Power, each NFT generates between 0.00125 ETH and 0.005 ETH per week.</p>

                        <h3>What Determines My Earnings?</h3>
                        <p>Your weekly ETH earnings are determined by your NFT's Bounce Power tier. There are 8 Bounce Power tiers in total and each tier has a fixed weekly reward amount:</p>
                        <ul>
                          <li><PiCurrencyEthDuotone className="modal-icon" /><span>100 Bounce Power → 0.00125 ETH / week</span></li>
                          <li><PiCurrencyEthDuotone className="modal-icon" /><span>200 Bounce Power → 0.00175 ETH / week</span></li>
                          <li><PiCurrencyEthDuotone className="modal-icon" /><span>300 Bounce Power → 0.00225 ETH / week</span></li>
                          <li><PiCurrencyEthDuotone className="modal-icon" /><span>400 Bounce Power → 0.00275 ETH / week</span></li>
                          <li><PiCurrencyEthDuotone className="modal-icon" /><span>500 Bounce Power → 0.00325 ETH / week</span></li>
                          <li><PiCurrencyEthDuotone className="modal-icon" /><span>600 Bounce Power → 0.00375 ETH / week</span></li>
                          <li><PiCurrencyEthDuotone className="modal-icon" /><span>700 Bounce Power → 0.00425 ETH / week</span></li>
                          <li><PiCurrencyEthDuotone className="modal-icon" /><span>800 Bounce Power → 0.00500 ETH / week</span></li>
                        </ul>
                        <ul>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /><span>The higher your Bounce Power, the higher your fixed weekly ETH reward.</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /><span>You can instantly check your Pinguin's Bounce Power by viewing its metadata on MetaMask.</span></li>
                        </ul>

                        <h3>How Is Bounce Power Determined?</h3>
                        <p>Each NFT's Bounce Power is assigned completely at random during the minting process. Whether you mint a highly powerful Pinguin or one with a lower Bounce Power depends entirely on luck.</p>

                        <h3>How Do I Join The System?</h3>
                        <p>In our system, you are always in control. To get started, follow these 3 simple steps:</p>
                        <ul>
                          <li><PiArrowRightDuotone className="modal-icon modal-icon--navy" /><span>After minting, go to the #holder-verify channel to verify your wallet and NFT.</span></li>
                          <li><PiArrowRightDuotone className="modal-icon modal-icon--navy" /><span>Fill out the stake registration form shared in the #holder-announcements channel.</span></li>
                          <li><PiArrowRightDuotone className="modal-icon modal-icon--navy" /><span>Keep your NFT in your wallet and do not list it on any marketplace.</span></li>
                        </ul>
                        <ul>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /><span><strong>Full Control:</strong> Your NFT always remains in your own wallet.</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /><span><strong>No Pools:</strong> Unlike other systems, you do not need to transfer your NFT to a pool or a smart contract.</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /><span><strong>Easy Exit:</strong> If you decide to leave the system, no extra steps are required; simply transfer or list your NFT.</span></li>
                        </ul>
                        <ul>
                          <li><PiWarningDiamondDuotone className="modal-icon modal-icon--red" /><span><strong>IMPORTANT WARNING:</strong> Holder wallets are monitored daily by our tracking system. Listing even a single Pinguin NFT on any marketplace will result in that wallet being permanently removed from the reward system, even if other Pinguins in the same wallet remain unlisted.</span></li>
                        </ul>

                        <h3>How Are Payments Made?</h3>
                        <ul>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /><span>Rewards are distributed weekly and sent directly to the wallet holding the NFT.</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /><span>All earnings are paid in ETH and no claim transaction or manual conversion is required on your side.</span></li>
                          <li><PiCheckCircleDuotone className="modal-icon modal-icon--green" /><span>After each weekly distribution, an update will be shared in the #payment-logs channel so holders can track and verify transactions.</span></li>
                        </ul>

                        <h3>How Long Will This System Last?</h3>
                        <p>The Holder Rewards system will operate uninterrupted until April 2027. After that, our ecosystem will evolve into a "Play &amp; Earn" model.</p>
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
                      <PiSparkleDuotone className="gift-banner-icon" /> Mint 5 NFTs and get 1 extra NFT as a GIFT!
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
