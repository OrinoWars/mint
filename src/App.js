import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled, { keyframes } from "styled-components";
import ReactDOM from "react-dom";
import Countdown from "react-countdown";
import ReactGA from "react-ga4";

ReactGA.initialize("G-0HS7GKYZHX");

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

const StyledTextDescription = styled(s.TextDescription)`
  text-align: center;
  width: 20px;
  font-size: 25px;
  color: var(--accent-text);
  padding-top: 2px;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const MintPhaseTitle = styled(s.TextTitle)`
  text-align: center;
  color: white;
  font-size: 20px;
  letter-spacing: 10px;
  text-shadow: rgb(69 255 5) 0px 0px 30px;
  text-transform: uppercase;
  font-family: "Font1";
  line-height: 1;
  margin: 0 0 20px 0;
  padding: 0;

  @media (max-width: 768px) {
    font-size: 17px;
  }
`;

const StyledTextTitle = styled(s.TextTitle)`
  text-align: center;
  color: white;
  font-size: 60px;
  letter-spacing: 10px;
  text-shadow: rgb(255 0 0) 0px 0px 30px;
  text-transform: uppercase;
  font-family: "Font1";
  line-height: 1.2;
  margin: 0 0 10px 0;
  padding: 0;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-top: 20px;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 350px;
  width: 100%;
  padding: 10px 5px;
  align-items: center;
  font-size: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: "Font2";

  @media (max-width: 768px) {
    font-size: 20px;
    padding: 8px 4px;
  }
