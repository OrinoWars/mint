import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled, { keyframes } from "styled-components";
import ReactDOM from "react-dom";
import Countdown from "react-countdown";
import ReactGA from "react-ga4";
import WhitelistChecker from "./components/WhitelistChecker";

ReactGA.initialize("G-CLEY5YQ96C");

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

const StyledTextDescription = styled(s.TextDescription)`
  text-align: center;
  width: 20px;
  font-size: 25px;
  color: #00d4ff;
  padding-top: 2px;
  text-shadow: 0 0 15px rgba(0, 150, 255, 0.8);
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const MintPhaseTitle = styled(s.TextTitle)`
  text-align: center;
  color: #00ffff;
  font-size: 20px;
  letter-spacing: 10px;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.3), 0 0 16px rgba(0, 200, 255, 0.15);
  text-transform: uppercase;
  font-family: "Orbitron", "Font1", sans-serif;
  font-weight: 700;
  line-height: 1;
  margin: 0 0 20px 0;
  padding: 0;

  @media (max-width: 768px) {
    font-size: 17px;
  }
`;

const StyledTextTitle = styled(s.TextTitle)`
  text-align: center;
  color: #00d4ff;
  font-size: 60px;
  letter-spacing: 10px;
  text-shadow: 0 0 10px rgba(0, 150, 255, 0.4), 0 0 20px rgba(0, 200, 255, 0.2);
  text-transform: uppercase;
  font-family: "Orbitron", "Font1", sans-serif;
  font-weight: 900;
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
  font-family: "Rajdhani", "Font2", sans-serif;
  font-weight: 600;
  color: #00d4ff;
  text-shadow: 0 0 20px rgba(0, 150, 255, 0.8);

  @media (max-width: 768px) {
    font-size: 20px;
    padding: 8px 4px;
  }
`;

export const StyledButton = styled.button`
  padding: 14px 18px;
  padding-right: 8px;
  border-radius: 14px;
  border: 2px solid rgba(0, 150, 255, 0.8);
  background: linear-gradient(135deg, rgba(0, 80, 160, 0.95) 0%, rgba(0, 120, 220, 0.95) 100%);
  font-weight: bold;
  font-size: 1.1rem;
  font-family: "Exo 2", "Font2", sans-serif;
  letter-spacing: 8px;
  color: #00ffff;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 150, 255, 0.5);
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(0, 150, 255, 0.3), inset 0 0 15px rgba(0, 150, 255, 0.05);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 120, 220, 0.95) 0%, rgba(0, 180, 255, 0.95) 100%);
    border: 2px solid rgba(0, 212, 255, 1);
    color: white;
    box-shadow: 0 0 25px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 150, 255, 0.25), inset 0 0 20px rgba(0, 212, 255, 0.1);
    transform: scale(1.1);
  }

  &:active {
    background: linear-gradient(135deg, rgba(0, 50, 100, 0.95) 0%, rgba(0, 80, 160, 0.95) 100%);
    box-shadow: 0 0 12px rgba(0, 150, 255, 0.3);
    border: 2px solid rgba(0, 100, 200, 0.8);
    transform: scale(0.95);
  }

  &:disabled {
    background: linear-gradient(135deg, rgba(50, 50, 60, 0.5) 0%, rgba(70, 70, 80, 0.5) 100%);
    border: 2px solid rgba(100, 100, 120, 0.5);
    color: rgba(150, 150, 170, 0.7);
    text-shadow: none;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 12px 14px;
    padding-right: 6px;
    letter-spacing: 6px;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 150, 255, 0.6);
  background: linear-gradient(145deg, rgba(0, 80, 160, 0.8), rgba(0, 120, 220, 0.8));
  font-weight: bold;
  font-size: 18px;
  color: #00ffff;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 150, 255, 0.2),
    inset 0 0 10px rgba(0, 150, 255, 0.05);
  transition: all 0.2s ease-in-out;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);

  &:hover {
    background: linear-gradient(145deg, rgba(0, 120, 220, 0.9), rgba(0, 180, 255, 0.9));
    box-shadow: 0 3px 12px rgba(0, 150, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.2);
    border: 1px solid rgba(0, 212, 255, 0.8);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.3);
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
  justify-content: center;
  align-items: center;
  width: 100%;
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
  box-shadow: 0px 3px 8px 1px rgba(0, 0, 0, 0.4);
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
  color: #00d4ff;
  text-align: center;
  font-size: 3rem;
  padding: 20px;
  padding-top: 5px;
  border: 3px solid rgba(0, 150, 255, 0.8);
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(10, 17, 40, 0.95) 0%, rgba(20, 30, 70, 0.95) 100%);
  box-shadow: 0 0 20px rgba(0, 150, 255, 0.3), inset 0 0 15px rgba(0, 150, 255, 0.05);
  width: auto;
  margin: 20px auto;
  letter-spacing: 1px;
  font-family: "Orbitron", "Font1", sans-serif;

  @media (max-width: 768px) {
    font-size: 35px;
    padding: 15px;
    margin-right: 0px;
    margin-left: 0px;
    padding-top: 5px;
  }
`;

const TimerText = styled.span`
  color: #00ffff;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.9), 0 0 40px rgba(0, 150, 255, 0.6);
  font-size: 30px;
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const TimerUnit = styled.span`
  font-size: 1.2rem;
  font-weight: normal;
  margin-left: 0px;
  color: #0096ff;
  text-shadow: 0 0 15px rgba(0, 150, 255, 0.8);
  font-family: "Exo 2", sans-serif;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const TimerDivider = styled.span`
  font-size: 30px;
  color: #00d4ff;
  margin: 0 5px;
  text-shadow: 0 0 15px rgba(0, 212, 255, 0.8);
