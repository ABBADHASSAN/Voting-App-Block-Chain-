import React from 'react';
import Link from 'next/link'; // ✅ Next.js Link (default import)
import { useBlockchain } from '../context/BlockchainContext';
import MetaMaskConnect from './MetaMaskConnect';
import './Home.css';

function Home() {
  const { isConnected, electionState, electionStats } = useBlockchain();

  const getElectionStatusText = () => {
    switch (electionState) {
      case 0: return { text: 'Election Not Started', color: '#ff6b6b' };
      case 1: return { text: 'Election Started', color: '#48dbfb' };
      case 2: return { text: 'Election Ended', color: '#ff9ff3' };
      default: return { text: 'Unknown Status', color: '#a4b0be' };
    }
  };

  const status = getElectionStatusText();

  return (
    <main className="home">
      <div className="container">
        {!isConnected ? (
          <div className="connection-section">
            <h2>Connect Your Wallet</h2>
            <p>Connect your MetaMask wallet to access the voting portal</p>
            <MetaMaskConnect />
          </div>
        ) : (
          <>
            <div className="election-status">
              <div className="status-card">
                <h2>Election Status</h2>
                <div className="status-info">
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: status.color }}
                  >
                    {status.text}
                  </span>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-value">{electionStats.totalCandidates}</span>
                      <span className="stat-label">Candidates</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{electionStats.totalVoters}</span>
                      <span className="stat-label">Registered Voters</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{electionStats.totalVotes}</span>
                      <span className="stat-label">Votes Cast</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="cta-grid">
              <Link href="/cast-vote" className="cta-card primary">
                <div>
                  <h2>Cast Vote</h2>
                  <p>Proceed to vote for your preferred candidates.</p>
                </div>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>

              {electionState === 2 ? (
                <Link href="/results" className="cta-card">
                  <div>
                    <h3>Check Results</h3>
                    <p>View final results and winner.</p>
                  </div>
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              ) : (
                <div className="cta-card disabled">
                  <div>
                    <h3>Check Results</h3>
                    <p>Results will be available after the election ends.</p>
                  </div>
                  <span className="arrow" aria-hidden="true">→</span>
                </div>
              )}

              <Link href="/turnout" className="cta-card">
                <div>
                  <h3>Overall Turnout</h3>
                  <p>See participation rates across the election.</p>
                </div>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default Home;


