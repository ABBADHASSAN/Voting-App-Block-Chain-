// API Service for Voting App
// Replace the base URL with your actual API endpoint when available

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  // Get candidates for a specific CNIC
  async getCandidatesByCnic(cnic) {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${cnic}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }

  // Get results for a specific area/city
  async getResultsByArea(area) {
    try {
      const response = await fetch(`${API_BASE_URL}/results/${encodeURIComponent(area)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  }

  // Get overall turnout statistics
  async getOverallStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/overall`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching overall stats:', error);
      throw error;
    }
  }

  // Cast a vote (this will likely need authentication)
  async castVote(cnic, candidateId) {
    try {
      const response = await fetch(`${API_BASE_URL}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cnic: cnic,
          candidateId: candidateId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  }

  // Validate CNIC (optional - for additional validation)
  async validateCnic(cnic) {
    try {
      const response = await fetch(`${API_BASE_URL}/validate-cnic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnic }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating CNIC:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Example usage:
// import apiService from './services/api';
// 
// // In your component:
// const candidates = await apiService.getCandidatesByCnic('12345-1234567-1');
// const results = await apiService.getResultsByArea('Karachi');
// const stats = await apiService.getOverallStats();
// const voteResult = await apiService.castVote('12345-1234567-1', 1);
