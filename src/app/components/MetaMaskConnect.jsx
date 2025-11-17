import React, { useState, useEffect } from 'react';
import blockchainService from '../services/blockchain';
import './MetaMaskConnect.css';

const MetaMaskConnect = ({ onConnect, onDisconnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    const checkMetaMask = () => {
      if (typeof window.ethereum !== 'undefined') {
        setIsMetaMaskInstalled(true);
        // Check if already connected
        checkConnection();
      } else {
        setIsMetaMaskInstalled(false);
      }
    };

    // Check current connection status
    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          if (onConnect) onConnect(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkMetaMask();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          handleDisconnect();
        } else {
          setAccount(accounts[0]);
          if (onConnect) onConnect(accounts[0]);
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [onConnect]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const connected = await blockchainService.connectWallet();
      
      if (connected) {
        const currentAccount = blockchainService.getCurrentAccount();
        setAccount(currentAccount);
        setIsConnected(true);
        if (onConnect) onConnect(currentAccount);
      }
    } catch (error) {
      console.error('Connection error:', error);
      setError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    blockchainService.disconnect();
    setAccount(null);
    setIsConnected(false);
    if (onDisconnect) onDisconnect();
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="metamask-container">
        <div className="metamask-card">
          <div className="metamask-icon">🦊</div>
          <h3>MetaMask Required</h3>
          <p>To use this voting application, you need to install MetaMask browser extension.</p>
          <button className="install-button" onClick={installMetaMask}>
            Install MetaMask
          </button>
        </div>
      </div>
    );
  }

  if (isConnected && account) {
    return (
      <div className="metamask-container">
        <div className="metamask-card connected">
          <div className="metamask-icon">🦊</div>
          <div className="account-info">
            <h3>Connected to MetaMask</h3>
            <p className="account-address">{formatAddress(account)}</p>
            <div className="network-info">
              <span className="network-badge">Polygon Amoy</span>
            </div>
          </div>
          <button className="disconnect-button" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="metamask-container">
      <div className="metamask-card">
        <div className="metamask-icon">🦊</div>
        <h3>Connect to MetaMask</h3>
        <p>Connect your MetaMask wallet to participate in the voting process.</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <button 
          className="connect-button" 
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
        
        <div className="network-info">
          <p>Make sure you're connected to Polygon Amoy Testnet</p>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskConnect;
