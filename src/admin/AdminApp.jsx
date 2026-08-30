import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import SuperAdminPortal from './SuperAdminPortal.jsx';
import '../style.css';

// ─── Shared DB helpers ───────────────────────────────────────────────────────
function getDB(key, defaultData) {
  const data = localStorage.getItem(key);
  if (!data) { localStorage.setItem(key, JSON.stringify(defaultData)); return defaultData; }
  return JSON.parse(data);
}
function setDB(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

const DEFAULT_ELECTION_TYPES = [
  { id: 'general', name: 'General Assembly Elections', desc: 'National/State democratic legislative voting.', subTypes: [{ id: 'mla', name: 'MLA Election' }, { id: 'mp', name: 'MP Election' }] },
  { id: 'banking', name: 'Banking Board Elections', desc: 'Board of directors election for cooperative banks.', subTypes: [{ id: 'chairman', name: 'Chairman' }, { id: 'director', name: 'Director' }] },
  { id: 'college', name: 'College Union Elections', desc: 'Student council representative elections.', subTypes: [{ id: 'president', name: 'President' }, { id: 'secretary', name: 'Secretary' }] }
];

const DEFAULT_NOMINATIONS = [
  { nomination_id: 1, candidate_aadhar_id: '111122223333', name_of_candidate: 'A. Ramu', party_name: 'BJP', party_symbol: '🪷', candidate_photo: '👨', fee_amount: 25000, txn_number: 'TXN001', payment_date: '2026-08-01', mobile: '9876543210', email: 'a.ramu@bjp.org', communication_address: 'Ponnur, Guntur AP', status: 'APPROVED', election_type: 'general' },
  { nomination_id: 2, candidate_aadhar_id: '444455556666', name_of_candidate: 'D. Suresh', party_name: 'CONGRESS-I', party_symbol: '✋', candidate_photo: '👨', fee_amount: 25000, txn_number: 'TXN002', payment_date: '2026-08-02', mobile: '9123456780', email: 'd.suresh@inc.org', communication_address: 'Tenali, Guntur AP', status: 'APPROVED', election_type: 'general' }
];

const DEFAULT_BOOTHS = [
  { booth_number: 'BOOTH-01', location_name: 'Government High School, Room 1', mla_constituency_code: 'AP-094', mp_constituency_code: 'MP-05', camera_id: 'CAM-0192', ip_address: '192.168.10.4', agent_name: 'Inspector Prasad', election_type: 'general' },
  { booth_number: 'BOOTH-02', location_name: 'Community Hall, Gachibowli', mla_constituency_code: 'AP-094', mp_constituency_code: 'MP-05', camera_id: 'CAM-0881', ip_address: '192.168.10.15', agent_name: 'Sub-Inspector Nair', election_type: 'general' }
];

const DEFAULT_VOTERS = [
  { aadhar_id: '111122223333', name: 'Rajesh Kumar', dob: '1985-04-12', mla_constituency: 'AP-094', has_voted: false, vote_timestamp: null },
  { aadhar_id: '444455556666', name: 'Priya Sharma', dob: '1990-07-23', mla_constituency: 'AP-094', has_voted: false, vote_timestamp: null }
];

const TRANSLATIONS_ADMIN = {
  en: {
    nomInbox: 'Nomination Inbox', boothSetup: 'Booth Setup', contRegistry: 'Contestant Registry',
    fileNomBtn: 'File Nomination', candNomInbox: 'Candidate Nomination Inbox',
    nomAuditingDesc: 'Review and audit candidate nominations submitted for this constituency.',
    nomId: 'Nom. ID', candName: 'Candidate', partyAffil: 'Party / Affiliation',
    aadharCard: 'Aadhaar ID', secDeposit: 'Security Deposit', verifStatus: 'Status',
    actControls: 'Actions', approveBtn: 'Approve', rejectBtn: 'Reject', reviewed: 'Reviewed',
    boothAllocTitle: 'Polling Terminal Allocation', boothAllocDesc: 'Configure booths for this election.',
    terminalId: 'Terminal ID', geoLoc: 'Location', constCode: 'Const. Code',
    terminalIp: 'IP Address', cctvCamId: 'CCTV Cam', secOfficer: 'Officer', operState: 'State',
    online: 'ONLINE', registerNewTerminal: 'Register New Polling Terminal',
    terminalIdCode: 'Terminal ID Code', physicalLocName: 'Physical Location Name',
    mlaConstCode: 'MLA Const. Code', terminalSubnetIp: 'Terminal Subnet IP',
    camFeedIdCode: 'Camera Feed ID', saveConfigBtn: 'Save Configuration',
    approvedContestants: 'Approved Contestants', contestantRegistryDesc: 'All approved candidates for this election.',
    ballotId: 'Ballot ID', party: 'Party', symbol: 'Symbol', contactEmail: 'Email', regMobile: 'Mobile',
    formAadharId: 'Aadhaar ID', formCandName: 'Candidate Full Name', formPartyName: 'Party Name',
    formPartySymbol: 'Party Symbol', formPhoto: 'Candidate Photo', formSecDeposit: 'Security Deposit',
    formTxnNum: 'Transaction Number', formPaidDate: 'Payment Date', formMobile: 'Mobile Number',
    formEmail: 'Email Address', formCommAddress: 'Communication Address', formSubmitBtn: 'Submit Nomination',
    formSuccessTitle: 'Nomination Submitted!', formSuccessDesc: 'Your nomination has been submitted and auto-approved.',
    formBackBtn: 'File Another Nomination',
    aadhaarVaultTitle: 'Aadhaar Voter Vault', aadhaarVaultDesc: 'Complete voter roll for this constituency.',
    aadhaarNumber: 'Aadhaar Number', fullName: 'Full Name', mlaConst: 'Constituency',
    dobLabel: 'Date of Birth', votingState: 'Voting Status', syncTime: 'Timestamp',
    voted: 'VOTED', notVoted: 'NOT VOTED',
    electionTypesTab: 'Election Types', addElectionType: 'Add New Election Type',
    elecId: 'Election ID', elecName: 'Election Name', elecDesc: 'Description',
    saveElecType: 'Save Election Type',
    timelineSettings: 'Timeline Settings', timezoneOffset: 'Timezone', pollStart: 'Poll Start',
    pollEnd: 'Poll End', updateConfig: 'Update Config', electionState: 'Election State',
    toggleLock: 'Toggle Lock', cryptoMathCheck: 'Crypto Math Audit', cryptoMathPassed: 'NET1 = NRT2 Verified',
    candidateCol: 'Candidate', net1Col: 'NET1', nrt2Col: 'NRT2'
  }
};

// ─── ELECTION_TYPE_SYMBOLS ───────────────────────────────────────────────────
const ELECTION_TYPE_SYMBOLS = {
  general: [
    { symbol: '🪷', label: 'BJP' }, { symbol: '✋', label: 'INC' }, { symbol: '🛠️', label: 'CPI' },
    { symbol: '🚲', label: 'TDP' }, { symbol: '⚖️', label: 'YSRCP' }, { symbol: '☀️', label: 'DMK' },
    { symbol: '🐘', label: 'BSP' }, { symbol: '🦁', label: 'Independent' }
  ],
  banking: [
    { symbol: '🏦', label: 'Bank A' }, { symbol: '💰', label: 'Finance B' }, { symbol: '📊', label: 'Economy C' },
    { symbol: '🤝', label: 'Cooperative' }, { symbol: '🏛️', label: 'Institution' }, { symbol: '💳', label: 'Credit' }
  ],
  college: [
    { symbol: '🎓', label: 'Scholars' }, { symbol: '📚', label: 'Academics' }, { symbol: '⚽', label: 'Sports' },
    { symbol: '🎭', label: 'Arts' }, { symbol: '🔬', label: 'Science' }, { symbol: '💻', label: 'Tech' }
  ]
};

function getSymbolsForType(type) {
  return ELECTION_TYPE_SYMBOLS[type] || [{ symbol: '⭐', label: 'Candidate' }];
}

// ─── AdminApp ────────────────────────────────────────────────────────────────
function AdminApp() {
  const [session, setSession] = useState(null); // null = not logged in
  const [activeAdminPanel, setActiveAdminPanel] = useState('nominations');

  // Data states
  const [nominations, setNominations] = useState([]);
  const [booths, setBooths] = useState([]);
  const [voters, setVoters] = useState([]);
  const [polls, setPolls] = useState([]);
  const [electionTypes, setElectionTypes] = useState([]);
  const [adminCredentials, setAdminCredentials] = useState(() => {
    const saved = localStorage.getItem('admin_credentials');
    return saved ? JSON.parse(saved) : [
      { username: 'superadmin', password: 'super@123', role: 'superadmin' },
      { username: 'admin', password: 'admin@123', role: 'admin', assignedElectionType: 'general' }
    ];
  });

  // Nomination form states
  const [nomAadhar, setNomAadhar] = useState('');
  const [nomName, setNomName] = useState('');
  const [nomPartyName, setNomPartyName] = useState('');
  const [nomPartySymbol, setNomPartySymbol] = useState('🪷');
  const [nomPhoto, setNomPhoto] = useState('👤');
  const [nomTxnNum, setNomTxnNum] = useState('');
  const [nomPaidDate, setNomPaidDate] = useState(new Date().toISOString().split('T')[0]);
  const [nomMobile, setNomMobile] = useState('');
  const [nomEmail, setNomEmail] = useState('');
  const [nomCommAddress, setNomCommAddress] = useState('');
  const [nomSuccess, setNomSuccess] = useState(false);

  // Booth form states
  const [newBoothId, setNewBoothId] = useState('');
  const [newBoothLocation, setNewBoothLocation] = useState('');
  const [newBoothIp, setNewBoothIp] = useState('');
  const [newBoothCamera, setNewBoothCamera] = useState('');

  // Super Admin form states
  const [newElecId, setNewElecId] = useState('');
  const [newElecName, setNewElecName] = useState('');
  const [newElecDesc, setNewElecDesc] = useState('');
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminElec, setNewAdminElec] = useState('general');
  const [newAdminSubElec, setNewAdminSubElec] = useState(''); // sub-type for admin assignment
  const [adminSetupMsg, setAdminSetupMsg] = useState('');
  const [timezone, setTimezone] = useState('GMT+5:30');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('18:00');
  const [electionStatus, setElectionStatus] = useState('ACTIVE');
  const [auditResults, setAuditResults] = useState({ allPassed: true, rows: null });

  // Derive activeElectionType and activeSubType from session
  const activeElectionType = session?.assignedElectionType || 'general';
  const activeSubType = session?.assignedSubType || null;
  const activeSubTypeName = session?.assignedSubTypeName || null;

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_session');
    if (saved) setSession(JSON.parse(saved));

    // Load data
    setNominations(getDB('nominations_db', DEFAULT_NOMINATIONS));
    setBooths(getDB('booths_db', DEFAULT_BOOTHS));
    setVoters(getDB('voters_db', DEFAULT_VOTERS));
    setPolls(getDB('polls_db', []));
    setElectionTypes(getDB('election_types_db', DEFAULT_ELECTION_TYPES));
  }, []);

  const handleLogin = (cred) => {
    setSession(cred);
    if (cred.role === 'admin' && cred.assignedElectionType) {
      const firstSym = getSymbolsForType(cred.assignedElectionType)[0];
      if (firstSym) setNomPartySymbol(firstSym.symbol);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_session');
    setSession(null);
  };

  const auditNomination = (id, status) => {
    const updated = nominations.map(n => n.nomination_id === id ? { ...n, status } : n);
    setNominations(updated);
    setDB('nominations_db', updated);
  };

  const submitNomination = (e) => {
    e.preventDefault();
    if (!/^\d{12}$/.test(nomAadhar)) { alert('Aadhaar must be exactly 12 digits.'); return; }
    const newNom = {
      nomination_id: Date.now(),
      candidate_aadhar_id: nomAadhar,
      name_of_candidate: nomName,
      party_name: nomPartyName,
      party_symbol: nomPartySymbol,
      candidate_photo: nomPhoto,
      fee_amount: 25000,
      txn_number: nomTxnNum,
      payment_date: nomPaidDate,
      mobile: nomMobile,
      email: nomEmail,
      communication_address: nomCommAddress,
      status: 'APPROVED',
      election_type: activeElectionType
    };
    const updated = [...nominations, newNom];
    setNominations(updated);
    setDB('nominations_db', updated);
    setNomSuccess(true);
    setNomAadhar(''); setNomName(''); setNomPartyName(''); setNomTxnNum(''); setNomMobile(''); setNomEmail(''); setNomCommAddress('');
  };

  const createNewBooth = (e) => {
    e.preventDefault();
    const newBooth = {
      booth_number: newBoothId, location_name: newBoothLocation,
      mla_constituency_code: 'AP-094', mp_constituency_code: 'MP-05',
      camera_id: newBoothCamera, ip_address: newBoothIp,
      agent_name: 'TBD', election_type: activeElectionType
    };
    const updated = [...booths, newBooth];
    setBooths(updated);
    setDB('booths_db', updated);
    setNewBoothId(''); setNewBoothLocation(''); setNewBoothIp(''); setNewBoothCamera('');
  };

  const handleCreateElectionType = (e) => {
    e.preventDefault();
    if (electionTypes.some(et => et.id === newElecId)) { alert('Election type ID already exists.'); return; }
    const updated = [...electionTypes, { id: newElecId, name: newElecName, desc: newElecDesc, subTypes: [] }];
    setElectionTypes(updated);
    setDB('election_types_db', updated);
    setNewElecId(''); setNewElecName(''); setNewElecDesc('');
  };

  // Add a sub-type to an EXISTING election type
  const addSubTypeToExisting = (elecTypeId, subId, subName) => {
    const updated = electionTypes.map(et => {
      if (et.id !== elecTypeId) return et;
      const existing = et.subTypes || [];
      if (existing.some(s => s.id === subId)) { alert('Sub-type ID already exists for this election type.'); return et; }
      return { ...et, subTypes: [...existing, { id: subId, name: subName }] };
    });
    setElectionTypes(updated);
    setDB('election_types_db', updated);
  };

  // Remove an existing admin account
  const removeAdmin = (username) => {
    if (!window.confirm(`Remove admin "${username}"? This cannot be undone.`)) return;
    const updated = adminCredentials.filter(c => c.username !== username);
    setAdminCredentials(updated);
    localStorage.setItem('admin_credentials', JSON.stringify(updated));
  };

  // Update an existing admin's election type + sub-type assignment
  const updateAdminAccess = (username, newElecType, newSubType) => {
    const elType = electionTypes.find(et => et.id === newElecType);
    const subTypeObj = (elType?.subTypes || []).find(s => s.id === newSubType);
    const updated = adminCredentials.map(c => {
      if (c.username !== username) return c;
      return {
        ...c,
        assignedElectionType: newElecType,
        assignedSubType: newSubType || null,
        assignedSubTypeName: subTypeObj?.name || null
      };
    });
    setAdminCredentials(updated);
    localStorage.setItem('admin_credentials', JSON.stringify(updated));
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (adminCredentials.some(c => c.username === newAdminUser.trim())) {
      setAdminSetupMsg('Error: Username already exists!'); return;
    }
    const subTypeLabel = newAdminSubElec
      ? (electionTypes.find(et => et.id === newAdminElec)?.subTypes || []).find(s => s.id === newAdminSubElec)?.name || newAdminSubElec
      : null;
    const updated = [...adminCredentials, {
      username: newAdminUser.trim(), password: newAdminPass,
      role: 'admin', assignedElectionType: newAdminElec,
      assignedSubType: newAdminSubElec || null,
      assignedSubTypeName: subTypeLabel || null
    }];
    setAdminCredentials(updated);
    localStorage.setItem('admin_credentials', JSON.stringify(updated));
    const subMsg = newAdminSubElec ? ` (Sub-type: ${subTypeLabel})` : '';
    setAdminSetupMsg(`Success: Admin '${newAdminUser}' created for ${newAdminElec}${subMsg}!`);
    setNewAdminUser(''); setNewAdminPass(''); setNewAdminSubElec('');
    setTimeout(() => setAdminSetupMsg(''), 5000);
  };

  const saveSuperSettings = (e) => {
    e.preventDefault();
    alert(`Settings saved: Timezone ${timezone}, ${startTime} - ${endTime}`);
  };

  const toggleElectionStatus = () => {
    setElectionStatus(s => s === 'ACTIVE' ? 'LOCKED' : 'ACTIVE');
  };

  const triggerSimulation = () => {
    const approved = nominations.filter(n => (n.election_type || 'general') === activeElectionType);
    if (approved.length === 0) {
      alert('Please approve at least one candidate nomination to run the simulation.');
      return;
    }
    const currentPolls = getDB('polls_db', []);
    const newSimVotes = [];
    const now = new Date();

    for (let i = 0; i < 25; i++) {
      const randomCand = approved[Math.floor(Math.random() * approved.length)];
      const randomBooth = booths.length > 0 ? booths[Math.floor(Math.random() * booths.length)].booth_number : 'BOOTH-01';
      newSimVotes.push({
        poll_id: Date.now() + i,
        booth_number: randomBooth,
        candidate_id: randomCand.nomination_id,
        candidate_name: randomCand.name_of_candidate,
        party_name: randomCand.party_name,
        mla_constituency: 'AP-094',
        vote_time: new Date(now.getTime() - Math.floor(Math.random() * 3600000)).toLocaleTimeString(),
        election_type: activeElectionType
      });
    }

    const updatedPolls = [...currentPolls, ...newSimVotes];
    setPolls(updatedPolls);
    setDB('polls_db', updatedPolls);
    alert('Simulated 25 votes successfully recorded into the database!');
  };

  const resetSimulation = () => {
    if (confirm('Are you sure you want to clear all votes and reset the election system?')) {
      setDB('polls_db', []);
      setPolls([]);
      const resetVoters = voters.map(v => ({ ...v, has_voted: false, vote_timestamp: null }));
      setVoters(resetVoters);
      setDB('voters_db', resetVoters);
      alert('Simulation reset complete. Database cleared.');
    }
  };

  const t = TRANSLATIONS_ADMIN.en;

  // ─── Not logged in → show login ──────────────────────────────────────────
  if (!session) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // ─── Admin Dashboard ─────────────────────────────────────────────────────
  if (session.role === 'admin') {
    return (
      <div className="app-container">
        {/* Mini header for admin */}
        <header className="app-header" style={{ padding: '0.75rem 1.5rem' }}>
          <div className="logo-section">
            <div className="logo-icon">AV</div>
            <div className="logo-text">
              <h1 style={{ fontSize: '1rem' }}>Admin Dashboard</h1>
              <p style={{ fontSize: '0.7rem' }}>
                Logged in as: <strong style={{ color: 'var(--success)' }}>{session.username}</strong>
                &nbsp;|&nbsp; Election: <strong style={{ color: 'var(--primary)' }}>{activeElectionType.toUpperCase()}</strong>
                {activeSubTypeName && (
                  <>
                    &nbsp;›&nbsp;
                    <span style={{
                      background: 'rgba(0,176,255,0.15)', color: 'var(--secondary)',
                      padding: '1px 7px', borderRadius: '10px', fontSize: '0.68rem', fontWeight: 700
                    }}>🏷️ {activeSubTypeName}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-btn simulate" onClick={triggerSimulation} title="Simulate 25 Votes">
              <span>⚡ Simulate 25 Votes</span>
            </button>
            <button className="header-btn reset" onClick={resetSimulation} title="Reset Database">
              <span>🔄 Reset System</span>
            </button>
            <a href="/" style={{ textDecoration: 'none' }}>
              <button className="header-btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                🗳️ Polling Kiosk
              </button>
            </a>
            <button className="header-btn" onClick={handleLogout}
              style={{ background: 'rgba(255,23,68,0.15)', border: '1px solid rgba(255,23,68,0.4)', color: 'var(--danger)' }}>
              🚪 Logout
            </button>
          </div>
        </header>
        <main className="app-content">
          <AdminDashboard
            t={t}
            adminPanel={activeAdminPanel}
            switchAdminPanel={setActiveAdminPanel}
            nominations={nominations}
            activeElectionType={activeElectionType}
            auditNomination={auditNomination}
            booths={booths}
            createNewBooth={createNewBooth}
            newBoothId={newBoothId} setNewBoothId={setNewBoothId}
            newBoothLocation={newBoothLocation} setNewBoothLocation={setNewBoothLocation}
            newBoothIp={newBoothIp} setNewBoothIp={setNewBoothIp}
            newBoothCamera={newBoothCamera} setNewBoothCamera={setNewBoothCamera}
            nomSuccess={nomSuccess} setNomSuccess={setNomSuccess}
            submitNomination={submitNomination}
            nomAadhar={nomAadhar} setNomAadhar={setNomAadhar}
            nomName={nomName} setNomName={setNomName}
            nomPartyName={nomPartyName} setNomPartyName={setNomPartyName}
            nomPartySymbol={nomPartySymbol} setNomPartySymbol={setNomPartySymbol}
            getSymbolsForType={getSymbolsForType}
            nomPhoto={nomPhoto} setNomPhoto={setNomPhoto}
            nomTxnNum={nomTxnNum} setNomTxnNum={setNomTxnNum}
            nomPaidDate={nomPaidDate} setNomPaidDate={setNomPaidDate}
            nomMobile={nomMobile} setNomMobile={setNomMobile}
            nomEmail={nomEmail} setNomEmail={setNomEmail}
            nomCommAddress={nomCommAddress} setNomCommAddress={setNomCommAddress}
            polls={polls}
            voters={voters}
          />
        </main>
      </div>
    );
  }

  // ─── Super Admin Portal ───────────────────────────────────────────────────
  return (
    <div className="app-container">
      {/* Mini header for super admin */}
      <header className="app-header" style={{ padding: '0.75rem 1.5rem' }}>
        <div className="logo-section">
          <div className="logo-icon">AV</div>
          <div className="logo-text">
            <h1 style={{ fontSize: '1rem' }}>👑 Super Admin Portal</h1>
            <p style={{ fontSize: '0.7rem' }}>
              Logged in as: <strong style={{ color: 'var(--warning)' }}>{session.username}</strong>
              &nbsp;|&nbsp; <span style={{ color: 'var(--warning)' }}>Full Access</span>
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button className="header-btn simulate" onClick={triggerSimulation} title="Simulate 25 Votes">
            <span>⚡ Simulate 25 Votes</span>
          </button>
          <button className="header-btn reset" onClick={resetSimulation} title="Reset Database">
            <span>🔄 Reset System</span>
          </button>
          {/* Election type switcher for super admin */}
          <select
            value={activeElectionType}
            onChange={() => {}}
            className="form-input"
            style={{
              padding: '0.4rem 1.5rem 0.4rem 0.75rem', width: 'auto',
              fontSize: '0.75rem', borderRadius: '20px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
              color: '#fff', cursor: 'pointer', marginRight: '8px'
            }}
          >
            {electionTypes.map(et => (
              <option key={et.id} value={et.id}>🗳️ {et.name}</option>
            ))}
          </select>
          <a href="/" style={{ textDecoration: 'none' }}>
            <button className="header-btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
              🗳️ Polling Kiosk
            </button>
          </a>
          <button className="header-btn" onClick={handleLogout}
            style={{ background: 'rgba(255,23,68,0.15)', border: '1px solid rgba(255,23,68,0.4)', color: 'var(--danger)' }}>
            🚪 Logout
          </button>
        </div>
      </header>
      <main className="app-content">
        <SuperAdminPortal
          t={t}
          voters={voters}
          electionTypes={electionTypes}
          newElecId={newElecId} setNewElecId={setNewElecId}
          newElecName={newElecName} setNewElecName={setNewElecName}
          newElecDesc={newElecDesc} setNewElecDesc={setNewElecDesc}
          addSubTypeToExisting={addSubTypeToExisting}
          handleCreateElectionType={handleCreateElectionType}
          adminCredentials={adminCredentials}
          newAdminUser={newAdminUser} setNewAdminUser={setNewAdminUser}
          newAdminPass={newAdminPass} setNewAdminPass={setNewAdminPass}
          newAdminElec={newAdminElec} setNewAdminElec={setNewAdminElec}
          newAdminSubElec={newAdminSubElec} setNewAdminSubElec={setNewAdminSubElec}
          adminSetupMsg={adminSetupMsg}
          handleCreateAdmin={handleCreateAdmin}
          removeAdmin={removeAdmin}
          updateAdminAccess={updateAdminAccess}
          timezone={timezone} setTimezone={setTimezone}
          startTime={startTime} setStartTime={setStartTime}
          endTime={endTime} setEndTime={setEndTime}
          saveSuperSettings={saveSuperSettings}
          electionStatus={electionStatus}
          toggleElectionStatus={toggleElectionStatus}
          auditResults={auditResults}
          nominations={nominations}
          booths={booths}
          polls={polls}
        />
      </main>
    </div>
  );
}

export default AdminApp;
