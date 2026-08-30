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
  activeElectionType = 'all',
  setActiveElectionType,
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
  polls,
  auditNomination,
  createNewBooth,
  newBoothId, setNewBoothId,
  newBoothLocation, setNewBoothLocation,
  newBoothIp, setNewBoothIp,
  newBoothCamera, setNewBoothCamera,
  nomSuccess, setNomSuccess,
  submitNomination,
  nomAadhar, setNomAadhar,
  nomName, setNomName,
  nomPartyName, setNomPartyName,
  nomPartySymbol, setNomPartySymbol,
  getSymbolsForType,
  nomPhoto, setNomPhoto,
  nomTxnNum, setNomTxnNum,
  nomPaidDate, setNomPaidDate,
  nomMobile, setNomMobile,
  nomEmail, setNomEmail,
  nomCommAddress, setNomCommAddress
}) => {
  // Which election type row has the sub-type adder open
  const [expandedElecType, setExpandedElecType] = useState(null);
  // Which admin row has the edit panel open
  const [editingAdmin, setEditingAdmin] = useState(null);
  // Active sub-tab in Super Admin Portal
  const [activeTab, setActiveTab] = useState('nominations');

  const isFiltered = activeElectionType !== 'all';
  const currentElecObj = isFiltered ? electionTypes.find(et => et.id === activeElectionType) : null;
  const currentElecName = currentElecObj ? currentElecObj.name : 'All Elections';

  const filteredNominations = isFiltered 
    ? nominations.filter(n => (n.election_type || 'general') === activeElectionType)
    : nominations;
  
  const filteredBooths = isFiltered
    ? booths.filter(b => (b.election_type || 'general') === activeElectionType)
    : booths;

  const filteredPolls = isFiltered
    ? polls.filter(p => (p.election_type || 'general') === activeElectionType)
    : polls;

  const selectedElecForAdmin = electionTypes.find(et => et.id === newAdminElec);
  const availableSubTypes = selectedElecForAdmin?.subTypes || [];

  const getCandidateTallies = () => {
    const approved = filteredNominations.filter(n => n.status === 'APPROVED');
    const voteMap = {};
    filteredPolls.forEach(p => {
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
      {/* Banner indicating scope */}
      <div className="glass-panel" style={{
        padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px',
        border: isFiltered ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid var(--border-color)',
        background: isFiltered ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(79, 172, 254, 0.05))' : 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>{isFiltered ? '🗳️' : '🌐'}</span>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Management Scope
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isFiltered ? 'var(--secondary)' : '#ffffff' }}>
              {currentElecName} {isFiltered && <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600, marginLeft: '6px' }}>(Super Admin + Admin Operations)</span>}
            </div>
          </div>
        </div>

        {isFiltered && (
          <button
            className="btn btn-outline"
            onClick={() => setActiveElectionType('all')}
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
          >
            ← View All Elections (Overview)
          </button>
        )}
      </div>

      {/* Super Admin Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        {isFiltered ? (
          <>
            <button className={`tab-btn ${activeTab === 'nominations' ? 'active' : ''}`} onClick={() => setActiveTab('nominations')}>📂 {t.nomInbox || 'Nomination Inbox'} ({filteredNominations.length})</button>
            <button className={`tab-btn ${activeTab === 'booths' ? 'active' : ''}`} onClick={() => setActiveTab('booths')}>🏢 {t.boothSetup || 'Booth Setup'} ({filteredBooths.length})</button>
            <button className={`tab-btn ${activeTab === 'contestants' ? 'active' : ''}`} onClick={() => setActiveTab('contestants')}>🗂️ {t.contRegistry || 'Contestant Registry'}</button>
            <button className={`tab-btn ${activeTab === 'file-nomination' ? 'active' : ''}`} onClick={() => { setActiveTab('file-nomination'); setNomSuccess && setNomSuccess(false); }}>✍️ {t.fileNomBtn || 'File Nomination'}</button>
            <button className={`tab-btn ${activeTab === 'command-center' ? 'active' : ''}`} onClick={() => setActiveTab('command-center')}>📽️ {t.commandCenter || 'Command Center'}</button>
            <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>🏆 {t.resDecl || 'Results Declaration'}</button>
            <button className={`tab-btn ${activeTab === 'vault' ? 'active' : ''}`} onClick={() => setActiveTab('vault')}>🗃️ Aadhaar Vault & Admins</button>
            <button className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>⏱️ Timeline & Locks</button>
          </>
        ) : (
          <>
            <button className={`tab-btn ${activeTab === 'vault' ? 'active' : ''}`} onClick={() => setActiveTab('vault')}>🗃️ Aadhaar Vault & Admins</button>
            <button className={`tab-btn ${activeTab === 'election-types' ? 'active' : ''}`} onClick={() => setActiveTab('election-types')}>📂 Election Types Manager</button>
            <button className={`tab-btn ${activeTab === 'command-center' ? 'active' : ''}`} onClick={() => setActiveTab('command-center')}>📽️ Master Command Center</button>
            <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>🏆 Master Results Declaration</button>
            <button className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>⏱️ Timeline & Security State</button>
          </>
        )}
      </div>

      {/* NOMINATIONS INBOX */}
      {activeTab === 'nominations' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>📂 {t.candNomInbox || 'Candidate Nomination Inbox'} {isFiltered && `— ${currentElecName}`}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            {t.nomAuditingDesc || 'Review and audit candidate nominations submitted for this constituency.'}
          </p>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.nomId || 'Nom. ID'}</th>
                  <th>{t.candName || 'Candidate'}</th>
                  <th>{t.partyAffil || 'Party / Affiliation'}</th>
                  <th>{t.aadharCard || 'Aadhaar ID'}</th>
                  <th>{t.secDeposit || 'Security Deposit'}</th>
                  <th>{t.verifStatus || 'Status'}</th>
                  <th>{t.actControls || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredNominations.map(n => (
                  <tr key={n.nomination_id}>
                    <td>{n.nomination_id}</td>
                    <td><strong>{n.name_of_candidate}</strong></td>
                    <td>{n.party_name} ({n.party_symbol})</td>
                    <td><code>{n.candidate_aadhar_id}</code></td>
                    <td>₹{n.fee_amount ? n.fee_amount.toLocaleString() : '25,000'}</td>
                    <td>
                      <span style={{
                        padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700,
                        background: n.status === 'APPROVED' ? 'rgba(0, 230, 118, 0.15)' : n.status === 'REJECTED' ? 'rgba(255, 23, 68, 0.15)' : 'rgba(255, 179, 0, 0.15)',
                        color: n.status === 'APPROVED' ? 'var(--success)' : n.status === 'REJECTED' ? 'var(--danger)' : 'var(--warning)'
                      }}>
                        {n.status}
                      </span>
                    </td>
                    <td>
                      {n.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button className="btn btn-success" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => auditNomination(n.nomination_id, 'APPROVED')}>{t.approveBtn || 'Approve'}</button>
                          <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => auditNomination(n.nomination_id, 'REJECTED')}>{t.rejectBtn || 'Reject'}</button>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.reviewed || 'Reviewed'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOOTH SETUP */}
      {activeTab === 'booths' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>🏢 {t.boothAllocTitle || 'Polling Terminal Allocation'} {isFiltered && `— ${currentElecName}`}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            {t.boothAllocDesc || 'Configure booths for this election.'}
          </p>
          <div className="data-table-container" style={{ marginBottom: '2rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.terminalId || 'Terminal ID'}</th>
                  <th>{t.geoLoc || 'Location'}</th>
                  <th>{t.constCode || 'Const. Code'}</th>
                  <th>{t.terminalIp || 'IP Address'}</th>
                  <th>{t.cctvCamId || 'CCTV Cam'}</th>
                  <th>{t.secOfficer || 'Officer'}</th>
                  <th>{t.operState || 'State'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooths.map(b => (
                  <tr key={b.booth_number}>
                    <td>{b.booth_number}</td>
                    <td><strong>{b.location_name}</strong></td>
                    <td>{b.mla_constituency_code} / {b.mp_constituency_code}</td>
                    <td><code>{b.ip_address}</code></td>
                    <td>{b.camera_id}</td>
                    <td>{b.agent_name}</td>
                    <td><span style={{ color: 'var(--success)', fontWeight: 'bold' }}>● {t.online || 'ONLINE'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--primary)' }}>{t.registerNewTerminal || 'Register New Polling Terminal'}</h3>
            <form onSubmit={createNewBooth}>
              <div className="form-row">
                <div className="form-group">
                  <label>{t.terminalIdCode || 'Terminal ID Code'}</label>
                  <input type="text" className="form-input" placeholder="e.g. BOOTH-05" value={newBoothId} onChange={(e) => setNewBoothId(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>{t.physicalLocName || 'Physical Location Name'}</label>
                  <input type="text" className="form-input" placeholder="e.g. ZP High School, Room 4" value={newBoothLocation} onChange={(e) => setNewBoothLocation(e.target.value)} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t.terminalSubnetIp || 'Terminal Subnet IP'}</label>
                  <input type="text" className="form-input" placeholder="e.g. 192.168.10.45" value={newBoothIp} onChange={(e) => setNewBoothIp(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>{t.camFeedIdCode || 'Camera Feed ID'}</label>
                  <input type="text" className="form-input" placeholder="e.g. CAM-0499" value={newBoothCamera} onChange={(e) => setNewBoothCamera(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>💾 {t.saveConfigBtn || 'Save Configuration'}</button>
            </form>
          </div>
        </div>
      )}

      {/* CONTESTANT REGISTRY */}
      {activeTab === 'contestants' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>🗂️ {t.approvedContestants || 'Approved Contestants'} {isFiltered && `— ${currentElecName}`}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            {t.contestantRegistryDesc || 'All approved candidates for this election.'}
          </p>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.ballotId || 'Ballot ID'}</th>
                  <th>{t.candName || 'Candidate'}</th>
                  <th>{t.party || 'Party'}</th>
                  <th>{t.symbol || 'Symbol'}</th>
                  <th>{t.contactEmail || 'Email'}</th>
                  <th>{t.regMobile || 'Mobile'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredNominations.filter(n => n.status === 'APPROVED')
                  .sort((a,b) => a.name_of_candidate.localeCompare(b.name_of_candidate))
                  .map((c, idx) => (
                    <tr key={c.nomination_id}>
                      <td>#{idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{c.candidate_photo}</span>
                          <strong>{c.name_of_candidate}</strong>
                        </div>
                      </td>
                      <td>{c.party_name}</td>
                      <td style={{ fontSize: '1.25rem' }}>{c.party_symbol}</td>
                      <td>{c.email}</td>
                      <td>{c.mobile}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FILE NOMINATION */}
      {activeTab === 'file-nomination' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '750px' }}>
          <h2>✍️ {t.fileNomBtn || 'File Nomination'} {isFiltered && `— ${currentElecName}`}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            Directly register candidate profiles under {currentElecName}.
          </p>

          {nomSuccess ? (
            <div className="success-banner glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ color: 'var(--success)' }}>{t.formSuccessTitle || 'Nomination Submitted!'}</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{t.formSuccessDesc || 'Your nomination has been submitted and auto-approved.'}</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setNomSuccess(false)}>
                {t.formBackBtn || 'File Another Nomination'}
              </button>
            </div>
          ) : (
            <form onSubmit={submitNomination} className="nomination-form">
              <div className="form-group">
                <label>{t.formAadharId || 'Aadhaar ID'}</label>
                <input 
                  type="text" 
                  maxLength={12} 
                  className="form-input" 
                  placeholder="12-digit Aadhaar Number" 
                  value={nomAadhar} 
                  onChange={(e) => setNomAadhar(e.target.value.replace(/\D/g, ''))} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>{t.formCandName || 'Candidate Full Name'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Dr. Rajesh Sharma" 
                  value={nomName} 
                  onChange={(e) => setNomName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t.formPartyName || 'Party Name'}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Independent / Bharatiya Janata Party" 
                    value={nomPartyName} 
                    onChange={(e) => setNomPartyName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>{t.formPartySymbol || 'Party Symbol'}</label>
                  <select 
                    className="form-input" 
                    value={nomPartySymbol} 
                    onChange={(e) => setNomPartySymbol(e.target.value)}
                  >
                    {getSymbolsForType(activeElectionType === 'all' ? 'general' : activeElectionType).map((s, i) => (
                      <option key={i} value={s.symbol}>{s.symbol} {s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t.formPhoto || 'Candidate Photo'}</label>
                  <select className="form-input" value={nomPhoto} onChange={(e) => setNomPhoto(e.target.value)}>
                    <option value="👨">👨 Male 1</option>
                    <option value="👨‍💼">👨‍💼 Male Official</option>
                    <option value="👩">👩 Female 1</option>
                    <option value="👩‍💼">👩‍💼 Female Official</option>
                    <option value="🧑">🧑 Neutral</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t.formSecDeposit || 'Security Deposit'}</label>
                  <input type="text" className="form-input" value="₹ 25,000" disabled />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t.formTxnNum || 'Transaction Number'}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. TXN9988123" 
                    value={nomTxnNum} 
                    onChange={(e) => setNomTxnNum(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>{t.formPaidDate || 'Payment Date'}</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={nomPaidDate} 
                    onChange={(e) => setNomPaidDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t.formMobile || 'Mobile Number'}</label>
                  <input 
                    type="tel" 
                    maxLength={10} 
                    className="form-input" 
                    placeholder="e.g. 9876543210" 
                    value={nomMobile} 
                    onChange={(e) => setNomMobile(e.target.value.replace(/\D/g, ''))} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>{t.formEmail || 'Email Address'}</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="e.g. candidate@domain.com" 
                    value={nomEmail} 
                    onChange={(e) => setNomEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t.formCommAddress || 'Communication Address'}</label>
                <textarea 
                  className="form-input" 
                  rows={3} 
                  placeholder="e.g. House No. 12, Main Street, Ponnur, Guntur AP"
                  value={nomCommAddress} 
                  onChange={(e) => setNomCommAddress(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>
                ✍️ {t.formSubmitBtn || 'Submit Nomination'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* COMMAND CENTER */}
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
                <span className="stat-value">{filteredBooths.length}</span>
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
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>📊 Real-Time Candidate Tallies {isFiltered && `(${currentElecName})`}</h3>
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
            <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>📹 Live CCTV Booth Surveillance {isFiltered && `(${currentElecName})`}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {filteredBooths.map(b => (
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

      {/* RESULTS DECLARATION */}
      {activeTab === 'results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {winner ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', border: '2px solid rgba(255,215,0,0.4)', background: 'linear-gradient(135deg, rgba(255,215,0,0.05), rgba(79,172,254,0.05))' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆</div>
              <h3 style={{ fontSize: '1.3rem', color: '#fbbf24' }}>ELECTED WINNER {isFiltered && `— ${currentElecName}`}</h3>
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
            <h3 style={{ marginBottom: '1rem' }}>🏆 Official Vote Share & Margin Registry {isFiltered && `(${currentElecName})`}</h3>
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

      {/* ELECTION TYPES TAB */}
      {activeTab === 'election-types' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>📂 {t.electionTypesTab || 'Election Types'}</h2>
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

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>➕ {t.addElectionType || 'Add New Election Type'}</h3>
            <form onSubmit={handleCreateElectionType}>
              <div className="form-row">
                <div className="form-group">
                  <label>{t.elecId || 'Election ID'}</label>
                  <input
                    type="text" className="form-input"
                    placeholder="e.g. sports"
                    value={newElecId}
                    onChange={e => setNewElecId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t.elecName || 'Election Name'}</label>
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
                <label>{t.elecDesc || 'Description'}</label>
                <input
                  type="text" className="form-input"
                  placeholder="e.g. Vote for the president of the community sports club."
                  value={newElecDesc}
                  onChange={e => setNewElecDesc(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                💾 {t.saveElecType || 'Save Election Type'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TIMELINE & SECURITY STATE TAB */}
      {activeTab === 'timeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          <div className="booth-controls-card glass-panel" style={{ gap: '1rem', padding: '2rem' }}>
            <h3 style={{ color: 'var(--warning)' }}>⏱️ {t.timelineSettings || 'Timeline Settings'}</h3>
            <form onSubmit={saveSuperSettings}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>{t.timezoneOffset || 'Timezone'}</label>
                <input type="text" className="form-input" value={timezone} onChange={e => setTimezone(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>{t.pollStart || 'Poll Start'}</label>
                <input type="time" className="form-input" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>{t.pollEnd || 'Poll End'}</label>
                <input type="time" className="form-input" value={endTime} onChange={e => setEndTime(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem' }}>{t.updateConfig || 'Update Config'}</button>
            </form>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t.electionState || 'Election State'}</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: electionStatus === 'ACTIVE' ? 'var(--success)' : 'var(--danger)' }}>{electionStatus}</div>
              </div>
              <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--warning)', color: 'var(--warning)' }} onClick={toggleElectionStatus}>
                {t.toggleLock || 'Toggle Lock'}
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>🧮 {t.cryptoMathCheck || 'Crypto Math Audit'}</h3>
            <div className={`voter-status-alert ${auditResults.allPassed ? 'success' : 'warning'}`} style={{ fontSize: '0.75rem', padding: '0.5rem' }}>
              <strong>{auditResults.allPassed ? '✓ SECURE' : '✗ DISCREPANCY'}</strong>: {t.cryptoMathPassed || 'NET1 = NRT2 Verified'}
            </div>
            <div className="data-table-container" style={{ marginTop: '0' }}>
              <table className="data-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th>{t.candidateCol || 'Candidate'}</th>
                    <th>{t.net1Col || 'NET1'}</th>
                    <th>{t.nrt2Col || 'NRT2'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNominations.filter(n => n.status === 'APPROVED').map(c => {
                    let net1 = 0;
                    filteredBooths.forEach(b => {
                      net1 += filteredPolls.filter(p => p.booth_number === b.booth_number && p.candidate_name === c.name_of_candidate).length;
                    });
                    const nrt2 = filteredPolls.filter(p => p.candidate_name === c.name_of_candidate).length;
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
      )}

      {/* AADHAAR VAULT & ADMINS TAB */}
      {activeTab === 'vault' && (
      <div className="admin-grid-layout" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Voter Aadhaar List */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2>{t.aadhaarVaultTitle || 'Aadhaar Voter Vault'}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              {t.aadhaarVaultDesc || 'Complete voter roll across constituencies.'}
            </p>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.aadhaarNumber || 'Aadhaar Number'}</th>
                    <th>{t.fullName || 'Full Name'}</th>
                    <th>{t.mlaConst || 'Constituency'}</th>
                    <th>{t.dobLabel || 'Date of Birth'}</th>
                    <th>{t.votingState || 'Voting Status'}</th>
                    <th>{t.syncTime || 'Timestamp'}</th>
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
                          {v.has_voted ? (t.voted || 'VOTED') : (t.notVoted || 'NOT VOTED')}
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

          {/* Admin Access Management */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2>🔐 Admin Access Management</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              Create, edit assignment, or remove admin accounts.
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
                  {adminCredentials.filter(c => c.role === 'admin').map((c) => (
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
        </div>

        {/* Right: Timeline quick widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="booth-controls-card glass-panel" style={{ gap: '1rem' }}>
            <h3 style={{ color: 'var(--warning)' }}>{t.timelineSettings || 'Timeline Settings'}</h3>
            <form onSubmit={saveSuperSettings}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>{t.timezoneOffset || 'Timezone'}</label>
                <input type="text" className="form-input" value={timezone} onChange={e => setTimezone(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>{t.pollStart || 'Poll Start'}</label>
                <input type="time" className="form-input" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>{t.pollEnd || 'Poll End'}</label>
                <input type="time" className="form-input" value={endTime} onChange={e => setEndTime(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem' }}>{t.updateConfig || 'Update Config'}</button>
            </form>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t.electionState || 'Election State'}</span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: electionStatus === 'ACTIVE' ? 'var(--success)' : 'var(--danger)' }}>{electionStatus}</div>
              </div>
              <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--warning)', color: 'var(--warning)' }} onClick={toggleElectionStatus}>
                {t.toggleLock || 'Toggle Lock'}
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>{t.cryptoMathCheck || 'Crypto Math Audit'}</h3>
            <div className={`voter-status-alert ${auditResults.allPassed ? 'success' : 'warning'}`} style={{ fontSize: '0.75rem', padding: '0.5rem' }}>
              <strong>{auditResults.allPassed ? '✓ SECURE' : '✗ DISCREPANCY'}</strong>: {t.cryptoMathPassed || 'NET1 = NRT2 Verified'}
            </div>
          </div>
        </div>
      </div>
      )}
    </section>
  );
};

export default SuperAdminPortal;