`;

const MintStartedText = styled.span`
  color: #00ffff;
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 0 0 40px rgba(0, 255, 255, 1), 0 0 80px rgba(0, 212, 255, 0.8);
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;


const MintBoxWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  padding: 25px;
  background: linear-gradient(135deg, #0c1445 0%, #1a1f5e 50%, #0f1b3d 100%);
  border-radius: 30px;
  box-shadow: 0 5px 30px rgba(0, 150, 255, 0.2), 0 0 50px rgba(0, 100, 255, 0.1), inset 0 0 40px rgba(0, 150, 255, 0.05);
  border: 2px solid rgba(0, 150, 255, 0.6);

  @media (max-width: 968px) {
    flex-direction: column;
    padding: 20px;
    gap: 15px;
    order: 2;
  }
`;

const TiltedBox = styled.div`
  flex: ${props => props.flex || 1};
  background: ${props => props.bg || 'linear-gradient(135deg, rgba(8, 14, 30, 0.98) 0%, rgba(15, 23, 45, 0.98) 100%)'};
  padding: 30px 25px;
  border-radius: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 150, 255, 0.08);
  border: 1px solid rgba(0, 150, 255, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 600px;
  min-height: 600px;
  max-height: 600px;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 50, 100, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #0096ff 0%, #00d4ff 100%);
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 150, 255, 0.3);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #00b0ff 0%, #00ffff 100%);
  }

  @media (max-width: 968px) {
    padding: 20px 15px;
    height: auto;
    max-height: none;
  }
`;

const InfoBox = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #0a1128 0%, #162447 50%, #1f4068 100%);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 150, 255, 0.3), inset 0 0 30px rgba(0, 200, 255, 0.1);
  border: 1px solid rgba(0, 200, 255, 0.6);
  padding: 25px 25px;
  border-radius: 24px;
  scroll-behavior: smooth;
  height: 600px;
  min-height: 600px;
  max-height: 600px;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 50, 100, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #0096ff 0%, #00d4ff 100%);
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(0, 150, 255, 0.3);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #00d4ff 0%, #00ffff 100%);
  }

  @media (max-width: 968px) {
    padding: 20px 15px;
    height: auto;
    max-height: 500px;
  }
`;

const InfoTitle = styled.h2`
  color: #ffffff;
  font-family: "Orbitron", "Font1", sans-serif;
  font-size: 26px;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin: 0 0 20px 0;
  padding-top: 5px;
  line-height: 1.4;
  font-weight: 900;
  background: linear-gradient(90deg, #00ffff 0%, #ffffff 50%, #00ffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;

const InfoSubtitle = styled.h3`
  color: #00d4ff;
  font-family: "Exo 2", "Font2", sans-serif;
  font-size: 17px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 20px 0 10px 0;
  text-shadow: 0 0 25px rgba(0, 212, 255, 1), 0 0 50px rgba(0, 150, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 14px;
    margin: 15px 0 8px 0;
  }
`;

const InfoText = styled.p`
  color: #e0f0ff;
  font-family: "Exo 2", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.7;
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 12px;
    line-height: 1.5;
  }
`;

const InfoList = styled.ul`
  color: #e0f0ff;
  font-family: "Exo 2", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.8;
  margin: 10px 0 15px 0;
  padding-left: 20px;

  li {
    margin-bottom: 8px;
  }

  strong {
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
    font-weight: 700;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding-left: 15px;
  }
`;

const NodeBadge = styled.div`
  background: ${props => props.bg || 'rgba(0, 100, 200, 0.3)'};
  border: 1px solid ${props => props.border || 'rgba(0, 150, 255, 0.5)'};
  border-radius: 8px;
  padding: 10px 15px;
  margin: 8px 0;
  color: #00d4ff;
  font-family: "Rajdhani", "Font2", sans-serif;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 0 10px ${props => props.glow || 'rgba(0, 150, 255, 0.2)'};

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 8px 12px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 150, 255, 0.5) 50%, transparent 100%);
  margin: 20px 0;
  box-shadow: 0 0 6px rgba(0, 150, 255, 0.2);

  @media (max-width: 768px) {
    margin: 15px 0;
  }
`;

const RoundsContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  margin-top: 10px;
  margin-bottom: 15px;
  padding: 0 40px;

  @media (max-width: 968px) {
    flex-direction: column;
    gap: 10px;
    padding: 0 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    order: 3;
  }
`;

const RoundItem = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px 20px;
  background: ${props => props.active ? 'linear-gradient(135deg, rgba(15, 25, 60, 0.98) 0%, rgba(25, 40, 90, 0.98) 100%)' : 'linear-gradient(135deg, rgba(10, 17, 40, 0.7) 0%, rgba(15, 25, 50, 0.7) 100%)'};
  border-radius: 15px;
  box-shadow: ${props => props.active ? '0 2px 15px rgba(0, 150, 255, 0.3), inset 0 0 20px rgba(0, 150, 255, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.2)'};
  border: 2px solid ${props => props.active ? 'rgba(0, 150, 255, 0.8)' : 'rgba(0, 100, 200, 0.5)'};
  transition: all 0.3s ease;
  opacity: ${props => props.active ? '1' : '0.7'};

  @media (max-width: 968px) {
    width: 100%;
    padding: 12px 15px;
    gap: 10px;
  }
