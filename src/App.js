import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Countdown from "react-countdown";
import ReactGA from "react-ga4";
import { PuckCanvas } from "./PuckCanvas";

ReactGA.initialize("G-0HS7GKYZHX");

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



function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [isLive, setIsLive] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
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
    <>
      <div className="bg-halftone" />
      <div className="stripe-top" />
      <div className="stripe-bottom" />
      <PuckCanvas />
      <div className="mint-wrapper">
        <div className="mint-ticket">
          <div className="mint-ticket-header">
            <span className="mint-ticket-header-title">PINGUIN — 1ST DROP</span>
          </div>
          <div className="mint-ticket-body">
            <StyledTextTitle>Pinguin</StyledTextTitle>

            <MintPhaseTitle>1st DROP</MintPhaseTitle>

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
          </div>
          <div className="mint-ticket-stub">
            <span>🐧 Pinguin © 2026</span>
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
