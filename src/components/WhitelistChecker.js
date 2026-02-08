import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import styled, { keyframes } from "styled-components";
import * as s from "../styles/globalStyles";

const CheckerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  padding: 20px;
`;

const CheckButton = styled.button`
  padding: 12px 20px;
  border-radius: 12px;
  border: 2px solid rgba(0, 212, 255, 0.7);
  background: linear-gradient(135deg, rgba(0, 100, 180, 0.9) 0%, rgba(0, 140, 230, 0.9) 100%);
  font-weight: 600;
  font-size: 0.95rem;
  font-family: "Exo 2", "Font2", sans-serif;
  letter-spacing: 2px;
  color: #00ffff;
  text-shadow: 0 0 15px rgba(0, 255, 255, 0.7), 0 0 30px rgba(0, 150, 255, 0.4);
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.3), inset 0 0 12px rgba(0, 150, 255, 0.05);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 140, 230, 0.95) 0%, rgba(0, 200, 255, 0.95) 100%);
    border: 2px solid rgba(0, 255, 255, 1);
    color: white;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4), 0 0 35px rgba(0, 212, 255, 0.25), inset 0 0 18px rgba(0, 255, 255, 0.1);
    transform: scale(1.05);
  }

  &:active {
    background: linear-gradient(135deg, rgba(0, 60, 120, 0.95) 0%, rgba(0, 100, 180, 0.95) 100%);
    box-shadow: 0 0 10px rgba(0, 150, 255, 0.3);
    border: 2px solid rgba(0, 120, 220, 0.8);
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 10px 16px;
    letter-spacing: 1.5px;
  }
`;

const WalletInfoBox = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 30px;
  background: linear-gradient(135deg, rgba(10, 17, 40, 0.95) 0%, rgba(20, 30, 70, 0.95) 100%);
  border: 2px solid rgba(0, 150, 255, 0.6);
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 150, 255, 0.3), inset 0 0 15px rgba(0, 150, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 20px;
    max-width: 100%;
  }
`;

const InfoLabel = styled.div`
  font-family: "Exo 2", "Font2", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #00d4ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.6);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const AddressDisplay = styled.div`
  font-family: "Rajdhani", "Font2", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #00ffff;
  text-align: center;
  word-break: break-all;
  padding: 15px 20px;
  background: rgba(0, 100, 200, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.4);
  border-radius: 12px;
  text-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
  width: 100%;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 12px 15px;
  }
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  background: ${props => props.whitelisted 
    ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 200, 100, 0.2) 100%)'
    : 'linear-gradient(135deg, rgba(255, 100, 100, 0.2) 0%, rgba(200, 50, 50, 0.2) 100%)'
  };
  border: 2px solid ${props => props.whitelisted 
    ? 'rgba(0, 255, 136, 0.6)'
    : 'rgba(255, 100, 100, 0.6)'
  };
  border-radius: 12px;
  box-shadow: 0 0 15px ${props => props.whitelisted 
    ? 'rgba(0, 255, 136, 0.3)'
    : 'rgba(255, 100, 100, 0.3)'
  };
  width: 100%;

  .icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${props => props.whitelisted 
      ? 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)'
      : 'linear-gradient(135deg, #ff6464 0%, #cc0000 100%)'
    };
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px ${props => props.whitelisted 
      ? 'rgba(0, 255, 136, 0.5)'
      : 'rgba(255, 100, 100, 0.5)'
    };
    flex-shrink: 0;
    
    &::after {
      content: '${props => props.whitelisted ? '✓' : '✗'}';
      color: white;
      font-weight: bold;
      font-size: 16px;
      text-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
    }
  }
  
  .text {
    font-family: "Exo 2", sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.whitelisted ? '#00ff99' : '#ff6464'};
    text-shadow: 0 0 12px ${props => props.whitelisted 
      ? 'rgba(0, 255, 153, 0.6)'
      : 'rgba(255, 100, 100, 0.6)'
    };
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    
    .icon {
      width: 20px;
      height: 20px;
      
      &::after {
        font-size: 14px;
      }
    }
    
    .text {
      font-size: 14px;
    }
  }
`;

const CloseButton = styled.button`
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid rgba(0, 150, 255, 0.5);
  background: rgba(0, 80, 160, 0.6);
  font-family: "Exo 2", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #00d4ff;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 100, 180, 0.8);
    border-color: rgba(0, 212, 255, 0.8);
    color: #00ffff;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25px;
  padding: 40px;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 150, 255, 0.2);
  border-top: 4px solid #00d4ff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.4), inset 0 0 10px rgba(0, 150, 255, 0.2);

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    border-width: 3px;
  }
