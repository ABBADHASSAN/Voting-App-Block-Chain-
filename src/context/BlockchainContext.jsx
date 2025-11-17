import React, { createContext, useContext, useState, useEffect } from 'react';
import blockchainService from '../services/blockchain';

const BlockchainContext = createContext();

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

export const BlockchainProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [electionState, setElectionState] = useState(0); // 0: NotStarted, 1: Started, 2: Ended
  const [electionStats, setElectionStats] = useState({
    totalCandidates: 0,
    totalVoters: 0,
    totalVotes: 0,
    startTime: 0,
    endTime: 0,
  });
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize blockchain connection
  useEffect(() => {
    const initializeBlockchain = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const connected = await blockchainService.connectWallet();
            if (connected) {
              setIsConnected(true);
              setAccount(blockchainService.getCurrentAccount());
              await loadElectionData();
            }
          }
        }
      } catch (error) {
        console.error('Error initializing blockchain:', error);
      }
    };

    initializeBlockchain();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      handleDisconnect();
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const connected = await blockchainService.connectWallet();
      if (connected) {
        setIsConnected(true);
        setAccount(blockchainService.getCurrentAccount());
        await loadElectionData();
        return true;
      }
      return false;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    blockchainService.disconnect();
    setIsConnected(false);
    setAccount(null);
    setElectionState(0);
    setElectionStats({
      totalCandidates: 0,
      totalVoters: 0,
      totalVotes: 0,
      startTime: 0,
      endTime: 0,
    });
    setCandidates([]);
  };

  const loadElectionData = async () => {
    try {
      setLoading(true);
      
      // Load election state
      const state = await blockchainService.getElectionState();
      setElectionState(state);
      
      // Load election stats
      const stats = await blockchainService.getElectionStats();
      setElectionStats(stats);
      
      // Load candidates
      if (state >= 1) { // Started or later
        const candidatesData = await blockchainService.getAllCandidates();
        setCandidates(candidatesData);
      }
    } catch (error) {
      console.error('Error loading election data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (isConnected) {
      await loadElectionData();
    }
  };

  const startElection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await blockchainService.startElection();
      await loadElectionData();
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const endElection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await blockchainService.endElection();
      await loadElectionData();
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerVoter = async (name, cnic, city) => {
    try {
      setLoading(true);
      setError(null);
      
      await blockchainService.registerVoter(name, Number(cnic), city);
      await loadElectionData();
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = async (name, party, cnic, city) => {
    try {
      setLoading(true);
      setError(null);
      
      await blockchainService.addCandidate(name, party, Number(cnic), city);
      await loadElectionData();
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (candidateId, voterCNIC) => {
    try {
      setLoading(true);
      setError(null);
      
      await blockchainService.castVote(candidateId, voterCNIC);
      await loadElectionData();
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getWinner = async () => {
    try {
      return await blockchainService.getWinner();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    isConnected,
    account,
    electionState,
    electionStats,
    candidates,
    loading,
    error,
    
    // Actions
    connectWallet,
    handleDisconnect,
    refreshData,
    startElection,
    endElection,
    registerVoter,
    addCandidate,
    castVote,
    getWinner,
    clearError,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export default BlockchainContext;
