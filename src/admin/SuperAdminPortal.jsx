import React, { useState } from 'react';

// ── Inline sub-type adder for an existing election type row ──────────────────
function ExistingSubTypeAdder({ elecTypeId, onAdd }) {
  const [subId, setSubId] = useState('');
  const [subName, setSubName] = useState('');

  const handleAdd = () => {
    if (!subId.trim() || !subName.trim()) { alert('Please fill both Sub-Type ID and Name.'); return; }
    onAdd(elecTypeId, subId.trim().toLowerCase().replace(/[^a-z0-9]/g, ''), subName.trim());
    setSubId(''); setSubName('');
  };

  return (
    <div style={{
      marginTop: '8px', padding: '10px 12px',
      background: 'rgba(0,176,255,0.05)',
      border: '1px dashed rgba(0,176,255,0.3)',
      borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: '0 0 120px' }}>
        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sub-Type ID</label>
        <input
          type="text" className="form-input"
          placeholder="e.g. mla"
          value={subId}
          onChange={e => setSubId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: '140px' }}>
        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sub-Type Name</label>
        <input
          type="text" className="form-input"
          placeholder="e.g. MLA Election"
          value={subName}
          onChange={e => setSubName(e.target.value)}
          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
        />
      </div>
      <button
        type="button" onClick={handleAdd}
        className="btn btn-outline"
        style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem', borderColor: 'var(--secondary)', color: 'var(--secondary)', alignSelf: 'flex-end' }}
      >
        ＋ Add
      </button>
    </div>
  );
}