`;

const RoundCheckIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => {
    if (props.status === 'ended') return 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
    if (props.active) return 'linear-gradient(135deg, #00a0ff 0%, #00e0ff 100%)';
    return 'linear-gradient(135deg, #505560 0%, #3d4148 100%)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 5px;
  box-shadow: ${props => {
    if (props.status === 'ended') return '0 1px 5px rgba(255, 0, 0, 0.3)';
    if (props.active) return '0 2px 10px rgba(0, 150, 255, 0.4), 0 0 15px rgba(0, 212, 255, 0.2)';
    return '0 1px 4px rgba(0, 0, 0, 0.2)';
  }};
  border: 2px solid ${props => {
    if (props.status === 'ended') return 'rgba(255, 100, 100, 0.6)';
    if (props.active) return 'rgba(0, 212, 255, 0.9)';
    return 'rgba(120, 130, 145, 0.4)';
  }};

  &::after {
    content: ${props => {
      if (props.status === 'ended') return "'✗'";
      if (props.active) return "'✓'";
      return "'⏳'";
    }};
    color: ${props => {
      if (props.status === 'ended') return 'white';
      if (props.active) return 'white';
      return 'rgba(160, 170, 185, 0.85)';
    }};
    font-weight: bold;
    font-size: ${props => props.status === 'upcoming' ? '16px' : '18px'};
    text-shadow: ${props => props.active ? '0 0 8px rgba(255, 255, 255, 0.8)' : 'none'};
    filter: ${props => props.status === 'upcoming' ? 'grayscale(0.3)' : 'none'};
  }

  @media (max-width: 768px) {
    width: 25px;
    height: 25px;
    margin-top: 3px;
    
    &::after {
      font-size: ${props => props.status === 'upcoming' ? '13px' : '14px'};
    }
  }
`;

const RoundContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const RoundTitle = styled.div`
  font-family: "Exo 2", "Font2", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #00d4ff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 0 15px rgba(0, 150, 255, 0.6);

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const RoundStatus = styled.div`
  font-family: "Rajdhani", "Font4", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.active ? '#00ffff' : '#0080ff'};
  text-transform: uppercase;
  font-weight: 600;
  text-shadow: ${props => props.active ? '0 0 10px rgba(0, 255, 255, 0.8)' : 'none'};

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const RoundProgress = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(0, 50, 100, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 5px;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress || '0%'};
    height: 100%;
    background: ${props => props.active ? 'linear-gradient(90deg, #0096ff 0%, #00d4ff 100%)' : 'linear-gradient(90deg, #003d66 0%, #005580 100%)'};
    box-shadow: ${props => props.active ? '0 0 6px rgba(0, 150, 255, 0.5)' : 'none'};
    transition: width 0.3s ease;
  }
`;

const MintHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 5px;

  @media (max-width: 968px) {
    margin-bottom: 30px;
    margin-top: 5px;
    order: 1;
  }
`;

const BlurOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(8, 14, 30, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  gap: 20px;
`;

const PreRoundCountdown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  
  .countdown-label {
    font-family: "Exo 2", sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #00d4ff;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-align: center;
    text-shadow: 0 0 15px rgba(0, 212, 255, 0.8);
  }
  
  .countdown-timer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    gap: 15px;
    
    .countdown-label {
      font-size: 16px;
      letter-spacing: 2px;
    }
    
    .countdown-timer {
      gap: 15px;
    }
  }
`;

const WhitelistCheckButton = styled.button`
  padding: 12px 24px;
  margin-top: 15px;
  border-radius: 14px;
  border: 2px solid rgba(0, 255, 136, 0.7);
  background: linear-gradient(135deg, rgba(0, 180, 100, 0.9) 0%, rgba(0, 220, 130, 0.9) 100%);
  font-weight: 700;
  font-size: 1rem;
  font-family: "Exo 2", "Font2", sans-serif;
  letter-spacing: 2px;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(0, 255, 170, 0.6), 0 0 20px rgba(0, 200, 130, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.3), inset 0 0 12px rgba(0, 200, 100, 0.05);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: linear-gradient(135deg, rgba(0, 220, 130, 0.95) 0%, rgba(0, 255, 150, 0.95) 100%);
    border: 2px solid rgba(0, 255, 170, 1);
    color: #ffffff;
    text-shadow: 0 0 15px rgba(0, 255, 200, 0.8), 0 0 30px rgba(0, 255, 170, 0.5), 0 2px 4px rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 20px rgba(0, 255, 170, 0.5), 0 0 35px rgba(0, 255, 136, 0.3), inset 0 0 18px rgba(0, 255, 170, 0.15);
    transform: scale(1.05);
  }

  &:active {
    background: linear-gradient(135deg, rgba(0, 120, 70, 0.95) 0%, rgba(0, 180, 100, 0.95) 100%);
    box-shadow: 0 0 10px rgba(0, 200, 100, 0.3);
    border: 2px solid rgba(0, 220, 130, 0.8);
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 18px;
    letter-spacing: 1.5px;
    margin-top: 12px;
  }
`;

const InfoBadgesContainer = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: stretch;
  margin: 0 0 12px 0;
  flex-wrap: nowrap;
  width: 100%;
  max-width: 600px;

  @media (max-width: 768px) {
    gap: 5px;
    margin: 0 0 10px 0;
    flex-wrap: wrap;
  }
`;

const InfoBadge = styled.div`
  flex: 1;
  background: linear-gradient(135deg, rgba(0, 100, 200, 0.3) 0%, rgba(0, 150, 255, 0.2) 100%);
  border: 2px solid rgba(0, 150, 255, 0.6);
  border-radius: 15px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: "Exo 2", "Font2", sans-serif;
  color: #00d4ff;
  text-shadow: 0 0 15px rgba(0, 212, 255, 0.8);
  box-shadow: 0 2px 10px rgba(0, 150, 255, 0.2), inset 0 0 10px rgba(0, 150, 255, 0.05);
  transition: all 0.3s ease;
  min-width: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 15px rgba(0, 150, 255, 0.3), inset 0 0 15px rgba(0, 150, 255, 0.08);
    border-color: rgba(0, 212, 255, 0.8);
  }

  .badge-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  span.label {
    font-size: 13px;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
    white-space: nowrap;
  }

  span.value {
    font-weight: 700;
    font-size: 20px;
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.9);
    font-family: "Rajdhani", "Font2", sans-serif;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
    gap: 6px;
    flex: 1 1 auto;

    span.label {
      font-size: 11px;
    }

    span.value {
      font-size: 16px;
    }
  }