`;

const LoadingText = styled.div`
  font-family: "Exo 2", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #00d4ff;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(0, 212, 255, 0.7);

  @media (max-width: 768px) {
    font-size: 16px;
    letter-spacing: 1.5px;
  }
`;

function WhitelistChecker({ show, onClose }) {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [isCheckingWhitelist, setIsCheckingWhitelist] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [whitelistPhase, setWhitelistPhase] = useState(''); // 'GTD' or 'FCFS'
  const [whitelistAddresses, setWhitelistAddresses] = useState([]);
  const [fcfsWhitelistAddresses, setFcfsWhitelistAddresses] = useState([]);

  // Load whitelist addresses from txt files
  useEffect(() => {
    const loadWhitelists = async () => {
      try {
        // Load GTD whitelist
        const gtdResponse = await fetch('/config/whitelist.txt');
        const gtdText = await gtdResponse.text();
        const gtdAddresses = gtdText
          .split('\n')
          .map(addr => addr.trim().toLowerCase())
          .filter(addr => addr.length > 0);
        setWhitelistAddresses(gtdAddresses);

        // Load FCFS whitelist
        const fcfsResponse = await fetch('/config/fcfswhitelist.txt');
        const fcfsText = await fcfsResponse.text();
        const fcfsAddresses = fcfsText
          .split('\n')
          .map(addr => addr.trim().toLowerCase())
          .filter(addr => addr.length > 0);
        setFcfsWhitelistAddresses(fcfsAddresses);
      } catch (error) {
        console.error('Error loading whitelists:', error);
        setWhitelistAddresses([]);
        setFcfsWhitelistAddresses([]);
      }
    };
    
    loadWhitelists();
  }, []);

  // When wallet connects, show loading for 4 seconds and check whitelist
  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null && !showResults) {
      setIsCheckingWhitelist(true);
      
      const timer = setTimeout(() => {
        // Check if wallet address is in whitelist
        const walletLower = blockchain.account.toLowerCase();
        
        // FCFS has priority over GTD
        if (fcfsWhitelistAddresses.includes(walletLower)) {
          setIsWhitelisted(true);
          setWhitelistPhase('FCFS');
        } else if (whitelistAddresses.includes(walletLower)) {
          setIsWhitelisted(true);
          setWhitelistPhase('GTD');
        } else {
          setIsWhitelisted(false);
          setWhitelistPhase('');
        }
        
        setIsCheckingWhitelist(false);
        setShowResults(true);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [blockchain.account, blockchain.smartContract, showResults, whitelistAddresses, fcfsWhitelistAddresses]);

  const handleConnectForWhitelist = (e) => {
    e.preventDefault();
    dispatch(connect());
  };

  const handleClose = () => {
    // Reset states when closing
    setIsCheckingWhitelist(false);
    setShowResults(false);
    setIsWhitelisted(false);
    setWhitelistPhase('');
    if (onClose) {
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  // Loading state - checking wallet
  if (isCheckingWhitelist) {
    return (
      <CheckerContainer>
        <LoadingContainer>
          <Spinner />
          <LoadingText>Checking Your Wallet Status</LoadingText>
        </LoadingContainer>
      </CheckerContainer>
    );
  }

  return (
    <CheckerContainer>
      {!showResults ? (
        <>
          <InfoLabel>Connect Wallet to Check Whitelist Status</InfoLabel>
          <CheckButton onClick={handleConnectForWhitelist}>
            Connect Wallet
          </CheckButton>
          {blockchain.errorMsg !== "" && (
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "#ff6464",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {blockchain.errorMsg}
            </s.TextDescription>
          )}
        </>
      ) : (
        <WalletInfoBox>
          <InfoLabel>Wallet Connected</InfoLabel>
          <AddressDisplay>{blockchain.account}</AddressDisplay>
          
          {/* Whitelist Status - Dynamically checked with phase */}
          <StatusBadge whitelisted={isWhitelisted}>
            <div className="icon"></div>
            <div className="text">
              {isWhitelisted 
                ? `Whitelisted for ${whitelistPhase} Phase` 
                : 'Wallet Not Whitelisted'}
            </div>
          </StatusBadge>
          
          <CloseButton onClick={handleClose}>Close</CloseButton>
        </WalletInfoBox>
      )}
    </CheckerContainer>
  );
}

export default WhitelistChecker;