// ── Inline admin access editor ────────────────────────────────────────────────
function AdminAccessEditor({ admin, electionTypes, onSave, onCancel }) {
  const [elecType, setElecType] = useState(admin.assignedElectionType || 'general');
  const [subType, setSubType] = useState(admin.assignedSubType || '');

  const selectedET = electionTypes.find(et => et.id === elecType);
  const availSubs = selectedET?.subTypes || [];

  return (
    <div style={{
      marginTop: '8px', padding: '12px',
      background: 'rgba(255,179,0,0.05)',
      border: '1px dashed rgba(255,179,0,0.3)',
      borderRadius: '8px'
    }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 700, marginBottom: '8px' }}>
        ✏️ Edit Access — <strong style={{ color: '#fff' }}>{admin.username}</strong>
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: '160px' }}>
          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Election Type</label>
          <select
            className="form-input"
            value={elecType}
            onChange={e => { setElecType(e.target.value); setSubType(''); }}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
          >
            {electionTypes.map(et => (
              <option key={et.id} value={et.id}>{et.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: '160px' }}>
          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Sub-Type
            {availSubs.length === 0 && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> (none defined)</span>}
          </label>
          <select
            className="form-input"
            value={subType}
            onChange={e => setSubType(e.target.value)}
            disabled={availSubs.length === 0}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', opacity: availSubs.length === 0 ? 0.5 : 1 }}
          >
            <option value="">🔓 All Sub-Types</option>
            {availSubs.map(s => (
              <option key={s.id} value={s.id}>🏷️ {s.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignSelf: 'flex-end' }}>
          <button
            type="button"
            onClick={() => onSave(admin.username, elecType, subType)}
            className="btn btn-primary"
            style={{ padding: '0.35rem 1rem', fontSize: '0.8rem' }}
          >
            ✓ Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main SuperAdminPortal ─────────────────────────────────────────────────────
const SuperAdminPortal = ({
  t,
  voters,
  electionTypes,
  newElecId, setNewElecId,
  newElecName, setNewElecName,
  newElecDesc, setNewElecDesc,
  addSubTypeToExisting,
  handleCreateElectionType,
  adminCredentials,
  newAdminUser, setNewAdminUser,
  newAdminPass, setNewAdminPass,
  newAdminElec, setNewAdminElec,
  newAdminSubElec, setNewAdminSubElec,
  adminSetupMsg,
  handleCreateAdmin,
  removeAdmin,
  updateAdminAccess,
  timezone, setTimezone,
  startTime, setStartTime,
  endTime, setEndTime,
  saveSuperSettings,
  electionStatus, toggleElectionStatus,
  auditResults,
  nominations,
  booths,
  polls
}) => {
  // Which election type row has the sub-type adder open
  const [expandedElecType, setExpandedElecType] = useState(null);
  // Which admin row has the edit panel open
  const [editingAdmin, setEditingAdmin] = useState(null);
  // Active sub-tab in Super Admin Portal
  const [activeTab, setActiveTab] = useState('vault');

  const selectedElecForAdmin = electionTypes.find(et => et.id === newAdminElec);
  const availableSubTypes = selectedElecForAdmin?.subTypes || [];

  const getCandidateTallies = () => {
    const approved = nominations.filter(n => n.status === 'APPROVED');
    const voteMap = {};
    polls.forEach(p => {
      voteMap[p.candidate_id] = (voteMap[p.candidate_id] || 0) + 1;
    });
    return approved.map(c => ({
      ...c,
      voteCount: voteMap[c.nomination_id] || 0
    })).sort((a, b) => b.voteCount - a.voteCount);
  };

  const candidateTallies = getCandidateTallies();
  const totalVotes = candidateTallies.reduce((sum, c) => sum + c.voteCount, 0);
  const winner = candidateTallies.length > 0 && candidateTallies[0].voteCount > 0 ? candidateTallies[0] : null;
  const runner = candidateTallies.length > 1 && candidateTallies[1].voteCount > 0 ? candidateTallies[1] : null;
  const margin = winner && runner ? winner.voteCount - runner.voteCount : winner ? winner.voteCount : 0;
  const turnoutPercent = voters.length > 0 ? ((totalVotes / voters.length) * 100).toFixed(1) : '0.0';

  return (
    <section id="super-admin-view" className="view-section active">
      {/* Super Admin Top Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={`tab-btn ${activeTab === 'vault' ? 'active' : ''}`}
          onClick={() => setActiveTab('vault')}
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          🗃️ Aadhaar Vault & Admins
        </button>
        <button
          className={`tab-btn ${activeTab === 'command-center' ? 'active' : ''}`}
          onClick={() => setActiveTab('command-center')}
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          📽️ ECI Live Command Center
        </button>
        <button
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          🏆 Results Declaration
        </button>
      </div>

      {activeTab === 'command-center' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="analytics-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel stat-card">
              <div className="stat-icon">🗳️</div>
              <div className="stat-info">
                <span className="stat-label">Total Votes Polled</span>
                <span className="stat-value">{totalVotes}</span>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-label">Voter Turnout</span>
                <span className="stat-value">{turnoutPercent}%</span>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <span className="stat-label">Active Booths</span>
                <span className="stat-value">{booths.length}</span>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon">🛡️</div>
              <div className="stat-info">
                <span className="stat-label">System Security</span>
                <span className="stat-value" style={{ color: 'var(--success)' }}>100% OK</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>📊 Real-Time Candidate Tallies</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {candidateTallies.map(c => {
                const percentage = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;
                return (
                  <div key={c.nomination_id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span><strong>{c.name_of_candidate}</strong> ({c.party_name}) {c.party_symbol}</span>
                      <span style={{ fontWeight: 'bold' }}>{c.voteCount} votes ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>📹 Live CCTV Booth Surveillance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {booths.map(b => (
                <div key={b.booth_number} style={{ background: '#020617', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--success)', marginBottom: '5px' }}>
                    <span>● LIVE FEED</span>
                    <span>{b.camera_id}</span>
                  </div>
                  <div style={{ height: '120px', background: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                    <span style={{ fontSize: '2rem', opacity: 0.6 }}>📹</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', marginTop: '6px', color: 'var(--text-secondary)' }}>{b.booth_number} — {b.location_name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {winner ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', border: '2px solid rgba(255,215,0,0.4)', background: 'linear-gradient(135deg, rgba(255,215,0,0.05), rgba(79,172,254,0.05))' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆</div>
              <h3 style={{ fontSize: '1.3rem', color: '#fbbf24' }}>ELECTED WINNER</h3>
              <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: '0.5rem 0' }}>{winner.name_of_candidate}</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>{winner.party_name} {winner.party_symbol}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Winner Votes</span>
                  <h3 style={{ color: 'var(--success)' }}>{winner.voteCount}</h3>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Victory Margin</span>
                  <h3 style={{ color: 'var(--primary)' }}>+{margin}</h3>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No votes recorded yet. Start simulation or polling to view official results.</p>
            </div>
          )}

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>🏆 Official Vote Share & Margin Registry</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Candidate</th>
                    <th>Party</th>
                    <th>Symbol</th>
                    <th>Total Votes</th>
                    <th>Vote Share</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {candidateTallies.map((c, idx) => {
                    const share = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;
                    return (
                      <tr key={c.nomination_id}>
                        <td><strong>#{idx + 1}</strong></td>
                        <td><strong>{c.name_of_candidate}</strong></td>
                        <td>{c.party_name}</td>
                        <td style={{ fontSize: '1.25rem' }}>{c.party_symbol}</td>
                        <td><strong>{c.voteCount}</strong></td>
                        <td>{share}%</td>
                        <td>
                          <span style={{
                            padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700,
                            background: idx === 0 && c.voteCount > 0 ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.05)',
                            color: idx === 0 && c.voteCount > 0 ? 'var(--success)' : 'var(--text-muted)'
                          }}>
                            {idx === 0 && c.voteCount > 0 ? '🏆 WINNER' : 'RUNNER'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vault' && (
      <div className="admin-grid-layout" style={{ gridTemplateColumns: '1fr 380px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Voter Aadhaar List */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2>{t.aadhaarVaultTitle}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              {t.aadhaarVaultDesc}
            </p>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.aadhaarNumber}</th>
                    <th>{t.fullName}</th>
                    <th>{t.mlaConst}</th>
                    <th>{t.dobLabel}</th>
                    <th>{t.votingState}</th>
                    <th>{t.syncTime}</th>
                  </tr>
                </thead>
                <tbody>
                  {voters.map(v => (
                    <tr key={v.aadhar_id}>
                      <td><code>{v.aadhar_id}</code></td>
                      <td><strong>{v.name}</strong></td>
                      <td>{v.mla_constituency}</td>
                      <td>{v.dob}</td>
                      <td>
                        <span style={{
                          padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700,
                          background: v.has_voted ? 'rgba(0,230,118,0.15)' : 'rgba(255,179,0,0.15)',
                          color: v.has_voted ? 'var(--success)' : 'var(--warning)'
                        }}>
                          {v.has_voted ? t.voted : t.notVoted}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {v.vote_timestamp ? new Date(v.vote_timestamp).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Election Type Management */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2>📂 {t.electionTypesTab}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              Register and review election models. Click <strong style={{ color: 'var(--secondary)' }}>＋ Sub-Type</strong> on any row to add a sub-type to an existing election type.
            </p>

            <div className="data-table-container" style={{ marginBottom: '1.5rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '90px' }}>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Sub-Types</th>
                    <th style={{ width: '110px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {electionTypes.map(et => (
                    <React.Fragment key={et.id}>
                      <tr>
                        <td><code>{et.id}</code></td>
                        <td><strong>{et.name}</strong></td>
                        <td><span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{et.desc}</span></td>
                        <td>
                          {(et.subTypes && et.subTypes.length > 0) ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {et.subTypes.map(st => (
                                <span key={st.id} style={{
                                  padding: '2px 8px', borderRadius: '12px', fontSize: '0.71rem', fontWeight: 600,
                                  background: 'rgba(0,176,255,0.12)', color: 'var(--secondary)',
                                  border: '1px solid rgba(0,176,255,0.25)'
                                }}>🏷️ {st.name}</span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => setExpandedElecType(expandedElecType === et.id ? null : et.id)}
                            className="btn btn-outline"
                            style={{
                              padding: '3px 10px', fontSize: '0.73rem', whiteSpace: 'nowrap',
                              borderColor: expandedElecType === et.id ? 'var(--danger)' : 'var(--secondary)',
                              color: expandedElecType === et.id ? 'var(--danger)' : 'var(--secondary)'
                            }}
                          >
                            {expandedElecType === et.id ? '✕ Close' : '＋ Sub-Type'}
                          </button>
                        </td>
                      </tr>
                      {/* Expanded sub-type adder row */}
                      {expandedElecType === et.id && (
                        <tr>
                          <td colSpan={5} style={{ padding: '4px 12px 12px' }}>
                            <ExistingSubTypeAdder
                              elecTypeId={et.id}
                              onAdd={(elecTypeId, subId, subName) => {
                                addSubTypeToExisting(elecTypeId, subId, subName);
                                setExpandedElecType(null);
                              }}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Election Type Form */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>➕ {t.addElectionType}</h3>
              <form onSubmit={handleCreateElectionType}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t.elecId}</label>
                    <input
                      type="text" className="form-input"
                      placeholder="e.g. sports"
                      value={newElecId}
                      onChange={e => setNewElecId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.elecName}</label>
                    <input
                      type="text" className="form-input"
                      placeholder="e.g. Sports Club President"
                      value={newElecName}
                      onChange={e => setNewElecName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label>{t.elecDesc}</label>
                  <input
                    type="text" className="form-input"
                    placeholder="e.g. Vote for the president of the community sports club."
                    value={newElecDesc}
                    onChange={e => setNewElecDesc(e.target.value)}
                    required
                  />
                </div>


                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                  💾 {t.saveElecType}
                </button>
              </form>
            </div>
          </div>

          {/* Admin Access Management */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2>🔐 Admin Access Management</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              Create, edit assignment, or remove admin accounts. Click <strong style={{ color: 'var(--warning)' }}>✏️ Edit</strong> to change an admin's election type or sub-type. Click <strong style={{ color: 'var(--danger)' }}>🗑 Remove</strong> to delete the account.
            </p>

            <div className="data-table-container" style={{ marginBottom: '1.5rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Election Type</th>
                    <th>Sub-Type</th>
                    <th style={{ width: '140px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminCredentials.filter(c => c.role === 'admin').map((c, i) => (
                    <React.Fragment key={c.username}>
                      <tr>
                        <td><strong>{c.username}</strong></td>
                        <td><code style={{ color: 'var(--secondary)' }}>{c.assignedElectionType}</code></td>
                        <td>
                          {c.assignedSubType ? (
                            <span style={{
                              padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600,
                              background: 'rgba(0,176,255,0.12)', color: 'var(--secondary)',
                              border: '1px solid rgba(0,176,255,0.25)'
                            }}>🏷️ {c.assignedSubTypeName || c.assignedSubType}</span>
                          ) : (
                            <span style={{
                              padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600,
                              background: 'rgba(255,179,0,0.1)', color: 'var(--warning)',
                              border: '1px solid rgba(255,179,0,0.25)'
                            }}>🔓 ALL</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              type="button"
                              onClick={() => setEditingAdmin(editingAdmin === c.username ? null : c.username)}
                              className="btn btn-outline"
                              style={{
                                padding: '3px 9px', fontSize: '0.72rem',
                                borderColor: editingAdmin === c.username ? 'var(--danger)' : 'var(--warning)',
                                color: editingAdmin === c.username ? 'var(--danger)' : 'var(--warning)'
                              }}
                            >
                              {editingAdmin === c.username ? '✕' : '✏️ Edit'}
                            </button>
                            <button
                              type="button"
                              onClick={() => { removeAdmin(c.username); if (editingAdmin === c.username) setEditingAdmin(null); }}
                              className="btn btn-outline"
                              style={{ padding: '3px 9px', fontSize: '0.72rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                            >🗑</button>
                          </div>
                        </td>
                      </tr>
                      {/* Expanded edit panel */}
                      {editingAdmin === c.username && (
                        <tr>
                          <td colSpan={4} style={{ padding: '4px 12px 12px' }}>
                            <AdminAccessEditor
                              admin={c}
                              electionTypes={electionTypes}
                              onSave={(username, elecType, subType) => {
                                updateAdminAccess(username, elecType, subType);
                                setEditingAdmin(null);
                              }}
                              onCancel={() => setEditingAdmin(null)}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grant Admin Access Form */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>➕ Grant Admin Access</h3>
              <form onSubmit={handleCreateAdmin}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text" className="form-input"
                      placeholder="e.g. admin_sports"
                      value={newAdminUser}
                      onChange={e => setNewAdminUser(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="text" className="form-input"
                      placeholder="e.g. secure@123"
                      value={newAdminPass}
                      onChange={e => setNewAdminPass(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: '0.5rem' }}>
                  <div className="form-group">
                    <label>Assign Election Type</label>
                    <select
                      className="form-input"
                      value={newAdminElec}
                      onChange={e => { setNewAdminElec(e.target.value); setNewAdminSubElec(''); }}
                      required
                    >
                      {electionTypes.map(et => (
                        <option key={et.id} value={et.id}>{et.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      Assign Sub-Type
                      <span style={{ fontSize: '0.68rem', color: 'var(--secondary)', fontWeight: 400, background: 'rgba(0,176,255,0.1)', borderRadius: '8px', padding: '1px 6px' }}>optional</span>
                    </label>
                    <select
                      className="form-input"
                      value={newAdminSubElec}
                      onChange={e => setNewAdminSubElec(e.target.value)}
                      disabled={availableSubTypes.length === 0}
                      style={{ opacity: availableSubTypes.length === 0 ? 0.5 : 1 }}
                    >
                      <option value="">🔓 All Sub-Types (No Restriction)</option>
                      {availableSubTypes.map(st => (
                        <option key={st.id} value={st.id}>🏷️ {st.name}</option>
                      ))}
                    </select>
                    {availableSubTypes.length === 0 && (
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px' }}>No sub-types for this election type.</p>
                    )}
                  </div>
                </div>

                {adminSetupMsg && (
                  <div style={{
                    marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
                    background: adminSetupMsg.startsWith('Error') ? 'rgba(255,23,68,0.15)' : 'rgba(0,230,118,0.15)',
                    color: adminSetupMsg.startsWith('Error') ? 'var(--danger)' : 'var(--success)'
                  }}>
                    {adminSetupMsg}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                  💾 Save Admin Credential
                </button>
              </form>
            </div>
          </div>
        </div>{/* end left column */}

        {/* Right: Configurations & Audit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div className="booth-controls-card glass-panel" style={{ gap: '1rem' }}>
            <h3 style={{ color: 'var(--warning)' }}>{t.timelineSettings}</h3>
            <form onSubmit={saveSuperSettings}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>{t.timezoneOffset}</label>
                <input type="text" className="form-input" value={timezone} onChange={e => setTimezone(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>{t.pollStart}</label>
                <input type="time" className="form-input" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>{t.pollEnd}</label>
                <input type="time" className="form-input" value={endTime} onChange={e => setEndTime(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem' }}>{t.updateConfig}</button>
            </form>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t.electionState}</span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: electionStatus === 'ACTIVE' ? 'var(--success)' : 'var(--danger)' }}>{electionStatus}</div>
              </div>
              <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--warning)', color: 'var(--warning)' }} onClick={toggleElectionStatus}>
                {t.toggleLock}
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>{t.cryptoMathCheck}</h3>
            <div className={`voter-status-alert ${auditResults.allPassed ? 'success' : 'warning'}`} style={{ fontSize: '0.75rem', padding: '0.5rem' }}>
              <strong>{auditResults.allPassed ? '✓ SECURE' : '✗ DISCREPANCY'}</strong>: {t.cryptoMathPassed}
            </div>
            <div className="data-table-container" style={{ marginTop: '0' }}>
              <table className="data-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th>{t.candidateCol}</th>
                    <th>{t.net1Col}</th>
                    <th>{t.nrt2Col}</th>
                  </tr>
                </thead>
                <tbody>
                  {nominations.filter(n => n.status === 'APPROVED').map(c => {
                    let net1 = 0;
                    booths.forEach(b => {
                      net1 += polls.filter(p => p.booth_number === b.booth_number && p.candidate_name === c.name_of_candidate).length;
                    });
                    const nrt2 = polls.filter(p => p.candidate_name === c.name_of_candidate).length;
                    return (
                      <tr key={c.nomination_id}>
                        <td>{c.name_of_candidate}</td>
                        <td>{net1}</td>
                        <td>{nrt2}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      )}
    </section>
  );
};

export default SuperAdminPortal;
