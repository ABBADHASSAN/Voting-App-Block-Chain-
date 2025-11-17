import React from 'react';
import Link from "next/link";
import { useBlockchain } from '../context/BlockchainContext';
import MetaMaskConnect from './MetaMaskConnect';
import './Header.css';

function Header() {
  const { isConnected, account } = useBlockchain();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          <div className="brand-section">
            <h1 className="brand">Welcome to the Voting Portal</h1>
            <p className="tagline">Have your say. Make your vote count.</p>
          </div>
          <nav className="header-nav">
            <Link href="/admin" className="admin-link">
              ⚙️ Admin Panel
            </Link>
          </nav>
          <div className="wallet-section">
            {isConnected ? (
              <div className="wallet-connected">
                <div className="wallet-info">
                  <span className="wallet-status">🟢 Connected</span>
                  <span className="wallet-address">{formatAddress(account)}</span>
                </div>
              </div>
            ) : (
              <div className="wallet-disconnected">
                <span className="wallet-status">🔴 Not Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

