// Blockchain Service for Voting App
// Handles Web3 integration and smart contract interactions

import Web3 from 'web3';

// Smart Contract Configuration
const CONTRACT_ADDRESS = '0x5fFC35c1643a54489647ACE9DF54BcA503774d4b';
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "party",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "cnic",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "city",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "CandidateAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "winnerName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalVotes",
				"type": "uint256"
			}
		],
		"name": "ElectionEnded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "total_candidates",
				"type": "uint256"
			}
		],
		"name": "ElectionStarted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "endElection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "cnic",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "city",
				"type": "string"
			}
		],
		"name": "registerVoter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "startElection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "candidateID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "voterCNIC",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "Voted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "voterAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "VoterRegistered",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidateCnics",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidateIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getCandidate",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "voteCount",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "party",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "cnic",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "city",
						"type": "string"
					}
				],
				"internalType": "struct IS.Candidate",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCandidateCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "candidateID",
				"type": "uint256"
			}
		],
		"name": "getVotes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getWinner",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "startTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "state",
		"outputs": [
			{
				"internalType": "enum IS.ElectionState",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalCandidates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalVotersRegistered",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalVotesCasted",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "voterAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Network Configuration
const NETWORK_CONFIG = {
  chainId: '0x13882', // 80002 in hex (Amoy testnet)
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'POL',
    symbol: 'POL',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
};

class BlockchainService {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
    this.isConnected = false;
  }

  // Check if MetaMask is installed
  async checkMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
      return true;
    }
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  // Connect to MetaMask and get account
  async connectWallet() {
    try {
      const isMetaMaskInstalled = await this.checkMetaMask();
      if (!isMetaMaskInstalled) return false;

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }

      this.account = accounts[0];
      this.web3 = new Web3(window.ethereum);
      
      // Initialize contract
      this.contract = new this.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      
      // Check network
      await this.checkNetwork();
      
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  // Check if user is on correct network
async checkNetwork() {
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('Current Chain ID:', chainId);
    console.log('Expected Chain ID:', NETWORK_CONFIG.chainId);
    
    if (chainId !== NETWORK_CONFIG.chainId) {
      console.log('Wrong network! Switching...');
      await this.switchNetwork();
    } else {
      console.log('✅ On correct network!');
    }
  } catch (error) {
    console.error('Error checking network:', error);
    throw error;
  }
}

  // Switch to correct network
  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK_CONFIG],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching network:', switchError);
        throw switchError;
      }
    }
  }

  // Get current account
  getCurrentAccount() {
    return this.account;
  }

  // Check if wallet is connected
  isWalletConnected() {
    return this.isConnected && this.account !== null;
  }

  // Get election state
  async getElectionState() {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const state = await this.contract.methods.state().call();
      return parseInt(state);
    } catch (error) {
      console.error('Error getting election state:', error);
      throw error;
    }
  }

  // Start election
  async startElection() {
    try {
      if (!this.contract || !this.account) throw new Error('Wallet not connected');
      
      const tx = await this.contract.methods.startElection().send({
        from: this.account,
      });
      
      return tx;
    } catch (error) {
      console.error('Error starting election:', error);
      throw error;
    }
  }

  // End election
  async endElection() {
    try {
      if (!this.contract || !this.account) throw new Error('Wallet not connected');
      
      const tx = await this.contract.methods.endElection().send({
        from: this.account,
      });
      
      return tx;
    } catch (error) {
      console.error('Error ending election:', error);
      throw error;
    }
  }

  // Register a voter
  async registerVoter(name, cnic, city) {
    try {
      if (!this.contract || !this.account) throw new Error('Wallet not connected');
      
      const tx = await this.contract.methods.registerVoter(
        name,
        Number(cnic),
        city
      ).send({
        from: this.account,
      });
      
      return tx;
    } catch (error) {
      console.error('Error registering voter:', error);
      throw error;
    }
  }

  // Add a candidate
  async addCandidate(name, party, cnic, city) {
    try {
      if (!this.contract || !this.account) throw new Error('Wallet not connected');
      
      const tx = await this.contract.methods.addCandidate(
        name,
        party,
        Number(cnic),
        city
      ).send({
        from: this.account,
      });
      
      return tx;
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  }

  // Cast a vote
  async castVote(candidateId, voterCNIC) {
    try {
      if (!this.contract || !this.account) throw new Error('Wallet not connected');
      
      const tx = await this.contract.methods.vote(
        Number(candidateId),
        Number(voterCNIC)
      ).send({
        from: this.account,
      });
      
      return tx;
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  }

  // Get candidate count
  async getCandidateCount() {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const count = await this.contract.methods.getCandidateCount().call();
      return parseInt(count);
    } catch (error) {
      console.error('Error getting candidate count:', error);
      throw error;
    }
  }

  // Get candidate by ID
  async getCandidate(candidateId) {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const candidate = await this.contract.methods.getCandidate(Number(candidateId)).call();
      
      return {
        name: candidate.name,
        id: parseInt(candidate.id),
        voteCount: parseInt(candidate.voteCount),
        party: candidate.party,
        cnic: parseInt(candidate.cnic),
        city: candidate.city,
      };
    } catch (error) {
      console.error('Error getting candidate:', error);
      throw error;
    }
  }

  // Get all candidates
  async getAllCandidates() {
    try {
      const candidateCount = await this.getCandidateCount();
      const candidates = [];
      
      for (let i = 1; i <= candidateCount; i++) {
        const candidate = await this.getCandidate(i);
        candidates.push(candidate);
      }
      
      return candidates;
    } catch (error) {
      console.error('Error getting all candidates:', error);
      throw error;
    }
  }

  // Get election statistics
  async getElectionStats() {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const [totalCandidates, totalVoters, totalVotes, startTime, endTime] = await Promise.all([
        this.contract.methods.totalCandidates().call(),
        this.contract.methods.totalVotersRegistered().call(),
        this.contract.methods.totalVotesCasted().call(),
        this.contract.methods.startTime().call(),
        this.contract.methods.endTime().call(),
      ]);
      
      return {
        totalCandidates: parseInt(totalCandidates),
        totalVoters: parseInt(totalVoters),
        totalVotes: parseInt(totalVotes),
        startTime: parseInt(startTime),
        endTime: parseInt(endTime),
      };
    } catch (error) {
      console.error('Error getting election stats:', error);
      throw error;
    }
  }

  // Get winner
  async getWinner() {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const result = await this.contract.methods.getWinner().call();
      
      return {
        name: result[0],
        votes: parseInt(result[1]),
      };
    } catch (error) {
      console.error('Error getting winner:', error);
      throw error;
    }
  }

  // Get votes for a specific candidate
  async getVotes(candidateId) {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const votes = await this.contract.methods.getVotes(Number(candidateId)).call();
      return parseInt(votes);
    } catch (error) {
      console.error('Error getting votes:', error);
      throw error;
    }
  }

  // Listen for contract events
  async listenForEvents(eventName, callback) {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      this.contract.events[eventName]()
        .on('data', callback)
        .on('error', (error) => {
          console.error(`Error listening for ${eventName}:`, error);
        });
    } catch (error) {
      console.error('Error setting up event listener:', error);
      throw error;
    }
  }

  // Disconnect wallet
  disconnect() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
    this.isConnected = false;
  }
}

// Create and export a singleton instance
const blockchainService = new BlockchainService();
export default blockchainService;
