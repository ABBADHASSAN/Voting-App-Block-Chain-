import React, { useState, useEffect } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import './CastVote.css';

function CastVote() {
  const {
    isConnected,
    electionState,
    candidates,
    loading,
    error,
    castVote,
    clearError,
  } = useBlockchain();

  const [cnic, setCnic] = useState('');
  const [localError, setLocalError] = useState('');
  const [showCandidates, setShowCandidates] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);

  useEffect(() => {
    // Clear errors when component mounts
    clearError();
  }, [clearError]);

  const handleCnicSubmit = async (e) => {
    e.preventDefault();
    
    if (!cnic.trim()) {
      setLocalError('Please enter a valid CNIC number');
      return;
    }

    // Basic CNIC validation (Pakistani CNIC format: 12345-1234567-1)
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(cnic)) {
      setLocalError('Please enter CNIC in format: 12345-1234567-1');
      return;
    }

    setLocalError('');
    setShowCandidates(true);
  };

  const handleVote = async (candidateId) => {
    try {
      setLocalError('');
      setVoteSuccess(false);
      
      // Convert CNIC to number (remove dashes)
      const cnicNumber = parseInt(cnic.replace(/-/g, ''));
      
      await castVote(candidateId, cnicNumber);
      setVoteSuccess(true);
      
      // Reset form after successful vote
      setTimeout(() => {
        setShowCandidates(false);
        setCnic('');
        setVoteSuccess(false);
      }, 3000);
    } catch (error) {
      setLocalError(error.message);
    }
  };

  // Show connection required message if not connected
  if (!isConnected) {
    return (
      <main className="cast-vote">
        <div className="container">
          <h1>Cast Your Vote</h1>
          <div className="connection-required">
            <div className="form-card">
              <h2>MetaMask Connection Required</h2>
              <p>Please connect your MetaMask wallet to participate in voting.</p>
              <div className="metamask-icon">🦊</div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show election state messages
  if (electionState === 0) {
    return (
      <main className="cast-vote">
        <div className="container">
          <h1>Cast Your Vote</h1>
          <div className="election-status">
            <div className="form-card">
              <h2>Election Not Started</h2>
              <p>The election has not started yet. Please wait for the election to begin.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Election state 1 (Started) - allow voting, so continue to main form

  if (electionState === 2) {
    return (
      <main className="cast-vote">
        <div className="container">
          <h1>Cast Your Vote</h1>
          <div className="election-status">
            <div className="form-card">
              <h2>Election Ended</h2>
              <p>The election has ended. Please check the results page.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cast-vote">
      <div className="container">
        <h1>Cast Your Vote</h1>
        
        {voteSuccess && (
          <div className="success-message">
            <h3>✅ Vote Cast Successfully!</h3>
            <p>Your vote has been recorded on the blockchain. Thank you for participating!</p>
          </div>
        )}
        
        {!showCandidates ? (
          <div className="cnic-form-section">
            <div className="form-card">
              <h2>Enter Your CNIC</h2>
              <p>Please enter your CNIC number to see the candidates in your area.</p>
              
              <form onSubmit={handleCnicSubmit} className="cnic-form">
                <div className="input-group">
                  <label htmlFor="cnic">CNIC Number:</label>
                  <input
                    type="text"
                    id="cnic"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    placeholder="12345-1234567-1"
                    maxLength="15"
                    required
                  />
                </div>
                
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? 'Loading...' : 'Get Candidates'}
                </button>
              </form>
              
              {(localError || error) && (
                <div className="error-message">{localError || error}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="candidates-section">
            <div className="back-button">
              <button onClick={() => setShowCandidates(false)} className="back-btn">
                ← Change CNIC
              </button>
            </div>
            
            <div className="candidates-card">
              <h2>Candidates in Your Area</h2>
              <p>Select your preferred candidate:</p>
              
              <div className="candidates-grid">
                {candidates.length > 0 ? (
                  candidates.map((candidate) => (
                    <div key={candidate.id} className="candidate-card">
                      <div className="candidate-info">
                        <h3>{candidate.name}</h3>
                        <p className="party">{candidate.party}</p>
                        <p className="city">City: {candidate.city}</p>
                        <p className="votes">Current Votes: {candidate.voteCount}</p>
                      </div>
                      <button 
                        onClick={() => handleVote(candidate.id)}
                        className="vote-btn"
                        disabled={loading}
                      >
                        {loading ? 'Casting...' : 'Vote'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-candidates">
                    <p>No candidates available at the moment.</p>
                  </div>
                )}
              </div>
              
              {(localError || error) && (
                <div className="error-message">{localError || error}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default CastVote;
