import React from 'react';

const AdminDashboard = ({
  t,
  adminPanel,
  switchAdminPanel,
  nominations,
  activeElectionType,
  auditNomination,
  booths,
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
  nomCommAddress, setNomCommAddress,
  polls = [],
  voters = []
}) => {
  const getCandidateTallies = () => {
    const approved = nominations.filter(n => (n.election_type || 'general') === activeElectionType);
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
    <section id="admin-view" className="view-section active">
      <div className="admin-grid-layout">
        <div className="admin-sidebar glass-panel">
          <h2 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Constituency Panel</h2>
          <button className={`admin-menu-btn ${adminPanel === 'nominations' ? 'active' : ''}`} onClick={() => switchAdminPanel('nominations')}>📂 {t.nomInbox || 'Nomination Inbox'}</button>
          <button className={`admin-menu-btn ${adminPanel === 'booths' ? 'active' : ''}`} onClick={() => switchAdminPanel('booths')}>🏢 {t.boothSetup || 'Booth Setup'}</button>
          <button className={`admin-menu-btn ${adminPanel === 'contestants' ? 'active' : ''}`} onClick={() => switchAdminPanel('contestants')}>🗂️ {t.contRegistry || 'Contestant Registry'}</button>
          <button className={`admin-menu-btn ${adminPanel === 'file-nomination' ? 'active' : ''}`} onClick={() => { switchAdminPanel('file-nomination'); setNomSuccess(false); }}>✍️ {t.fileNomBtn || 'File Nomination'}</button>
          <button className={`admin-menu-btn ${adminPanel === 'command-center' ? 'active' : ''}`} onClick={() => switchAdminPanel('command-center')}>📽️ {t.commandCenter || 'ECI Live Command Center'}</button>
          <button className={`admin-menu-btn ${adminPanel === 'results-declaration' ? 'active' : ''}`} onClick={() => switchAdminPanel('results-declaration')}>🏆 {t.resDecl || 'Results Declaration'}</button>
        </div>

        <div className="glass-panel admin-panel-content">
          {adminPanel === 'nominations' && (
            <div className="admin-panel-section active">
              <h2>{t.candNomInbox || 'Candidate Nomination Inbox'}</h2>
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
                    {nominations.filter(n => (n.election_type || 'general') === activeElectionType).map(n => (
                      <tr key={n.nomination_id}>
                        <td>{n.nomination_id}</td>
                        <td><strong>{n.name_of_candidate}</strong></td>
                        <td>{n.party_name} ({n.party_symbol})</td>
                        <td>{n.candidate_aadhar_id}</td>
                        <td>₹{n.fee_amount.toLocaleString()}</td>
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
                            <>
                              <button className="btn btn-success" style={{ padding: '4px 10px', fontSize: '0.75rem', marginRight: '5px' }} onClick={() => auditNomination(n.nomination_id, 'APPROVED')}>{t.approveBtn || 'Approve'}</button>
                              <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => auditNomination(n.nomination_id, 'REJECTED')}>{t.rejectBtn || 'Reject'}</button>
                            </>
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

          {adminPanel === 'booths' && (
            <div className="admin-panel-section active">
              <h2>{t.boothAllocTitle || 'Polling Terminal Allocation'}</h2>
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
                    {booths.filter(b => (b.election_type || 'general') === activeElectionType).map(b => (
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

          {adminPanel === 'contestants' && (
            <div className="admin-panel-section active">
              <h2>{t.approvedContestants || 'Approved Contestants'}</h2>
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
                    {nominations.filter(n => n.status === 'APPROVED' && (n.election_type || 'general') === activeElectionType)
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

          {adminPanel === 'file-nomination' && (
            <div className="admin-panel-section active" style={{ maxWidth: '700px' }}>
              <h2>✍️ {t.fileNomBtn || 'File Nomination'}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                Fill in candidate details to submit a new nomination profile.
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
                        {getSymbolsForType(activeElectionType).map((s, i) => (
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

          {adminPanel === 'command-center' && (
            <div className="admin-panel-section active">
              <h2>📽️ {t.commandCenter || 'ECI Live Command Center'}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                Real-time election oversight, automated voter tallies, and polling booth surveillance.
              </p>

              <div className="analytics-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
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

              {/* Live Tallies */}
              <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>📊 Real-Time Candidate Tallies</h3>
                <div className="tallies-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

              {/* CCTV Grid */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>📹 Live CCTV Booth Surveillance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {booths.map(b => (
                    <div key={b.booth_number} className="cctv-card" style={{ background: '#020617', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px' }}>
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

          {adminPanel === 'results-declaration' && (
            <div className="admin-panel-section active">
              <h2>🏆 {t.resDecl || 'Results Declaration'}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                Official Election Commission results, victory margins, and tally audit certificate.
              </p>

              {winner ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem', border: '2px solid rgba(255,215,0,0.4)', background: 'linear-gradient(135deg, rgba(255,215,0,0.05), rgba(79,172,254,0.05))' }}>
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
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No votes recorded yet. Start simulation or polling to view official results.</p>
                </div>
              )}

              {/* Tally Table */}
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
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