`;

export const StyledButton = styled.button`
  padding: 20px;
  padding-right:10px;
  border-radius: 16px;
  border: 2px solid #c0c0c0;
  background-color: rgb(15 105 23 / 95%);
  font-weight: bold;
  font-size: 1.5rem;
  font-family: Font2;
  letter-spacing: 12px;
  color: white;
  text-shadow: 0 0 20px rgba(192, 192, 192, 1);
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(192, 192, 192, 1);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: rgb(3 46 7 / 95%);
    border: 2px solid #e0e0e0
    color: white;
    box-shadow: 0 0 40px rgba(192, 192, 192, 1);
    transform: scale(1.1);
  }

  &:active {
    background: rgba(80, 20, 20, 1);
    box-shadow: 0 0 25px rgba(192, 192, 192, 0.8);
    border: 2px solid #a9a9a9;
    transform: scale(0.95);
  }

  &:disabled {
    background: rgba(128, 128, 128, 0.5);
    border: 2px solid #a9a9a9;
    color: #d3d3d3;
    text-shadow: none;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

    @media (max-width: 768px) {
    font-size: 15px;
      padding: 15px;
  padding-right:10px;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(145deg, #e6e6e6, #ffffff);
  font-weight: bold;
  font-size: 18px;
  color: var(--primary-text);
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1),
    inset -2px -2px 5px rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease-in-out;

  &:hover {
    background: linear-gradient(145deg, #ffffff, #e6e6e6);
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 25px;
    height: 25px;
    border-radius: 5px;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 769px) {
    flex-direction: row;
  }
  @media (max-width: 768px) {
    padding: 0 !important;
    flex: unset;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: rgb(22 23 1 / 51%);
  border-radius: 20px;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 300px;

  transition: width 0.5s;

  @media (max-width: 1378px) {
    width: 250px;
  }

  @media (max-width: 1250px) {
    width: 200px;
  }
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

const CountdownTimer = styled.div`
  font-weight: bold;
  color: #ff0077;
  text-align: center;
  font-size: 3rem;
  padding: 20px;
  padding-top: 5px;
  border: 3px solid #ffd700;
  border-radius: 20px;
  background: rgba(28, 28, 36, 0.95);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.9);
  width: auto;
  margin: 20px auto;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 35px;
    padding: 15px;
    margin-right: 0px;
    margin-left: 0px;
    padding-top: 5px;
  }
`;

const TimerText = styled.span`
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.9);
  font-size: 30px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const TimerUnit = styled.span`
  font-size: 1.2rem;
  font-weight: normal;
  margin-left: 0px;
  color: #ffd700;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Divider = styled.span`
  font-size: 30px;
  color: #ffd700;
  margin: 0 5px;
`;

const MintStartedText = styled.span`
  color: #00ffcc;
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 0 0 20px rgba(0, 255, 204, 0.9);
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const TooltipWrapper = styled.div`
  position: relative;
  display: flex;
  font-size: 20px;
  align-items: center;
  color: white;
  cursor: pointer;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const TooltipText = styled.div`
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  color: white;
  margin-left: -60px;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.3s;
`;

const Modal = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  font-size: 17px;
  height: 100%;
  color: white;
  background-color: rgb(73 73 73 / 56%);
  animation: ${(props) => (props.show ? fadeIn : fadeOut)} 0.3s ease-out;

  @media (max-width: 1378px) {
    font-size: 15px;
  }
`;

const ModalContent = styled.div`
  background-color: #f0f0f0;
  margin: 3% auto;
  padding: 30px;
  padding-right: 10px;
  border-radius: 10px;
  padding-bottom: 0px;
  padding-top: 10px;
  position: relative;
  color: black;
  border: 1px solid #888;
  font-family: "Font4";
  width: 70%;
  display: flex;
  flex-direction: column;

  @media (max-width: 1378px) {
    width: 90%;
    padding: 10px;
    padding-right: 10px;
  }
`;

const CloseButton = styled.span`
  color: black;
  float: right;
  position: absolute;
  font-size: 50px;
  margin-top: -10px;
  right: 20px;
  font-weight: bold;
  &:hover,
  &:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;

const InfoIcon = styled.img`
  display: flex;
  align-items: center;
  width: 30px;
  height: 30px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [isLive, setIsLive] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [isContestModalOpen, setIsContestModalOpen] = useState(false);
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

  const handleStakeClick = () => {
    setIsStakeModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleContestClick = () => {
    setIsContestModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeStakeModal = (e) => {
    if (e.target.id === "modal") {
      setIsStakeModalOpen(false);
      document.body.style.overflow = "auto";
    }
  };

  const closeContestModal = (e) => {
    if (e.target.id === "modal") {
      setIsContestModalOpen(false);
      document.body.style.overflow = "auto";
    }
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
        document.getElementById("feedback").style.boxShadow =
          "0px 4px 10px rgba(0, 0, 0, 0.5)";
        document.getElementById("feedback").style.border =
          "3px solid rgb(0 255 29 / 90%)";
        setFeedback(
          `Mint successful! Verify your wallet on Discord to start Stake!`
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
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{
          padding: 24,
          backgroundImage: "url('/bg.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: "black",
        }}
      >
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            className="imageContainer"
          >
            <StyledImg alt={"Mechibis"} src={"/config/images/1.png"} />
            <StyledImg alt={"Mechibis"} src={"/config/images/2.png"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "rgb(0 0 0 / 84%)",
              padding: "36px 24px",
              borderRadius: 24,
              boxShadow: "#C0C0C0 0px 0px 15px 5px",
            }}
          >
            <StyledTextTitle>Mechibis</StyledTextTitle>

            <MintPhaseTitle>MAIN MINT</MintPhaseTitle>

            {!isLive && (
              <CountdownTimer
                style={{
                  fontFamily: "Font1",
                  textAlign: "center",
                  color: "white",
                }}
              >
                <Countdown
                  date={new Date(Date.UTC(2025, 5, 26, 13, 0, 0))}
                  onComplete={() => setIsLive(true)}
                  renderer={({ days, hours, minutes, seconds, completed }) => {
                    if (completed) {
                      return (
                        <MintStartedText style={{ fontFamily: "Font2" }}>
                          🚀 Minting Started!
                        </MintStartedText>
                      );
                    } else {
                      return (
                        <TimerText style={{ fontFamily: "Font2" }}>
                          {days} <TimerUnit>days</TimerUnit>
                          <Divider></Divider>
                          {hours} <TimerUnit>hours</TimerUnit>
                          <Divider></Divider>
                          {minutes} <TimerUnit>minutes</TimerUnit>
                          <Divider></Divider>
                          {seconds} <TimerUnit>seconds</TimerUnit>
                        </TimerText>
                      );
                    }
                  }}
                />
              </CountdownTimer>
            )}

            <s.Container
              style={{
                padding: "0",
                maxWidth: "350px",
                width: "100%",
                margin: "0px auto",
                fontWeight: "bold",
                color: "#C0C0C0",
                textShadow: "0 0 15px rgba(192, 192, 192, 0.9)",
                color: "var(--accent-text)",
              }}
            >
              {!(Number(data.totalSupply) >= CONFIG.MAX_SUPPLY) && (
                <>
                  <StyledDiv>
                    <span>PRICE</span>
                    <span>{CONFIG.DISPLAY_COST} ETH</span>
                  </StyledDiv>
                </>
              )}
              {isLive &&
                !(
                  blockchain.account === "" || blockchain.smartContract === null
                ) &&
                !(Number(data.totalSupply) >= CONFIG.MAX_SUPPLY) && (
                  <>
                    <div
                      style={{
                        borderTop: "2px solid #C0C0C0",
                        boxShadow: "0 0 12px rgba(192, 192, 192, 0.9)",
                        width: "100%",
                      }}
                    ></div>

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
                  <div
                    style={{
                      borderTop: "2px solid #C0C0C0",
                      boxShadow: "0 0 12px rgba(192, 192, 192, 0.9)",
                      width: "100%",
                    }}
                  ></div>

                  <StyledDiv>
                    <span>SUPPLY</span>
                    <span>1500</span>
                  </StyledDiv>
                </>
              )}

              <div
                style={{
                  borderTop: "2px solid #C0C0C0",
                  boxShadow: "0 0 12px rgba(192, 192, 192, 0.9)",
                  width: "100%",
                }}
              ></div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: "350px",
                  width: "100%",
                  padding: "10px 5px",
                  fontSize: "30px",
                  marginTop: "20px",
                  marginBottom: "20px",
                  fontFamily: "Font2",
                  alignItems: "center",
                }}
              >
                <div class="info-area">
                  <TooltipWrapper onClick={handleStakeClick}>
                    <InfoIcon
                      src="/config/images/information.png"
                      alt="Info Icon"
                    />
                    <span class="stakeInfo">Stake</span>
                  </TooltipWrapper>
                  <TooltipWrapper onClick={handleContestClick}>
                    <InfoIcon
                      src="/config/images/medal.png"
                      alt="Trophy Icon"
                    />
                    <span class="stakeInfo">$5000 Contest</span>
                  </TooltipWrapper>
                  <Modal
                    id="modal"
                    show={isStakeModalOpen}
                    onClick={closeStakeModal}
                  >
                    <ModalContent>
                      {" "}
                      <CloseButton
                        onClick={() => {
                          setIsStakeModalOpen(false);
                          document.body.style.overflow = "auto";
                        }}
                      >
                        &times;
                      </CloseButton>
                      <div className="modalStake">
                        <h1 style={{ textAlign: "center" }}>
                          MECHIBIS STAKE SYSTEM
                        </h1>
                        <hr />

                        <section>
                          <h2>
                            HOW MUCH CAN I EARN FROM STAKING MY MECHIBIS NFT?
                          </h2>
                          <p>
                            Depending on its Core Power, each NFT generates
                            between $10 and $40 monthly.
                          </p>
                        </section>
                        <hr />

                        <section>
                          <h2>WHAT DETERMINES MY NFT’S STAKE REWARD?</h2>
                          <p>
                            Stake rewards are based on your NFT’s Core Power, a
                            unique value embedded in the NFT metadata.
                          </p>
                          <p>
                            Core Power also defines your monthly Passive Income.
                            For example, if your NFT’s Core Power is 40, it
                            means it will generate $40 in Passive Income per
                            month.
                          </p>
                          <p>
                            You can view this value by checking the NFT details
                            in MetaMask or using the Power Scanner tool.
                          </p>
                        </section>
                        <hr />

                        <section>
                          <h2>HOW IS MY NFT’S CORE POWER DECIDED?</h2>
                          <p>
                            Each NFT’s Core Power is assigned randomly during
                            minting. Whether you mint a powerful NFT or a lower
                            Core Power one depends entirely on luck.
                          </p>
                        </section>
                        <hr />

                        <section>
                          <h2>HOW DO I STAKE MY MECHIBIS?</h2>
                          <ul>
                            <li>
                              Verify your wallet and NFT in the #holder-verify
                              channel after mint.
                            </li>
                            <li>
                              Fill out the stake registration form shared in the
                              #holder-announcements channel.
                            </li>
                            <li>
                              HOLD your NFT and don’t list it on any
                              marketplace.
                            </li>
                          </ul>
                          <p>
                            Your NFT remains in your wallet at all times, giving
                            you full control.
                          </p>
                          <p>
                            Unlike other systems, staking does not require
                            transferring your NFT to a pool wallet.
                          </p>
                          <p>
                            You can exit the staking system anytime by simply
                            listing or transferring your NFT – no extra steps
                            required.
                          </p>
                          <p>
                            <strong>Important:</strong> Our Snapshot Software
                            scans NFTs 3 times daily. If your NFT is listed on a
                            marketplace, your wallet will be permanently
                            disqualified from staking rewards – even for
                            unlisted NFTs.
                          </p>
                        </section>
                        <hr />

                        <section>
                          <h2>HOW ARE REWARDS PAID?</h2>
                          <ul>
                            <li>
                              Your total monthly stake income is split into
                              three payouts (1/4 each), sent every 7 days to
                              your wallet holding the NFT.
                            </li>
                            <li>
                              No additional action is required; payouts are
                              fully automatic and made in ETH.
                            </li>
                            <li>
                              Once Passive Income payments begin, your USDT
                              earnings will be converted to ETH based on the
                              current ETH price and sent to your wallet.
                            </li>
                            <li>
                              Check our announcements after each payout to
                              confirm the transaction.
                            </li>
                          </ul>
                        </section>
                        <hr />

                        <section>
                          <h2>HOW IS THE STAKE POOL FUNDED?</h2>
                          <p>
                            The stake pool is backed by a $700,000 treasury,
                            allocated to low-risk crypto strategies (staking +
                            yield farming). This ensures consistent and stable
                            payouts.
                          </p>
                        </section>
                        <hr />

                        <section>
                          <h2>HOW LONG WILL STAKING BE AVAILABLE?</h2>
                          <p>
                            The staking system will run until June 2026. After
                            that, we transition to Play & Earn, with the release
                            of the Mechibis Game.
                          </p>
                        </section>
                        <hr />
                      </div>
                    </ModalContent>
                  </Modal>
                  <Modal
                    id="modal"
                    show={isContestModalOpen}
                    onClick={closeContestModal}
                  >
                    <ModalContent>
                      <CloseButton
                        onClick={() => {
                          setIsContestModalOpen(false);
                          document.body.style.overflow = "auto";
                        }}
                      >
                        &times;
                      </CloseButton>
                      <div className="modalStake">
                        <h1 style={{ textAlign: "center" }}>
                          Mechibis - $5000 Mint Contest
                        </h1>
                        <hr />

                        <section>
                          <h2>$5000 MINT CONTEST</h2>
                          <p>
                            We’re rewarding those who mint during the Main Mint!
                            (Mint will remain open for 4 hours or until sold
                            out.)
                          </p>
                        </section>
                        <hr />

                        <section>
                          <h2>PRIZES</h2>
                          <ul>
                            <li>🥇 $1500</li>
                            <li>🥈 $1200</li>
                            <li>🥉 $1000</li>
                            <li>4️⃣ $600</li>
                            <li>5️⃣ $400</li>
                            <li>6️⃣ $200</li>
                            <li>7️⃣ $100</li>
                          </ul>
                        </section>
                        <hr />

                        <section>
                          <p>Between 26 June - 13:00 UTC and 17:00 UTC</p>
                          <p>
                            You will earn 1 ticket for every mint you make
                            between 13:00 UTC and 17:00 UTC.
                          </p>
                          <p>
                            For example, if you mint 5 NFTs, you will get 5
                            tickets.
                          </p>
                          <p>More Tickets = More Luck</p>
                          <p>
                            Only mints made in the Main Mint will be
                            eligible.
                          </p>
                        </section>
                        <hr />

                        <section>
                          <p>
                            After minting, be sure to fill out the form to match
                            your wallet address with your username:
                          </p>
                          <p>
                            <a
                              href="https://dyno.gg/form/c967e6a7"
                              target="_blank"
                            >
                              https://dyno.gg/form/c967e6a7
                            </a>
                          </p>
                        </section>
                        <hr />

                        <section>
                          <p>
                            A random draw will be held after the Mint ends and
                            prizes will be distributed to the winners.
                          </p>
                          <p>Good luck Mechibis World!</p>
                        </section>
                        <hr />
                      </div>
                    </ModalContent>
                  </Modal>
                </div>
              </div>
            </s.Container>

            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: "60px",
                    fontWeight: "900",
                    letterSpacing: "10px",
                    textShadow: "rgb(0 255 95) 0px 0px 30px",
                    textTransform: "uppercase",
                    fontFamily: "Font1",
                    lineHeight: "85px",
                    margin: "0",
                    marginBottom: "10px",
                    marginTop: "60px",
                    padding: "0",
                  }}
                >
                  SOLD OUT
                </s.TextTitle>
              </>
            ) : (
              <>
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.SpacerSmall />
                    <StyledButton
                      style={{
                        letterSpacing: "3.5px",
                        paddingRight: "17px",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      Connect Wallet
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.Container
                      style={{
                        padding: "0",
                        maxWidth: "350px",
                        width: "100%",
                        margin: "0px auto",
                        fontWeight: "bold",
                        color: "#C0C0C0",
                        textShadow: "0 0 15px rgba(192, 192, 192, 0.9)",
                        color: "var(--accent-text)",
                      }}
                    >
                      <div
                        style={{
                          borderTop: "2px solid #C0C0C0",
                          boxShadow: "0 0 12px rgba(192, 192, 192, 0.9)",
                          width: "100%",
                        }}
                      ></div>

                      <StyledDiv>
                        <span style={{ marginTop: "7px" }}>AMOUNT</span>

                        <span style={{ display: "flex", alignItems: "center" }}>
                          <StyledRoundButton
                            style={{ lineHeight: 0.4 }}
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              decrementMintAmount();
                            }}
                          >
                            -
                          </StyledRoundButton>
                          <s.SpacerMedium />
                          <StyledTextDescription>
                            {mintAmount}
                          </StyledTextDescription>
                          <s.SpacerMedium />
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
                    </s.Container>
                    <s.SpacerSmall />
                    {feedback && (
                      <s.TextDescription
                        id="feedback"
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                          border: "3px solid rgba(187, 12, 12, 0.9)",
                          background: "rgba(28,28,36,0.95)",
                          boxShadow: "0 0 20px rgba(187, 12, 12, 0.9)",
                          borderRadius: "20px",
                          padding: "20px",
                          fontFamily: "Font3",
                          fontWeight: "bold",
                          fontSize: "17px",
                          marginBottom: "25px",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                    )}
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft || !isLive ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            className="imageContainer"
          >
            <StyledImg alt={"Mechibis"} src={"/config/images/3.png"} />
            <StyledImg alt={"Mechibis"} src={"/config/images/4.png"} />
          </s.Container>
        </ResponsiveWrapper>
        <footer class="footer">
          <a
            href="https://discord.gg/mechibis"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/config/images/discord.png" alt="Discord" class="icon" />
          </a>
          <a
            href="https://x.com/mechibisgame"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/config/images/twitter.png" alt="Twitter" class="icon" />
          </a>
          <a
            href="https://opensea.io/collection/mechibisgame"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/config/images/opensea.png"
              style={{ width: 65, height: 65 }}
              alt="OpenSea"
              class="icon"
            />
          </a>
        </footer>
      </s.Container>
    </s.Screen>
  );
}

export default App;
