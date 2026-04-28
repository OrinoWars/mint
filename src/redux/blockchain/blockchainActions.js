// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const isMobile = () => {
  return /Mobi|Android|iPhone/i.test(navigator.userAgent);
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = (provider = null) => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();
    const ethereum = provider || window.ethereum;
    const walletIsAvailable = !!ethereum;
    if (walletIsAvailable) {
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        const finalizeConnection = (acc) => {
          let SmartContractObj = null;
          try {
            if (CONFIG.CONTRACT_ADDRESS) {
              SmartContractObj = new Web3EthContract(abi, CONFIG.CONTRACT_ADDRESS);
            }
          } catch (e) {
            SmartContractObj = null;
          }
          dispatch(
            connectSuccess({
              account: acc,
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        };

        if (networkId == CONFIG.NETWORK.ID) {
          finalizeConnection(accounts[0]);
        } else {
          // Wrong network — try to switch automatically
          try {
            const chainHex = "0x" + parseInt(CONFIG.NETWORK.ID).toString(16);
            await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: chainHex }],
            });
            // Wait for any pending chainChanged events fired by the switch
            // to settle before adding the reload listener, otherwise the
            // switch itself triggers a page reload immediately after connect.
            await new Promise((resolve) => setTimeout(resolve, 300));
            // Re-fetch accounts in case wallet updated them during the switch
            const freshAccounts = await ethereum.request({ method: "eth_accounts" });
            const finalAccount = (freshAccounts && freshAccounts[0]) || accounts[0];
            if (!finalAccount) {
              dispatch(connectFailed("No account found after network switch."));
              return;
            }
            finalizeConnection(finalAccount);
          } catch (switchErr) {
            dispatch(connectFailed(`Please switch your wallet to ${CONFIG.NETWORK.NAME}.`));
          }
        }
      } catch (err) {
        if (err.code === 4001) {
          dispatch(connectFailed("Connection rejected."));
        } else if (err.code === -32002) {
          dispatch(connectFailed("MetaMask is busy — open your wallet and approve the pending request."));
        } else {
          dispatch(connectFailed(err?.message || "Something went wrong."));
        }
      }
    } else {
      if(isMobile()){
        dispatch(connectFailed("Please open this page in your wallet's browser."));
      }
      else{
        dispatch(connectFailed("Please install a Web3 wallet (MetaMask, Phantom, etc.)"));
      }
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