`;

const AmountSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 20px 0;

  @media (max-width: 768px) {
    margin: 15px 0;
    gap: 10px;
  }
`;

const AmountLabel = styled.div`
  font-family: "Exo 2", "Font2", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #00d4ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(0, 212, 255, 0.8);

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const AmountControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const IconSVG = styled.svg`
  width: 20px;
  height: 20px;
  fill: currentColor;
  filter: drop-shadow(0 0 6px rgba(0, 212, 255, 0.5));
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }
`;

const MintCountdown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(10, 17, 40, 0.8) 0%, rgba(20, 30, 70, 0.8) 100%);
  border-radius: 20px;
  border: 2px solid rgba(0, 150, 255, 0.5);
  box-shadow: 0 2px 10px rgba(0, 150, 255, 0.2), inset 0 0 10px rgba(0, 150, 255, 0.05);
  
  @media (max-width: 768px) {
    gap: 10px;
    padding: 12px;
    margin-top: 8px;
  }
`;

const CountdownLabel = styled.div`
  font-family: "Exo 2", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #00d4ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 5px;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CountdownTimerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const CountdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  
  .number {
    font-family: "Orbitron", "Font1", sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #00ffff;
    text-shadow: 0 0 15px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 212, 255, 0.5);
    min-width: 50px;
    text-align: center;
  }
  
  .label {
    font-family: "Exo 2", sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #0096ff;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  @media (max-width: 768px) {
    .number {
      font-size: 24px;
      min-width: 40px;
    }
    
    .label {
      font-size: 10px;
    }
  }
`;

const CountdownSeparator = styled.div`
  font-family: "Orbitron", sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
  
  @media (max-width: 768px) {
    font-size: 24px;
    display: none;
  }
`;

const EligibilityBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
  
  .checkmark {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 12px rgba(0, 255, 136, 0.5);
    flex-shrink: 0;
    
    &::after {
      content: '✓';
      color: white;
      font-weight: bold;
      font-size: 14px;
      text-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
    }
  }
  
  .message {
    font-family: "Exo 2", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #00ff99;
    text-shadow: 0 0 12px rgba(0, 255, 153, 0.6);
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 768px) {
    gap: 6px;
    margin-bottom: 10px;
    
    .checkmark {
      width: 18px;
      height: 18px;
      
      &::after {
        font-size: 12px;
      }
    }
    
    .message {
      font-size: 12px;
    }
  }
