import React, { useState, useEffect } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import './Results.css';

function Results() {
  // Line 6: Import everything needed from context
  const { isConnected, candidates, electionStats, getWinner, loading, error, electionState } = useBlockchain();
  const [area, setArea] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (candidates.length > 0 && !area) {
      setFilteredCandidates(candidates);
    }
  }, [candidates, area]);

  const handleAreaSubmit = async (e) => {
    e.preventDefault();
    
    if (!area.trim()) {
      setLocalError('Please enter an area or city name');
      return;
    }

    setLocalError('');
    
    // Filter candidates by city/area
    const filtered = candidates.filter(candidate => 
      candidate.city.toLowerCase().includes(area.toLowerCase())
    );
    
    if (filtered.length === 0) {
      setLocalError('No candidates found for this area');
      return;
    }
    
    setFilteredCandidates(filtered);
  };

  // ❌ DELETE THIS SECTION (lines 40-45 in original)
  // const getWinner = () => {
  //   if (!results || !results.candidates.length) return null;
  //   return results.candidates.reduce((prev, current) => 
  //     prev.votes > current.votes ? prev : current
  //   );
  // };

  // State for winner data
  const [winner, setWinner] = useState(null);
  
  // Load winner data only when election is ended (state 2)
  useEffect(() => {
    const loadWinner = async () => {
      if (electionState === 2 && electionStats.totalVotes > 0) {
        try {
          const winnerData = await getWinner();
          setWinner(winnerData);
        } catch (error) {
          console.error('Error loading winner:', error);
        }
      }
    };
    
    loadWinner();
  }, [electionState, electionStats.totalVotes, getWinner]);

  // Show election state messages
  if (electionState === 0) {
    return (
      <main className="results">
        <div className="container">
          <h1>Check Results</h1>
          <div className="election-status">
            <div className="form-card">
              <h2>Election Not Started</h2>
              <p>The election has not started yet. Results will be available after the election begins.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (electionState === 1) {
    return (
      <main className="results">
        <div className="container">
          <h1>Check Results</h1>
          <div className="election-status">
            <div className="form-card">
              <h2>Election in Progress</h2>
              <p>The election is currently active. Results will be available after the election ends.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="results">
      <div className="container">
        <h1>Check Results</h1>
        
        <div className="search-section">
          <div className="search-card">
            <h2>Enter Area/City</h2>
            <p>Enter the area or city name to view election results.</p>
            
            <form onSubmit={handleAreaSubmit} className="area-form">
              <div className="input-group">
                <label htmlFor="area">Area/City Name:</label>
                <input
                  type="text"
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g., Karachi, Lahore, Islamabad"
                  required
                />
              </div>
              
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Loading...' : 'Get Results'}
              </button>
            </form>
            
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>

        {filteredCandidates.length > 0 && (
          <div className="results-section">
            <div className="results-card">
              <div className="results-header">
                <h2>Results {area ? `for ${area}` : 'Overall'}</h2>
                <p className="last-updated">Last updated: {new Date().toLocaleString()}</p>
              </div>

              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Votes</span>
                  <span className="stat-value">{electionStats.totalVotes.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Candidates</span>
                  <span className="stat-value">{filteredCandidates.length}</span>
                </div>
              </div>

              {winner && (
                <div className="winner-card">
                  <h3>🏆 Winner</h3>
                  <div className="winner-info">
                    <span className="winner-name">{winner.name}</span>
                    <span className="winner-votes">{winner.votes.toLocaleString()} votes</span>
                  </div>
                </div>
              )}

              <div className="candidates-results">
                <h3>All Candidates</h3>
                <div className="results-list">
                  {filteredCandidates
                    .sort((a, b) => b.voteCount - a.voteCount)
                    .map((candidate, index) => {
                      const percentage = electionStats.totalVotes > 0 
                        ? ((candidate.voteCount / electionStats.totalVotes) * 100).toFixed(1)
                        : 0;
                      
                      return (
                        <div key={candidate.id} className={`result-item ${index === 0 ? 'winner' : ''}`}>
                          <div className="rank">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </div>
                          <div className="candidate-details">
                            <div className="candidate-name">{candidate.name}</div>
                            <div className="candidate-party">{candidate.party}</div>
                            <div className="candidate-city">{candidate.city}</div>
                          </div>
                          <div className="vote-details">
                            <div className="vote-count">{candidate.voteCount.toLocaleString()}</div>
                            <div className="vote-percentage">{percentage}%</div>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Results;