import React, { useState, useEffect } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import './OverallTurnout.css';

function OverallTurnout() {
  const { electionStats, candidates, loading: blockchainLoading, error: blockchainError } = useBlockchain();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(blockchainLoading);
    setError(blockchainError);
  }, [blockchainLoading, blockchainError]);

  // Calculate statistics from blockchain data
  const calculateStats = () => {
    if (!candidates.length || !electionStats) return null;

    // Calculate party-wise statistics
    const partyStats = {};
    candidates.forEach(candidate => {
      if (!partyStats[candidate.party]) {
        partyStats[candidate.party] = {
          party: candidate.party,
          totalVotes: 0,
          candidates: 0
        };
      }
      partyStats[candidate.party].totalVotes += candidate.voteCount;
      partyStats[candidate.party].candidates += 1;
    });

    // Convert to array and calculate percentages
    const partyWiseStats = Object.values(partyStats).map(party => ({
      ...party,
      percentage: electionStats.totalVotes > 0 
        ? ((party.totalVotes / electionStats.totalVotes) * 100).toFixed(1)
        : 0
    }));

    // Calculate city-wise statistics
    const cityStats = {};
    candidates.forEach(candidate => {
      if (!cityStats[candidate.city]) {
        cityStats[candidate.city] = {
          area: candidate.city,
          totalVotes: 0,
          candidates: 0
        };
      }
      cityStats[candidate.city].totalVotes += candidate.voteCount;
      cityStats[candidate.city].candidates += 1;
    });

    // Get top performing areas
    const topPerformingAreas = Object.values(cityStats)
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, 5)
      .map(area => ({
        ...area,
        turnout: electionStats.totalVoters > 0 
          ? ((area.totalVotes / electionStats.totalVoters) * 100).toFixed(1)
          : 0
      }));

    return {
      totalRegisteredVoters: electionStats.totalVoters,
      totalVotesCast: electionStats.totalVotes,
      overallTurnout: electionStats.totalVoters > 0 
        ? ((electionStats.totalVotes / electionStats.totalVoters) * 100).toFixed(1)
        : 0,
      totalCandidates: electionStats.totalCandidates,
      totalAreas: Object.keys(cityStats).length,
      topPerformingAreas,
      partyWiseStats,
      lastUpdated: new Date().toLocaleString()
    };
  };

  const overallStats = calculateStats();

  const getTurnoutColor = (turnout) => {
    if (turnout >= 70) return '#27ae60';
    if (turnout >= 50) return '#f39c12';
    return '#e74c3c';
  };

  const getTurnoutStatus = (turnout) => {
    if (turnout >= 70) return 'Excellent';
    if (turnout >= 50) return 'Good';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <main className="overall-turnout">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading overall statistics...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="overall-turnout">
        <div className="container">
          <div className="error-state">
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!overallStats) {
    return (
      <main className="overall-turnout">
        <div className="container">
          <div className="no-data-state">
            <p>No election data available yet.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="overall-turnout">
      <div className="container">
        <h1>Overall Turnout Statistics</h1>
        
        <div className="stats-overview">
          <div className="overview-card">
            <div className="overview-header">
              <h2>Election Overview</h2>
              <p className="last-updated">Last updated: {overallStats.lastUpdated}</p>
            </div>

            <div className="main-stats">
              <div className="stat-card primary">
                <div className="stat-icon">🗳️</div>
                <div className="stat-content">
                  <span className="stat-label">Total Votes Cast</span>
                  <span className="stat-value">{overallStats.totalVotesCast.toLocaleString()}</span>
                  <span className="stat-subtitle">out of {overallStats.totalRegisteredVoters.toLocaleString()} registered</span>
                </div>
              </div>

              <div className="stat-card secondary">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <span className="stat-label">Overall Turnout</span>
                  <span className="stat-value">{overallStats.overallTurnout}%</span>
                  <span className={`stat-status ${getTurnoutStatus(overallStats.overallTurnout).toLowerCase().replace(' ', '-')}`}>
                    {getTurnoutStatus(overallStats.overallTurnout)}
                  </span>
                </div>
              </div>

              <div className="stat-card tertiary">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <span className="stat-label">Total Candidates</span>
                  <span className="stat-value">{overallStats.totalCandidates}</span>
                  <span className="stat-subtitle">across {overallStats.totalAreas} areas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="charts-grid">
            {/* Party-wise Statistics */}
            <div className="chart-card">
              <h3>Party-wise Performance</h3>
              <div className="party-stats">
                {overallStats.partyWiseStats.map((party, index) => (
                  <div key={index} className="party-item">
                    <div className="party-info">
                      <span className="party-name">{party.party}</span>
                      <span className="party-votes">{party.totalVotes.toLocaleString()} votes</span>
                    </div>
                    <div className="party-progress">
                      <div 
                        className="progress-bar"
                        style={{ 
                          width: `${party.percentage}%`,
                          backgroundColor: `hsl(${index * 80}, 70%, 50%)`
                        }}
                      ></div>
                      <span className="party-percentage">{party.percentage}%</span>
                    </div>
                    <div className="party-areas">Won {party.areasWon} areas</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Election Summary */}
            <div className="chart-card">
              <h3>Election Summary</h3>
              <div className="summary-info">
                <p>This election has {overallStats.totalCandidates} candidates across {overallStats.totalAreas} areas.</p>
                <p>Total registered voters: {overallStats.totalRegisteredVoters.toLocaleString()}</p>
                <p>Total votes cast: {overallStats.totalVotesCast.toLocaleString()}</p>
                <p>Overall turnout: {overallStats.overallTurnout}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Areas */}
        <div className="areas-section">
          <div className="areas-card">
            <h3>Top Performing Areas</h3>
            <div className="areas-list">
              {overallStats.topPerformingAreas.map((area, index) => (
                <div key={index} className="area-item">
                  <div className="area-rank">#{index + 1}</div>
                  <div className="area-details">
                    <div className="area-name">{area.area}</div>
                    <div className="area-votes">{area.totalVotes.toLocaleString()} total votes</div>
                  </div>
                  <div className="area-turnout">
                    <span 
                      className="turnout-badge"
                      style={{ backgroundColor: getTurnoutColor(area.turnout) }}
                    >
                      {area.turnout}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OverallTurnout;
