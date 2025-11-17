import React, { useState } from "react";
import { useBlockchain } from "../context/BlockchainContext";
import "./AdminPanel.css";

export default function AdminPanel() {
  const {
    startElection,
    endElection,
    electionState,
    loading,
    error,
    clearError,
    registerVoter,
    addCandidate,
  } = useBlockchain();

  const [showVoterForm, setShowVoterForm] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);

  // voter inputs
  const [voterData, setVoterData] = useState({
    name: "",
    cnic: "",
    city: "",
  });

  // candidate inputs
  const [candidateData, setCandidateData] = useState({
    name: "",
    party: "",
    cnic: "",
    city: "",
  });

  const stateNames = ["🔴 Not Started", "🟢 Started", "🔵 Ended"];

  const handleStartElection = async () => {
    try {
      await startElection();
      alert("✅ Election Started Successfully!");
    } catch (err) {
      alert("❌ Error starting election: " + err.message);
    }
  };

  const handleEndElection = async () => {
    try {
      await endElection();
      alert("✅ Election Ended Successfully!");
    } catch (err) {
      alert("❌ Error ending election: " + err.message);
    }
  };

  const handleRegisterVoter = async (e) => {
    e.preventDefault();
    try {
      await registerVoter(
        voterData.name,
        voterData.cnic,
        voterData.city
      );
      alert("✅ Voter Registered Successfully!");
      setShowVoterForm(false);
      setVoterData({ name: "", cnic: "", city: "" });
    } catch (err) {
      alert("❌ Error registering voter: " + err.message);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      await addCandidate(
        candidateData.name,
        candidateData.party,
        candidateData.cnic,
        candidateData.city
      );
      alert("✅ Candidate Added Successfully!");
      setShowCandidateForm(false);
      setCandidateData({ name: "", party: "", cnic: "", city: "" });
    } catch (err) {
      alert("❌ Error adding candidate: " + err.message);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <h1>⚙️ Admin Panel</h1>

        {/* Election Status Section */}
        <div className="status-card">
          <h2>Election Status: {stateNames[electionState] || "Unknown"}</h2>
          <div className="buttons">
            <button onClick={handleStartElection} disabled={loading}>
              🚀 Start Election
            </button>
            <button onClick={handleEndElection} disabled={loading}>
              🛑 End Election
            </button>
          </div>
        </div>

        {/* Registration Buttons */}
        <div className="form-toggle">
          <button
            onClick={() => {
              setShowVoterForm(!showVoterForm);
              setShowCandidateForm(false);
            }}
          >
            🧾 Register Voter
          </button>

          <button
            onClick={() => {
              setShowCandidateForm(!showCandidateForm);
              setShowVoterForm(false);
            }}
          >
            🗳️ Add Candidate
          </button>
        </div>

        {/* Voter Form */}
        {showVoterForm && (
          <form className="admin-form" onSubmit={handleRegisterVoter}>
            <h3>Register Voter</h3>
            <input
              type="text"
              placeholder="Name"
              value={voterData.name}
              onChange={(e) =>
                setVoterData({ ...voterData, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="CNIC"
              value={voterData.cnic}
              onChange={(e) =>
                setVoterData({ ...voterData, cnic: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="City"
              value={voterData.city}
              onChange={(e) =>
                setVoterData({ ...voterData, city: e.target.value })
              }
              required
            />
            <button type="submit" disabled={loading}>
              ✅ Register
            </button>
          </form>
        )}

        {/* Candidate Form */}
        {showCandidateForm && (
          <form className="admin-form" onSubmit={handleAddCandidate}>
            <h3>Add Candidate</h3>
            <input
              type="text"
              placeholder="Name"
              value={candidateData.name}
              onChange={(e) =>
                setCandidateData({ ...candidateData, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Party"
              value={candidateData.party}
              onChange={(e) =>
                setCandidateData({ ...candidateData, party: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="CNIC"
              value={candidateData.cnic}
              onChange={(e) =>
                setCandidateData({ ...candidateData, cnic: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="City"
              value={candidateData.city}
              onChange={(e) =>
                setCandidateData({ ...candidateData, city: e.target.value })
              }
              required
            />
            <button type="submit" disabled={loading}>
              ➕ Add Candidate
            </button>
          </form>
        )}

        {/* Error Handling */}
        {error && (
          <div className="error-box">
            <p>⚠️ {error}</p>
            <button onClick={clearError}>Clear</button>
          </div>
        )}
      </div>
    </div>
  );
}