`;

const MintTitle = styled.h1`
  text-align: center;
  color: #00d4ff;
  font-size: 60px;
  letter-spacing: 10px;
  text-shadow: 0 0 15px rgba(0, 150, 255, 0.6), 0 0 30px rgba(0, 200, 255, 0.3);
  text-transform: uppercase;
  font-family: "Orbitron", "Font1", sans-serif;
  font-weight: 900;
  line-height: 1.2;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const MintSubtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
  width: 100%;
  max-width: 600px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, rgba(0, 150, 255, 0.6) 50%, transparent 100%);
    box-shadow: 0 0 8px rgba(0, 150, 255, 0.4);
  }

  span {
    font-family: "Exo 2", "Font2", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #00d4ff;
    text-transform: uppercase;
    letter-spacing: 3px;
    white-space: nowrap;
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
  }

  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 10px;
    max-width: 90%;

    span {
      font-size: 14px;
      letter-spacing: 2px;
    }

    &::before,
    &::after {
      height: 1px;
    }
  }
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [isLive, setIsLive] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [currentRound, setCurrentRound] = useState(0); // 0: not started, 1, 2, 3
  const [roundCountdown, setRoundCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    targetRound: 1,
    isWaitingForStart: true
  });
  const [showWhitelistChecker, setShowWhitelistChecker] = useState(false);
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

  // Round start times (UTC)
  // ORIGINAL VALUES (restore after testing):
  // round1: new Date('2026-02-10T15:00:00Z'), // GTD - 10 Feb 2026 15:00 UTC
  // round2: new Date('2026-02-10T17:00:00Z'), // FCFS - 10 Feb 2026 17:00 UTC (2 hours after round1)
  // round3: new Date('2026-02-10T19:00:00Z'), // PUBLIC - 10 Feb 2026 19:00 UTC (2 hours after round2)
  
  // TEST VALUES (remove after testing):
  const ROUND_TIMES = {
    round1: new Date('2026-02-10T15:00:00Z'), // TEST: 6 Feb 2026 18:05 UTC
    round2: new Date('2026-02-10T17:00:00Z'), // TEST: 6 Feb 2026 18:10 UTC (5 min after round1)
    round3: new Date('2026-02-10T19:00:00Z'), // TEST: 6 Feb 2026 18:15 UTC (5 min after round2)
  };

  // Determine current round and update countdown
  useEffect(() => {
    const updateRoundStatus = () => {
      const now = new Date();
      
      // Determine which round we're in
      if (now < ROUND_TIMES.round1) {
        // Before Round 1 starts
        setCurrentRound(0);
        setIsLive(false);
        
        // Calculate time until Round 1
        const diff = ROUND_TIMES.round1 - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setRoundCountdown({
          days,
          hours,
          minutes,
          seconds,
          targetRound: 1,
          isWaitingForStart: true
        });
      } else if (now >= ROUND_TIMES.round1 && now < ROUND_TIMES.round2) {
        // Round 1 is active
        setCurrentRound(1);
        setIsLive(true);
        
        // Calculate time until Round 2
        const diff = ROUND_TIMES.round2 - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setRoundCountdown({
          days: 0,
          hours,
          minutes,
          seconds,
          targetRound: 2,
          isWaitingForStart: false
        });
      } else if (now >= ROUND_TIMES.round2 && now < ROUND_TIMES.round3) {
        // Round 2 is active
        setCurrentRound(2);
        setIsLive(true);
        
        // Calculate time until Round 3
        const diff = ROUND_TIMES.round3 - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setRoundCountdown({
          days: 0,
          hours,
          minutes,
          seconds,
          targetRound: 3,
          isWaitingForStart: false
        });
      } else {
        // Round 3 (PUBLIC) is active - no countdown
        setCurrentRound(3);
        setIsLive(true);
        
        setRoundCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          targetRound: 3,
          isWaitingForStart: false
        });
      }
    };

    // Initial update
    updateRoundStatus();

    // Update every second
    const interval = setInterval(updateRoundStatus, 1000);

    return () => clearInterval(interval);
  }, []);

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
          "0 0 10px rgba(0, 255, 0, 0.3)";
        document.getElementById("feedback").style.border =
          "2px solid rgb(0 255 29 / 90%)";
        setFeedback(
          `Mint successful! Follow the instructions on Discord for node activation.`
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
    // Get max mint based on current round
    const maxMintByRound = {
      0: 3,  // Before Round 1 (default to GTD limit)
      1: 3,  // GTD
      2: 5,  // FCFS
      3: 10, // PUBLIC
    };
    const maxMint = maxMintByRound[currentRound] || 3;
    
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > maxMint) {
      newMintAmount = maxMint;
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
          padding: "10px 24px 24px 24px",
          backgroundImage: "url('/bgweb.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#0a0e27",
        }}
      >
        <ResponsiveWrapper flex={1} style={{ padding: "10px 24px 24px 24px", justifyContent: 'center', flexDirection: 'column' }} test>
          <MintHeader>
            <MintTitle>Orion Wars</MintTitle>
            <MintSubtitle>
              <span>Node Deployment</span>
            </MintSubtitle>
          </MintHeader>
          <RoundsContainer>
            <RoundItem active={currentRound === 1}>
              <RoundCheckIcon 
                active={currentRound === 1} 
                status={currentRound > 1 ? 'ended' : currentRound === 1 ? 'active' : 'upcoming'} 
              />
              <RoundContent>
                <RoundTitle>ROUND 1: GTD</RoundTitle>
                <RoundStatus active={currentRound === 1}>
                  {currentRound > 1 ? 'ENDED' : currentRound === 1 ? 'LIVE NOW' : 'UPCOMING'}
                </RoundStatus>
                <RoundProgress active={currentRound === 1} progress={currentRound > 1 ? '100%' : currentRound === 1 ? '100%' : '0%'} />
              </RoundContent>
            </RoundItem>
            <RoundItem active={currentRound === 2}>
              <RoundCheckIcon 
                active={currentRound === 2} 
                status={currentRound > 2 ? 'ended' : currentRound === 2 ? 'active' : 'upcoming'} 
              />
              <RoundContent>
                <RoundTitle>ROUND 2: FCFS</RoundTitle>
                <RoundStatus active={currentRound === 2}>
                  {currentRound > 2 ? 'ENDED' : currentRound === 2 ? 'LIVE NOW' : 'UPCOMING'}
                </RoundStatus>
                <RoundProgress active={currentRound === 2} progress={currentRound > 2 ? '100%' : currentRound === 2 ? '100%' : '0%'} />
              </RoundContent>
            </RoundItem>
            <RoundItem active={currentRound === 3}>
              <RoundCheckIcon 
                active={currentRound === 3} 
                status={currentRound === 3 ? 'active' : 'upcoming'} 
              />
              <RoundContent>
                <RoundTitle>ROUND 3: PUBLIC</RoundTitle>
                <RoundStatus active={currentRound === 3}>
                  {currentRound === 3 ? 'LIVE NOW' : 'UPCOMING'}
                </RoundStatus>
                <RoundProgress active={currentRound === 3} progress={currentRound === 3 ? '100%' : '0%'} />
              </RoundContent>
            </RoundItem>
          </RoundsContainer>
          <MintBoxWrapper>
            <TiltedBox flex="1" bg="linear-gradient(135deg, rgba(8, 14, 30, 0.98) 0%, rgba(15, 23, 45, 0.98) 100%)">
              {/* Blur Overlay with Pre-Round Countdown - Only when waiting for GTD to start */}
              {currentRound === 0 && (
                <BlurOverlay>
                  {!showWhitelistChecker ? (
                    <PreRoundCountdown>
                      <div className="countdown-label">GTD PHASE STARTS IN</div>
                      <div className="countdown-timer">
                        {roundCountdown.days > 0 && (
                          <>
                            <CountdownItem>
                              <div className="number">{String(roundCountdown.days).padStart(2, '0')}</div>
                              <div className="label">Days</div>
                            </CountdownItem>
                            <CountdownSeparator>:</CountdownSeparator>
                          </>
                        )}
                        <CountdownItem>
                          <div className="number">{String(roundCountdown.hours).padStart(2, '0')}</div>
                          <div className="label">Hours</div>
                        </CountdownItem>
                        <CountdownSeparator>:</CountdownSeparator>
                        <CountdownItem>
                          <div className="number">{String(roundCountdown.minutes).padStart(2, '0')}</div>
                          <div className="label">Minutes</div>
                        </CountdownItem>
                        <CountdownSeparator>:</CountdownSeparator>
                        <CountdownItem>
                          <div className="number">{String(roundCountdown.seconds).padStart(2, '0')}</div>
                          <div className="label">Seconds</div>
                        </CountdownItem>
                      </div>
                      <WhitelistCheckButton onClick={() => setShowWhitelistChecker(true)}>
                        Check Whitelist Status
                      </WhitelistCheckButton>
                    </PreRoundCountdown>
                  ) : (
                    <WhitelistChecker 
                      show={showWhitelistChecker} 
                      onClose={() => setShowWhitelistChecker(false)}
                    />
                  )}
                </BlurOverlay>
              )}

          <s.Container
            jc={"center"}
            ai={"center"}
            style={{
              width: "100%",
            }}
          >
            {/* Eligibility Badge - Show when wallet connected and round is active (but not in PUBLIC round) */}
            {blockchain.account !== "" && blockchain.smartContract !== null && currentRound > 0 && currentRound !== 3 && !(Number(data.totalSupply) >= CONFIG.MAX_SUPPLY) && (
              <EligibilityBadge>
                <div className="checkmark"></div>
                <div className="message">
                  You are eligible to mint in this phase
                </div>
              </EligibilityBadge>
            )}

            {/* Modern Badge Style Info */}
            <InfoBadgesContainer>
              {!(Number(data.totalSupply) >= CONFIG.MAX_SUPPLY) && (
                <InfoBadge>
                  <div className="badge-header">
                    <IconSVG viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                    </IconSVG>
                    <span className="label">PRICE</span>
                  </div>
                  <span className="value">{currentRound === 3 ? '0.012' : CONFIG.DISPLAY_COST} ETH</span>
                </InfoBadge>
              )}
              
              {isLive &&
                !(blockchain.account === "" || blockchain.smartContract === null) &&
                !(Number(data.totalSupply) >= CONFIG.MAX_SUPPLY) && (
                  <InfoBadge>
                    <div className="badge-header">
                      <IconSVG viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                      </IconSVG>
                      <span className="label">MINTED</span>
                    </div>
                    <span className="value">
                      {data.totalSupply > 0
                        ? `${data.totalSupply} / ${CONFIG.MAX_SUPPLY}`
                        : `0 / ${CONFIG.MAX_SUPPLY}`}
                    </span>
                  </InfoBadge>
                )}
              
              {(!isLive ||
                blockchain.account === "" ||
                blockchain.smartContract === null) && (
                  <InfoBadge>
                    <div className="badge-header">
                      <IconSVG viewBox="0 0 24 24">
                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                      </IconSVG>
                      <span className="label">SUPPLY</span>
                    </div>
                    <span className="value">1111</span>
                  </InfoBadge>
                )}
              
              {/* Max Mint Badge */}
              {(blockchain.account !== "" && blockchain.smartContract !== null) && !(Number(data.totalSupply) >= CONFIG.MAX_SUPPLY) && (
                <InfoBadge>
                  <div className="badge-header">
                    <IconSVG viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </IconSVG>
                    <span className="label">MAX MINT</span>
                  </div>
                  <span className="value">
                    {currentRound === 0 ? '3' : currentRound === 1 ? '3' : currentRound === 2 ? '5' : '10'}
                  </span>
                </InfoBadge>
              )}
            </InfoBadgesContainer>

            {/* Round Countdown - Only show when wallet is connected, round started, and not in PUBLIC round */}
            {blockchain.account !== "" && blockchain.smartContract !== null && currentRound > 0 && currentRound !== 3 && !(Number(data.totalSupply) >= CONFIG.MAX_SUPPLY) && (
              <MintCountdown>
                <CountdownLabel>
                  {(() => {
                    const phaseNames = { 1: 'GTD PHASE', 2: 'FCFS PHASE', 3: 'PUBLIC PHASE' };
                    const targetPhase = roundCountdown.isWaitingForStart ? roundCountdown.targetRound : roundCountdown.targetRound;
                    return roundCountdown.isWaitingForStart 
                      ? `${phaseNames[targetPhase]} STARTS IN`
                      : `${phaseNames[currentRound]} ENDS IN`;
                  })()}
                </CountdownLabel>
                <CountdownTimerRow>
                  {roundCountdown.days > 0 && (
                    <>
                      <CountdownItem>
                        <div className="number">{String(roundCountdown.days).padStart(2, '0')}</div>
                        <div className="label">Days</div>
                      </CountdownItem>
                      <CountdownSeparator>:</CountdownSeparator>
                    </>
                  )}
                  <CountdownItem>
                    <div className="number">{String(roundCountdown.hours).padStart(2, '0')}</div>
                    <div className="label">Hours</div>
                  </CountdownItem>
                  <CountdownSeparator>:</CountdownSeparator>
                  <CountdownItem>
                    <div className="number">{String(roundCountdown.minutes).padStart(2, '0')}</div>
                    <div className="label">Minutes</div>
                  </CountdownItem>
                  <CountdownSeparator>:</CountdownSeparator>
                  <CountdownItem>
                    <div className="number">{String(roundCountdown.seconds).padStart(2, '0')}</div>
                    <div className="label">Seconds</div>
                  </CountdownItem>
                </CountdownTimerRow>
              </MintCountdown>
            )}

            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{
                    textAlign: "center",
                    color: "#00d4ff",
                    fontSize: "60px",
                    fontWeight: "900",
                    letterSpacing: "10px",
                    textShadow: "0 0 40px rgba(0, 150, 255, 1), 0 0 80px rgba(0, 212, 255, 0.8)",
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
                            color: "#ff0000",
                            fontWeight: "bold",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <AmountSection>
                      <AmountLabel>AMOUNT</AmountLabel>
                      <AmountControls>
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
                      </AmountControls>
                    </AmountSection>
                    <s.SpacerSmall />
                    {feedback && (
                      <s.TextDescription
                        id="feedback"
                        style={{
                          textAlign: "center",
                          color: "#00ffff",
                          border: "2px solid rgba(0, 150, 255, 0.8)",
                          background: "linear-gradient(135deg, rgba(10, 17, 40, 0.95) 0%, rgba(20, 30, 70, 0.95) 100%)",
                          boxShadow: "0 0 15px rgba(0, 150, 255, 0.3), inset 0 0 15px rgba(0, 150, 255, 0.05)",
                          borderRadius: "15px",
                          padding: "12px 16px",
                          fontFamily: "Font3",
                          fontWeight: "bold",
                          fontSize: "15px",
                          marginBottom: "20px",
                          textShadow: "0 0 10px rgba(0, 255, 255, 0.6)",
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
            </TiltedBox>
            <InfoBox>
              <InfoTitle style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 1))' }}>
                Fixed USDC Yield Protocol
              </InfoTitle>
              <Divider />

              <InfoSubtitle style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconSVG viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                  <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                </IconSVG>
                EXECUTIVE SUMMARY
              </InfoSubtitle>
              <InfoList>
                <li><strong>Model:</strong> Decentralized Infrastructure Provisioning (DIP)</li>
                <li><strong>Settlement Asset:</strong> Iridium Data (1 IRIDIUM = 1 USDC)</li>
                <li><strong>Standard Monthly Node Output:</strong> 6–24 Iridium (6–24 USDC) Per Node NFT (Scalable up to 48 Iridium (48 USDC) via Efficiency Protocols)</li>
                <li><strong>Operation:</strong> Autonomous. Active data uplink is maintained via on-chain asset validation; no manual operation required.</li>
                <li><strong>Settlement Cycle:</strong> Automated Weekly (Wednesdays). Balances &gt;$3 are strictly settled to the Node-holding wallet.</li>
                <li><strong>Funding Source:</strong> MindForge Treasury Budget</li>
              </InfoList>

              <Divider />

              <InfoSubtitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconSVG viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </IconSVG>
                HARDWARE CAPACITY
              </InfoSubtitle>
              <InfoText style={{ fontSize: '12px', marginBottom: '8px' }}>
                (Monthly Operational Throughput)
              </InfoText>
              <InfoText style={{ fontSize: '12px', marginBottom: '15px' }}>
                Upon Mint, the protocol assigns a specific Node Class via cryptographic distribution. Values below indicate: [Standard Output] ➔ [Maximum Optimized Output]
              </InfoText>

              <NodeBadge bg="rgba(150, 50, 255, 0.2)" border="rgba(180, 100, 255, 0.6)" glow="rgba(150, 50, 255, 0.4)">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <IconSVG viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: '#9664ff' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </IconSVG>
                  <span>SINGULARITY (Mythic) 🚀</span>
                </div>
                <strong>Throughput:</strong> 24 ➔ 48 Iridium ($24 — $48 USDC monthly)
              </NodeBadge>

              <NodeBadge bg="rgba(0, 255, 100, 0.2)" border="rgba(0, 255, 120, 0.6)" glow="rgba(0, 255, 100, 0.4)">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <IconSVG viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: '#00ff88' }}>
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                  </IconSVG>
                  <span>PLASMA RELAY (Legendary) 🔥</span>
                </div>
                <strong>Throughput:</strong> 20 ➔ 40 Iridium ($20 — $40 USDC monthly)
              </NodeBadge>

              <NodeBadge bg="rgba(0, 220, 220, 0.2)" border="rgba(0, 240, 240, 0.6)" glow="rgba(0, 220, 220, 0.4)">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <IconSVG viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: '#00e0e0' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  </IconSVG>
                  <span>VOID RELAY (Epic) 🔮</span>
                </div>
                <strong>Throughput:</strong> 16 ➔ 32 Iridium ($16 — $32 USDC monthly)
              </NodeBadge>

              <NodeBadge bg="rgba(255, 100, 200, 0.2)" border="rgba(255, 120, 220, 0.6)" glow="rgba(255, 100, 200, 0.4)">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <IconSVG viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: '#ff80d0' }}>
                    <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
                  </IconSVG>
                  <span>SOLAR (Rare) ⚡</span>
                </div>
                <strong>Throughput:</strong> 12 ➔ 24 Iridium ($12 — $24 USDC monthly)
              </NodeBadge>

              <NodeBadge bg="rgba(50, 150, 255, 0.2)" border="rgba(80, 180, 255, 0.6)" glow="rgba(50, 150, 255, 0.4)">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <IconSVG viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: '#5096ff' }}>
                    <path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-1.45-1.1-3.55-1.5-5.5-1.5zM21 18.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                  </IconSVG>
                  <span>ISOTOPE (Uncommon) ☢️</span>
                </div>
                <strong>Throughput:</strong> 9 ➔ 18 Iridium ($9 — $18 USDC monthly)
              </NodeBadge>

              <NodeBadge bg="rgba(255, 220, 0, 0.2)" border="rgba(255, 230, 50, 0.6)" glow="rgba(255, 220, 0, 0.4)">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <IconSVG viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: '#ffe632' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </IconSVG>
                  <span>NANO (Common) 💾</span>
                </div>
                <strong>Throughput:</strong> 6 ➔ 12 Iridium ($6 — $12 USDC monthly)
              </NodeBadge>

              <InfoText style={{ fontSize: '12px', marginTop: '15px', color: '#ffc800', fontWeight: '600' }}>
                ⚠️ PERFORMANCE NOTE: Operators can amplify their Standard Output up to 2x by activating the protocols listed in the 'LOYALTY & EFFICIENCY' section.
              </InfoText>

              <InfoText style={{ fontSize: '11px', marginTop: '10px', fontStyle: 'italic', opacity: '0.85' }}>
                ✏️ Note: Iridium Data represents a validated service receipt, settled by the Treasury at a fixed contract rate of 1 USDC.
              </InfoText>

              <Divider />

              <InfoSubtitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconSVG viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                  <path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm0-13C6.48 2.5 2 6.98 2 12.5S6.48 22.5 12 22.5s10-4.48 10-10S17.52 2.5 12 2.5zM12 21c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </IconSVG>
                SYSTEM LOGIC
              </InfoSubtitle>
              <InfoText style={{ marginBottom: '12px' }}>
                (Operational Framework)
              </InfoText>
              <InfoText style={{ marginBottom: '15px' }}>
                This system is a B2B Service Agreement in exchange for the technical support you provide to the Dominion infrastructure.
              </InfoText>
              <InfoList>
                <li><strong>1. COMPUTATION (Autonomous Uplink)</strong> The Node processes mathematical universe data in the background. Your wallet custody serves as the "Active License," validating the connection without requiring manual intervention.</li>
                <li><strong>2. PROCUREMENT</strong> The MindForge Treasury issues a Service Receipt (Iridium) in exchange for the validated processing power provided by your Node.</li>
                <li><strong>3. REWARD STABILITY</strong> Revenue is decoupled from market volatility. Compensation is governed by the Fixed Contract Rate: 1 Iridium is universally settled as 1 USDC.</li>
                <li><strong>4. SETTLEMENT PROTOCOL (Automated)</strong>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    <li>Cycle: Weekly (Every Wednesday).</li>
                    <li>Trigger: Accumulated balances exceeding 3 Iridium ($3) are automatically converted and remitted to the Operator's wallet.</li>
                  </ul>
                </li>
              </InfoList>

              <Divider />

              <InfoSubtitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconSVG viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </IconSVG>
                LOYALTY & EFFICIENCY PROTOCOLS
              </InfoSubtitle>
              <InfoText style={{ marginBottom: '15px' }}>
                Maximize operational throughput by maintaining network stability and optimizing hardware clusters. Bonuses are simultaneous.
              </InfoText>
              <InfoText>
                <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <IconSVG viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </IconSVG>
                  Signal Stability (Uptime Bonus)
                </strong>
              </InfoText>
              <InfoText style={{ marginBottom: '10px', fontSize: '13px' }}>
                Efficiency increases based on continuous custody duration in the same wallet:
              </InfoText>
              <InfoList>
                <li>7 Days: +5% Efficiency</li>
                <li>15 Days: +10% Efficiency</li>
                <li>20 Days: +15% Efficiency</li>
                <li>30+ Days: +20% Efficiency (Max)</li>
              </InfoList>

              <InfoText style={{ marginTop: '20px' }}>
                <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <IconSVG viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                  </IconSVG>
                  Hexa-Link (Cluster Bonus)
                </strong>
              </InfoText>
              <InfoList style={{ marginTop: '10px' }}>
                <li><strong>Requirement:</strong> Every complete set of 6 distinct hardware classes (Common to Mythic).</li>
                <li><strong>Reward:</strong> +10% Output Boost per completed set.</li>
                <li><strong>Scalability:</strong> Stackable Module. (e.g., 5 Complete Sets = +50% Boost).</li>
              </InfoList>
            </InfoBox>
          </MintBoxWrapper>
        </ResponsiveWrapper>
      </s.Container>
    </s.Screen>
  );
}

export default App;
