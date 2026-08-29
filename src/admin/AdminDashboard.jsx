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
  nomCommAddress, setNomCommAddress
}) => {
  return (
    <section id="admin-view" className="view-section active">
      <div className="admin-grid-layout">
        <div className="admin-sidebar glass-panel">
          <h2 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Constituency Panel</h2>
          <button className={`admin-menu-btn ${adminPanel === 'nominations' ? 'active' : ''}`} onClick={() => switchAdminPanel('nominations')}>📂 {t.nomInbox}</button>
          <button className={`admin-menu-btn ${adminPanel === 'booths' ? 'active' : ''}`} onClick={() => switchAdminPanel('booths')}>🏢 {t.boothSetup}</button>
          <button className={`admin-menu-btn ${adminPanel === 'contestants' ? 'active' : ''}`} onClick={() => switchAdminPanel('contestants')}>🗂️ {t.contRegistry}</button>
          <button className={`admin-menu-btn ${adminPanel === 'file-nomination' ? 'active' : ''}`} onClick={() => { switchAdminPanel('file-nomination'); setNomSuccess(false); }}>✍️ {t.fileNomBtn}</button>
        </div>

        <div className="glass-panel admin-panel-content">
          {adminPanel === 'nominations' && (
            <div className="admin-panel-section active">
              <h2>{t.candNomInbox}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                {t.nomAuditingDesc}
              </p>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.nomId}</th>
                      <th>{t.candName}</th>
                      <th>{t.partyAffil}</th>
                      <th>{t.aadharCard}</th>
                      <th>{t.secDeposit}</th>
                      <th>{t.verifStatus}</th>
                      <th>{t.actControls}</th>
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
                              <button className="btn btn-success" style={{ padding: '4px 10px', fontSize: '0.75rem', marginRight: '5px' }} onClick={() => auditNomination(n.nomination_id, 'APPROVED')}>{t.approveBtn}</button>
                              <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => auditNomination(n.nomination_id, 'REJECTED')}>{t.rejectBtn}</button>
                            </>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.reviewed}</span>
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
              <h2>{t.boothAllocTitle}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                {t.boothAllocDesc}
              </p>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.terminalId}</th>
                      <th>{t.geoLoc}</th>
                      <th>{t.constCode}</th>
                      <th>{t.terminalIp}</th>
                      <th>{t.cctvCamId}</th>
                      <th>{t.secOfficer}</th>
                      <th>{t.operState}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booths.filter(b => (b.election_type || 'general') === activeElectionType).map(b => (
                      <tr key={b.booth_number}>
                        <td><strong>{b.booth_number}</strong></td>
                        <td>{b.location_name}</td>
                        <td>{b.mla_constituency_code} / {b.mp_constituency_code}</td>
                        <td>{b.ip_address}</td>
                        <td><code style={{ color: 'var(--secondary)' }}>{b.camera_id}</code></td>
                        <td>{b.agent_name}</td>
                        <td><span style={{ color: 'var(--success)', fontWeight: 'bold' }}>● {t.online}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '1rem' }}>{t.registerNewTerminal}</h3>
                <form onSubmit={createNewBooth}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.terminalIdCode}</label>
                      <input type="text" className="form-input" placeholder="e.g. BOOTH-04 (MPS)" value={newBoothId} onChange={(e) => setNewBoothId(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>{t.physicalLocName}</label>
                      <input type="text" className="form-input" placeholder="e.g. Government Junior College Room 2" value={newBoothLocation} onChange={(e) => setNewBoothLocation(e.target.value)} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.mlaConstCode}</label>
                      <input type="text" className="form-input" value="AP-094" readOnly required />
                    </div>
                    <div className="form-group">
                      <label>{t.terminalSubnetIp}</label>
                      <input type="text" className="form-input" placeholder="e.g. 192.168.10.8" value={newBoothIp} onChange={(e) => setNewBoothIp(e.target.value)} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t.camFeedIdCode}</label>
                    <input type="text" className="form-input" placeholder="e.g. CAM-0922" value={newBoothCamera} onChange={(e) => setNewBoothCamera(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary">{t.saveConfigBtn}</button>
                </form>
              </div>
            </div>
          )}

          {adminPanel === 'contestants' && (
            <div className="admin-panel-section active">
              <h2>{t.approvedContestants}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                {t.contestantRegistryDesc}
              </p>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t.ballotId}</th>
                      <th>{t.candName}</th>
                      <th>{t.party}</th>
                      <th>{t.symbol}</th>
                      <th>{t.contactEmail}</th>
                      <th>{t.regMobile}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nominations.filter(n => n.status === 'APPROVED' && (n.election_type || 'general') === activeElectionType).map(c => (
                      <tr key={c.nomination_id}>
                        <td>CAN-AP094-0{c.nomination_id}</td>
                        <td><strong>{c.name_of_candidate}</strong></td>
                        <td>{c.party_name}</td>
                        <td><span style={{ fontSize: '1.5rem' }}>{c.party_symbol}</span></td>
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
            <div className="admin-panel-section active">
              <h2>✍️ {t.fileNomBtn}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                File a new candidate nomination for Ponnur MLA (AP-094) constituency. Verify Aadhaar details and security deposit payment before submitting.
              </p>

              {nomSuccess ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '1px solid var(--success)' }}>
                  <div style={{ fontSize: '3rem' }}>🎉</div>
                  <h3 style={{ color: 'var(--success)' }}>{t.formSuccessTitle}</h3>
                  <p style={{ maxWidth: '500px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {t.formSuccessDesc}
                  </p>
                  <button className="btn btn-outline" onClick={() => setNomSuccess(false)} style={{ marginTop: '0.5rem' }}>
                    🔄 {t.formBackBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={submitNomination}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.formAadharId}</label>
                      <input 
                        type="text" 
                        maxLength={12}
                        className="form-input" 
                        placeholder="e.g. 222233334444" 
                        value={nomAadhar} 
                        onChange={(e) => setNomAadhar(e.target.value.replace(/\D/g, ''))} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.formCandName}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Y. S. Jagan" 
                        value={nomName} 
                        onChange={(e) => setNomName(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.formPartyName}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. YSRCP" 
                        value={nomPartyName} 
                        onChange={(e) => setNomPartyName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.formPartySymbol}</label>
                      <select 
                        className="form-input" 
                        value={nomPartySymbol} 
                        onChange={(e) => setNomPartySymbol(e.target.value)} 
                        required
                      >
                        {getSymbolsForType(activeElectionType).map(s => (
                          <option key={s.symbol} value={s.symbol}>{s.symbol} {s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.formPhoto}</label>
                      <select 
                        className="form-input" 
                        value={nomPhoto} 
                        onChange={(e) => setNomPhoto(e.target.value)} 
                        required
                      >
                        <option value="👤">👤 Default Male Avatar</option>
                        <option value="👩">👩 Default Female Avatar</option>
                        <option value="👨">👨 Male Politician</option>
                        <option value="👵">👵 Female Politician</option>
                        <option value="✊">✊ Fist Up Avatar</option>
                        <option value="🎓">🎓 Scholar Politician</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{t.formSecDeposit}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value="₹25,000" 
                        readOnly 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{t.formTxnNum}</label>
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
                      <label>{t.formPaidDate}</label>
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
                      <label>{t.formMobile}</label>
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
                      <label>{t.formEmail}</label>
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
                    <label>{t.formCommAddress}</label>
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
                    ✍️ {t.formSubmitBtn}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
