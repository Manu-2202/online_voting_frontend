// ==========================================
// 1. DATABASE SEEDING & HYBRID STATE DEFAULTS
// ==========================================

const DEFAULT_VOTERS = [
    { aadhar_id: '123456789012', name: 'Rahul Sharma', address: 'Plot 45, Jubilee Hills, Hyderabad, AP-094', dob: '1990-05-14', fingerprint_hash: 'FP_RAHUL_9081', iris_hash: 'IRIS_RAHUL_4421', has_voted: false, vote_timestamp: null, mla_constituency: 'AP-094', mp_constituency: 'MP-05' },
    { aadhar_id: '987654321098', name: 'Priya Patel', address: 'Flat 102, Gachibowli, Hyderabad, AP-094', dob: '1995-11-22', fingerprint_hash: 'FP_PRIYA_3321', iris_hash: 'IRIS_PRIYA_8812', has_voted: false, vote_timestamp: null, mla_constituency: 'AP-094', mp_constituency: 'MP-05' },
    { aadhar_id: '111122223333', name: 'Amit Kumar', address: 'Ward 3, Nizamabad, AP-094', dob: '1988-02-09', fingerprint_hash: 'FP_AMIT_7751', iris_hash: 'IRIS_AMIT_1123', has_voted: true, vote_timestamp: '2026-08-29T10:15:30Z', mla_constituency: 'AP-094', mp_constituency: 'MP-05' },
    { aadhar_id: '444455556666', name: 'Sarah D Souza', address: 'Secunderabad Cantonment, AP-094', dob: '1992-08-30', fingerprint_hash: 'FP_SARAH_0091', iris_hash: 'IRIS_SARAH_9941', has_voted: false, vote_timestamp: null, mla_constituency: 'AP-094', mp_constituency: 'MP-05' },
    { aadhar_id: '777788889999', name: 'Rajesh Rao', address: 'Khammam Central, TS-012', dob: '1985-04-17', fingerprint_hash: 'FP_RAJESH_8123', iris_hash: 'IRIS_RAJESH_0098', has_voted: false, mla_constituency: 'TS-012', mp_constituency: 'MP-02' }
];

const DEFAULT_NOMINATIONS = [
    { nomination_id: 1, candidate_aadhar_id: '222233334444', name_of_candidate: 'A. Ramu', party_name: 'BJP', party_symbol: '🪷', candidate_photo: 'AR', fee_amount: 25000, paid_date: '2026-08-10', transaction_number: 'TXN88921', mobile: '9988776655', email: 'ramu@bjp.org', communication_address: 'Visakhapatnam AP', status: 'APPROVED' },
    { nomination_id: 2, candidate_aadhar_id: '555566667777', name_of_candidate: 'D. Suresh', party_name: 'CONGRESS-I', party_symbol: '✋', candidate_photo: 'DS', fee_amount: 25000, paid_date: '2026-08-12', transaction_number: 'TXN91882', mobile: '9848012345', email: 'suresh@congress.in', communication_address: 'Vijayawada AP', status: 'APPROVED' },
    { nomination_id: 3, candidate_aadhar_id: '888899990000', name_of_candidate: 'M. Naresh', party_name: 'CPI', party_symbol: '🛠️', candidate_photo: 'MN', fee_amount: 25000, paid_date: '2026-08-14', transaction_number: 'TXN11209', mobile: '9440123456', email: 'naresh@cpi.org', communication_address: 'Guntur AP', status: 'APPROVED' },
    { nomination_id: 4, candidate_aadhar_id: '999900001111', name_of_candidate: 'K. Rao', party_name: 'TDP', party_symbol: '🚲', candidate_photo: 'KR', fee_amount: 25000, paid_date: '2026-08-18', transaction_number: 'TXN50442', mobile: '9177283921', email: 'rao@tdp.org', communication_address: 'Tirupati AP', status: 'PENDING' }
];

const DEFAULT_BOOTHS = [
    { booth_number: 'BOOTH-01', location_name: 'Government High School, Room 1', mla_constituency_code: 'AP-094', mp_constituency_code: 'MP-05', camera_id: 'CAM-0192', ip_address: '192.168.10.4', agent_name: 'Inspector Prasad' },
    { booth_number: 'BOOTH-02', location_name: 'Community Hall, Gachibowli', mla_constituency_code: 'AP-094', mp_constituency_code: 'MP-05', camera_id: 'CAM-0881', ip_address: '192.168.10.15', agent_name: 'Sub-Inspector Nair' },
    { booth_number: 'BOOTH-03 (MPS)', location_name: 'Mobile Van 1 (Armed Escorted)', mla_constituency_code: 'AP-094', mp_constituency_code: 'MP-05', camera_id: 'CAM-0552', ip_address: '10.120.45.101', agent_name: 'Commander Das' }
];

const DEFAULT_POLLS = [
    { id: 1, booth_number: 'BOOTH-01', candidate_name: 'A. Ramu', party_name: 'BJP', mla_constituency: 'AP-094', vote_time: '2026-08-29T08:14:02Z' },
    { id: 2, booth_number: 'BOOTH-01', candidate_name: 'D. Suresh', party_name: 'CONGRESS-I', mla_constituency: 'AP-094', vote_time: '2026-08-29T08:25:40Z' },
    { id: 3, booth_number: 'BOOTH-02', candidate_name: 'A. Ramu', party_name: 'BJP', mla_constituency: 'AP-094', vote_time: '2026-08-29T08:33:11Z' }
];

function getDB(key, defaultData) {
    const data = localStorage.getItem(key);
    if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(data);
}

function setDB(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// In-Memory dataset caching
let voters = [];
let nominations = [];
let booths = [];
let polls = [];

// ==========================================
// 2. STATE MACHINE CONFIGURATION
// ==========================================

let state = {
    activeTab: 'voter', 
    adminPanel: 'nominations', 
    usingBackend: false,
    
    // Voter Flow States
    currentVoter: null,
    scannedBiometric: false,
    entryDoorOpen: false,
    selectedCandidate: null,
    votingStep: 'auth-required', 
    exitDoorOpen: false,
    
    // Global parameters
    timezone: 'GMT+5:30',
    startTime: '07:00',
    endTime: '18:00',
    electionStatus: 'ACTIVE'
};

// ==========================================
// 3. UI RENDERING ENGINE & ACTIONS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
});

async function initApp() {
    await syncData();
    addSysLog('Electoral System initialized.', 'info');
}

async function syncData() {
    try {
        const res = await fetch('/api/settings');
        if (res.ok) {
            const settings = await res.json();
            state.timezone = settings.timezone || 'GMT+5:30';
            state.startTime = settings.start_time || '07:00';
            state.endTime = settings.end_time || '18:00';
            state.electionStatus = settings.status || 'ACTIVE';
            
            voters = await (await fetch('/api/voters')).json();
            nominations = await (await fetch('/api/nominations')).json();
            booths = await (await fetch('/api/booths')).json();
            polls = await (await fetch('/api/polls')).json();
            
            if (!state.usingBackend) {
                state.usingBackend = true;
                addSysLog('Link established: Flask SQLite database backend connected.', 'success');
            }
        } else {
            throw new Error('API returned error status');
        }
    } catch (e) {
        state.usingBackend = false;
        voters = getDB('voters_db', DEFAULT_VOTERS);
        nominations = getDB('nominations_db', DEFAULT_NOMINATIONS);
        booths = getDB('booths_db', DEFAULT_BOOTHS);
        polls = getDB('polls_db', DEFAULT_POLLS);
        
        addSysLog('Running in offline LocalStorage fallback mode.', 'warning');
    }
    renderAll();
}

function setupEventListeners() {
    // Navigation Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const role = e.currentTarget.dataset.role;
            state.activeTab = role;
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(`${role}-view`).classList.add('active');
            
            addSysLog(`Switched view panel to: ${role.toUpperCase()}`, 'info');
            syncData();
        });
    });
}

function renderAll() {
    if (state.activeTab === 'voter') {
        renderVoterSection();
    } else if (state.activeTab === 'admin') {
        renderAdminSection();
    } else if (state.activeTab === 'super-admin') {
        renderSuperAdminSection();
    } else if (state.activeTab === 'observer') {
        renderObserverSection();
    }
}

// ==========================================
// 4. VOTER FLOW CONTROLLER (THE SIMULATOR)
// ==========================================

function renderVoterSection() {
    const selector = document.getElementById('voter-identity-select');
    if (selector) {
        let optionsHtml = '<option value="">Select Voter Identity Profile...</option>';
        voters.forEach(v => {
            optionsHtml += `<option value="${v.aadhar_id}">${v.name} (${v.aadhar_id}) - ${v.has_voted ? 'Voted' : 'Not Voted'}</option>`;
        });
        selector.innerHTML = optionsHtml;
        if (state.currentVoter) {
            selector.value = state.currentVoter.aadhar_id;
        }
    }

    const redLight = document.getElementById('red-light');
    const greenLight = document.getElementById('green-light');
    const entryGate = document.getElementById('entry-gate');
    const exitGate = document.getElementById('exit-gate');
    
    if (state.votingStep === 'auth-required') {
        redLight.classList.remove('active');
        greenLight.classList.add('active');
    } else {
        redLight.classList.add('active');
        greenLight.classList.remove('active');
    }

    if (state.entryDoorOpen) {
        entryGate.classList.add('open');
    } else {
        entryGate.classList.remove('open');
    }

    if (state.exitDoorOpen) {
        exitGate.classList.add('open');
    } else {
        exitGate.classList.remove('open');
    }

    document.querySelectorAll('.terminal-screen').forEach(scr => scr.classList.remove('active'));
    
    if (state.votingStep === 'auth-required') {
        document.getElementById('screen-auth').classList.add('active');
    } else if (state.votingStep === 'e-ballot') {
        document.getElementById('screen-ballot').classList.add('active');
        renderEBallot();
    } else if (state.votingStep === 'change-confirm') {
        document.getElementById('screen-change').classList.add('active');
        document.getElementById('change-selected-name').innerText = state.selectedCandidate.name_of_candidate;
    } else if (state.votingStep === 'submit-confirm') {
        document.getElementById('screen-submit-confirm').classList.add('active');
        document.getElementById('submit-selected-name').innerText = state.selectedCandidate.name_of_candidate;
    } else if (state.votingStep === 'vvpatslip') {
        document.getElementById('screen-vvpat').classList.add('active');
        renderVVPATReceipt();
    } else if (state.votingStep === 'exit-required') {
        document.getElementById('screen-exit').classList.add('active');
    } else if (state.votingStep === 'completed') {
        document.getElementById('screen-completed').classList.add('active');
    }
}

function handleVoterSelect() {
    const val = document.getElementById('voter-identity-select').value;
    if (!val) {
        state.currentVoter = null;
        resetVoterFlow();
        renderAll();
        return;
    }
    
    const matched = voters.find(v => v.aadhar_id === val);
    state.currentVoter = matched;
    addSysLog(`Voter profile selected: ${matched.name} (Aadhar: ${matched.aadhar_id})`, 'info');
    
    state.votingStep = 'auth-required';
    state.scannedBiometric = false;
    state.entryDoorOpen = false;
    state.exitDoorOpen = false;
    renderAll();
}

async function startBiometricScan(type) {
    if (!state.currentVoter) {
        alert('Please select a voter profile first!');
        return;
    }

    const scanner = document.getElementById(`${type}-scanner`);
    scanner.classList.add('scanning');
    addSysLog(`Initiating ${type.toUpperCase()} scan against Aadhar vault...`, 'info');

    setTimeout(async () => {
        scanner.classList.remove('scanning');
        
        // Call backend server if active
        if (state.usingBackend) {
            try {
                const res = await fetch('/api/voters/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ aadhar_id: state.currentVoter.aadhar_id })
                });
                const responseData = await res.json();
                
                if (!res.ok) {
                    addSysLog(`SECURITY DENIED: ${responseData.error}`, 'danger');
                    alert(`Security Warning: ${responseData.error}`);
                    resetVoterFlow();
                    syncData();
                    return;
                }
                
                addSysLog(`Aadhar matching OR Logic: Passed. Signature verified.`, 'success');
                state.scannedBiometric = true;
                state.entryDoorOpen = true;
                
                setTimeout(() => {
                    state.entryDoorOpen = false;
                    state.votingStep = 'e-ballot';
                    addSysLog('Entry Door locked. E-Ballot Terminal activated.', 'info');
                    renderAll();
                }, 1500);
                renderAll();
                
            } catch (err) {
                addSysLog('Backend Connection lost during scan.', 'danger');
            }
        } else {
            // Local Storage offline fallback authentication
            if (state.currentVoter.has_voted) {
                addSysLog(`CRITICAL SECURITY ALERT: Aadhar ID ${state.currentVoter.aadhar_id} multiple voting trigger.`, 'danger');
                alert(`Security Violation: Voter ${state.currentVoter.name} has already voted.`);
                resetVoterFlow();
                renderAll();
                return;
            }

            addSysLog(`Aadhar matched! Verified via Local Storage.`, 'success');
            state.scannedBiometric = true;
            state.entryDoorOpen = true;
            
            setTimeout(() => {
                state.entryDoorOpen = false;
                state.votingStep = 'e-ballot';
                renderAll();
            }, 1500);
            renderAll();
        }
    }, 1500);
}

function renderEBallot() {
    const listContainer = document.getElementById('ballot-candidates-list');
    if (!listContainer) return;

    const approved = nominations.filter(n => n.status === 'APPROVED');
    approved.sort((a, b) => a.name_of_candidate.localeCompare(b.name_of_candidate));

    let html = '';
    approved.forEach((c, index) => {
        const isSelected = state.selectedCandidate && state.selectedCandidate.nomination_id === c.nomination_id;
        html += `
            <div class="candidate-row-btn ${isSelected ? 'selected' : ''}" onclick="selectCandidate(${c.nomination_id})">
                <span class="candidate-sno">${index + 1}</span>
                <div class="candidate-profile-block">
                    <div class="candidate-avatar">${c.candidate_photo}</div>
                    <div class="candidate-info-text">
                        <h4>${c.name_of_candidate}</h4>
                        <p>ID: CAN-AP094-0${c.nomination_id}</p>
                    </div>
                </div>
                <div class="candidate-party-label">${c.party_name}</div>
                <div class="candidate-symbol-icon">${c.party_symbol}</div>
                <div class="vote-select-indicator"></div>
            </div>
        `;
    });

    const notaSelected = state.selectedCandidate && state.selectedCandidate.nomination_id === 'NOTA';
    html += `
        <div class="candidate-row-btn ${notaSelected ? 'selected' : ''}" onclick="selectCandidate('NOTA')">
            <span class="candidate-sno">${approved.length + 1}</span>
            <div class="candidate-profile-block">
                <div class="candidate-avatar">🚫</div>
                <div class="candidate-info-text">
                    <h4>None of the Above (NOTA)</h4>
                    <p>Standard Neutral Option</p>
                </div>
            </div>
            <div class="candidate-party-label">NOTA</div>
            <div class="candidate-symbol-icon">✖️</div>
            <div class="vote-select-indicator"></div>
        </div>
    `;

    listContainer.innerHTML = html;
}

function selectCandidate(id) {
    if (id === 'NOTA') {
        state.selectedCandidate = { nomination_id: 'NOTA', name_of_candidate: 'NOTA', party_name: 'NOTA', party_symbol: '✖️' };
    } else {
        state.selectedCandidate = nominations.find(n => n.nomination_id === id);
    }
    
    addSysLog(`Selection registered: ${state.selectedCandidate.name_of_candidate}.`, 'info');
    state.votingStep = 'change-confirm';
    renderAll();
}

function confirmChangeDecision(change) {
    if (change) {
        addSysLog('Voter re-selecting candidate.', 'warning');
        state.selectedCandidate = null;
        state.votingStep = 'e-ballot';
    } else {
        addSysLog('Selection finalized.', 'success');
        state.votingStep = 'submit-confirm';
    }
    renderAll();
}

async function submitFinalVote() {
    if (!state.selectedCandidate || !state.currentVoter) return;

    addSysLog(`Transmitting vote to local server...`, 'info');
    const voteTime = new Date().toISOString();

    if (state.usingBackend) {
        try {
            const res = await fetch('/api/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aadhar_id: state.currentVoter.aadhar_id,
                    candidate_name: state.selectedCandidate.name_of_candidate,
                    party_name: state.selectedCandidate.party_name,
                    mla_constituency: state.currentVoter.mla_constituency,
                    vote_time: voteTime
                })
            });
            
            if (res.ok) {
                addSysLog('Vote transaction securely saved to SQLite database.', 'success');
                state.votingStep = 'vvpatslip';
                renderAll();
                
                setTimeout(() => {
                    const slip = document.getElementById('vvpat-receipt-slip');
                    if (slip) slip.classList.add('dispensed');
                }, 500);
            } else {
                alert('Database vote transaction error.');
            }
        } catch (e) {
            addSysLog('Vote write failed. Server error.', 'danger');
        }
    } else {
        // Fallback local storage logic
        const newVote = {
            id: polls.length + 1,
            booth_number: 'BOOTH-01',
            candidate_name: state.selectedCandidate.name_of_candidate,
            party_name: state.selectedCandidate.party_name,
            mla_constituency: state.currentVoter.mla_constituency,
            vote_time: voteTime
        };
        polls.push(newVote);
        setDB('polls_db', polls);

        voters = voters.map(v => {
            if (v.aadhar_id === state.currentVoter.aadhar_id) {
                return { ...v, has_voted: true, vote_timestamp: voteTime };
            }
            return v;
        });
        setDB('voters_db', voters);

        addSysLog('Vote transaction written locally.', 'success');
        state.votingStep = 'vvpatslip';
        renderAll();
        
        setTimeout(() => {
            const slip = document.getElementById('vvpat-receipt-slip');
            if (slip) slip.classList.add('dispensed');
        }, 500);
    }
}

function renderVVPATReceipt() {
    const container = document.getElementById('vvpat-slip-placeholder');
    if (!container || !state.selectedCandidate) return;

    container.innerHTML = `
        <div style="font-weight:bold; border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px; font-size: 0.65rem;">
            ELECTION COMMISSION OF INDIA<br>VVPAT AUDIT SLIP
        </div>
        <div style="text-align: left; line-height: 1.3;">
            <strong>Booth:</strong> BOOTH-01<br>
            <strong>MLA Const:</strong> ${state.currentVoter.mla_constituency}<br>
            <strong>Party:</strong> ${state.selectedCandidate.party_name}<br>
            <strong>Symbol:</strong> ${state.selectedCandidate.party_symbol}<br>
            <strong>Candidate:</strong> ${state.selectedCandidate.name_of_candidate}<br>
        </div>
        <div style="border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; font-size: 0.55rem; font-weight: bold;">
            SLIP DROPPED IN AUDIT BOX
        </div>
    `;
}

function dropSlipInBox() {
    addSysLog('VVPAT confirmation slip deposited inside the sealed drop box.', 'success');
    state.votingStep = 'exit-required';
    renderAll();
}

function startExitBiometricScan() {
    const scanner = document.getElementById('exit-scanner');
    scanner.classList.add('scanning');
    addSysLog('Verifying voter identity biometric at EXIT door...', 'info');

    setTimeout(() => {
        scanner.classList.remove('scanning');
        addSysLog('Exit scan complete. Matching signature validated.', 'success');
        
        state.exitDoorOpen = true;
        addSysLog('Exit Solenoid unlocked. Voter exited booth.', 'success');

        setTimeout(async () => {
            state.exitDoorOpen = false;
            state.votingStep = 'completed';
            addSysLog('Exit door closed. System reset. Status: GREEN.', 'info');
            
            state.currentVoter = null;
            state.selectedCandidate = null;
            await syncData();
        }, 1500);

        renderAll();
    }, 1500);
}

function resetVoterFlow() {
    state.currentVoter = null;
    state.selectedCandidate = null;
    state.scannedBiometric = false;
    state.entryDoorOpen = false;
    state.exitDoorOpen = false;
    state.votingStep = 'auth-required';
}

// ==========================================
// 5. CONSTITUENCY ADMIN PORTAL
// ==========================================

function renderAdminSection() {
    document.querySelectorAll('.admin-menu-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.panel === state.adminPanel) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.admin-panel-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`admin-panel-${state.adminPanel}`).classList.add('active');

    if (state.adminPanel === 'nominations') {
        renderAdminNominations();
    } else if (state.adminPanel === 'booths') {
        renderAdminBooths();
    } else if (state.adminPanel === 'contestants') {
        renderAdminContestants();
    }
}

function switchAdminPanel(panel) {
    state.adminPanel = panel;
    renderAdminSection();
}

function renderAdminNominations() {
    const tbody = document.getElementById('nominations-table-body');
    if (!tbody) return;

    let html = '';
    nominations.forEach(n => {
        const isPending = n.status === 'PENDING';
        html += `
            <tr>
                <td>${n.nomination_id}</td>
                <td><strong>${n.name_of_candidate}</strong></td>
                <td>${n.party_name} (${n.party_symbol})</td>
                <td>${n.candidate_aadhar_id}</td>
                <td>₹${n.fee_amount.toLocaleString()}</td>
                <td>
                    <span style="padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight:700; 
                        background: ${n.status === 'APPROVED' ? 'rgba(0, 230, 118, 0.15)' : n.status === 'REJECTED' ? 'rgba(255, 23, 68, 0.15)' : 'rgba(255, 179, 0, 0.15)'}; 
                        color: ${n.status === 'APPROVED' ? 'var(--success)' : n.status === 'REJECTED' ? 'var(--danger)' : 'var(--warning)'}">
                        ${n.status}
                    </span>
                </td>
                <td>
                    ${isPending ? `
                        <button class="btn btn-success" style="padding: 4px 10px; font-size: 0.75rem;" onclick="auditNomination(${n.nomination_id}, 'APPROVED')">Approve</button>
                        <button class="btn btn-danger" style="padding: 4px 10px; font-size: 0.75rem;" onclick="auditNomination(${n.nomination_id}, 'REJECTED')">Reject</button>
                    ` : `<span style="color:var(--text-muted); font-size:0.8rem;">Reviewed</span>`}
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

async function auditNomination(id, decision) {
    if (state.usingBackend) {
        try {
            const res = await fetch('/api/nominations/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nomination_id: id, status: decision })
            });
            if (res.ok) {
                addSysLog(`Nomination audited on database: Nomination ${id} -> ${decision}`, 'success');
                await syncData();
            }
        } catch (e) {
            addSysLog('Audit update failed.', 'danger');
        }
    } else {
        nominations = nominations.map(n => {
            if (n.nomination_id === id) {
                return { ...n, status: decision };
            }
            return n;
        });
        setDB('nominations_db', nominations);
        addSysLog(`Nomination updated locally: ${decision}`, 'success');
        renderAdminSection();
    }
}

function renderAdminBooths() {
    const tbody = document.getElementById('booths-table-body');
    if (!tbody) return;

    let html = '';
    booths.forEach(b => {
        html += `
            <tr>
                <td><strong>${b.booth_number}</strong></td>
                <td>${b.location_name}</td>
                <td>${b.mla_constituency_code} / ${b.mp_constituency_code}</td>
                <td>${b.ip_address}</td>
                <td><code style="color:var(--secondary);">${b.camera_id}</code></td>
                <td>${b.agent_name}</td>
                <td><span style="color:var(--success); font-weight:bold;">● ONLINE</span></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

async function createNewBooth(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('new-booth-id').value;
    const loc = document.getElementById('new-booth-location').value;
    const mla = document.getElementById('new-booth-mla').value;
    const ip = document.getElementById('new-booth-ip').value;
    const cam = document.getElementById('new-booth-camera').value;
    
    if(!id || !loc || !mla || !ip || !cam) {
        alert('All booth configuration inputs are required.');
        return;
    }

    const newBooth = {
        booth_number: id,
        location_name: loc,
        mla_constituency_code: mla,
        mp_constituency_code: 'MP-05',
        camera_id: cam,
        ip_address: ip,
        agent_name: 'Zonal Guard Assigned'
    };

    if (state.usingBackend) {
        try {
            const res = await fetch('/api/booths', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBooth)
            });
            if (res.ok) {
                addSysLog(`Registered new booth terminal: ${id} to SQLite db.`, 'success');
                await syncData();
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } catch (e) {
            addSysLog('Booth terminal insertion failed.', 'danger');
        }
    } else {
        booths.push(newBooth);
        setDB('booths_db', booths);
        addSysLog(`Registered booth terminal locally: ${id}`, 'success');
        renderAdminSection();
    }
    
    document.getElementById('new-booth-id').value = '';
    document.getElementById('new-booth-location').value = '';
    document.getElementById('new-booth-ip').value = '';
    document.getElementById('new-booth-camera').value = '';
}

function renderAdminContestants() {
    const tbody = document.getElementById('contestants-table-body');
    if (!tbody) return;

    const approved = nominations.filter(n => n.status === 'APPROVED');
    let html = '';
    approved.forEach(c => {
        html += `
            <tr>
                <td>CAN-AP094-0${c.nomination_id}</td>
                <td><strong>${c.name_of_candidate}</strong></td>
                <td>${c.party_name}</td>
                <td><span style="font-size: 1.5rem;">${c.party_symbol}</span></td>
                <td>${c.email}</td>
                <td>${c.mobile}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// ==========================================
// 6. SUPER ADMIN CONSOLE
// ==========================================

function renderSuperAdminSection() {
    document.getElementById('opt-timezone').value = state.timezone;
    document.getElementById('opt-start-time').value = state.startTime;
    document.getElementById('opt-end-time').value = state.endTime;
    
    const statusVal = document.getElementById('super-election-status');
    statusVal.innerText = state.electionStatus;
    statusVal.style.color = state.electionStatus === 'ACTIVE' ? 'var(--success)' : 'var(--danger)';

    calculateAuditIntegrity();
}

async function saveSuperSettings(e) {
    if (e) e.preventDefault();
    state.timezone = document.getElementById('opt-timezone').value;
    state.startTime = document.getElementById('opt-start-time').value;
    state.endTime = document.getElementById('opt-end-time').value;
    
    if (state.usingBackend) {
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timezone: state.timezone,
                    start_time: state.startTime,
                    end_time: state.endTime
                })
            });
            addSysLog('Electoral settings updated in database settings.', 'success');
            await syncData();
        } catch (e) {
            addSysLog('Settings update failed.', 'danger');
        }
    } else {
        addSysLog('Electoral settings saved in memory.', 'success');
        renderSuperAdminSection();
    }
    alert('Timeline settings saved.');
}

async function toggleElectionStatus() {
    const nextStatus = state.electionStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    if (state.usingBackend) {
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });
            await syncData();
            addSysLog(`ELECTION STATE: Changed to ${nextStatus}.`, 'success');
        } catch (e) {
            addSysLog('Failed to change status.', 'danger');
        }
    } else {
        state.electionStatus = nextStatus;
        addSysLog(`ELECTION STATE: Changed to ${nextStatus}.`, 'success');
        renderSuperAdminSection();
    }
}

async function resetSimulation() {
    if (confirm('Are you sure you want to clear current polls database and reset all voter statuses?')) {
        if (state.usingBackend) {
            try {
                await fetch('/api/super/reset', { method: 'POST' });
                addSysLog('SQLite Database tables cleared and re-seeded successfully.', 'warning');
                await syncData();
            } catch (e) {
                addSysLog('Database reset failed.', 'danger');
            }
        } else {
            localStorage.removeItem('polls_db');
            localStorage.removeItem('voters_db');
            voters = DEFAULT_VOTERS.map(v => ({ ...v, has_voted: false, vote_timestamp: null }));
            polls = DEFAULT_POLLS;
            setDB('voters_db', voters);
            setDB('polls_db', polls);
            addSysLog('LocalStorage data cleared.', 'warning');
        }
        
        resetVoterFlow();
        alert('Simulation reset complete.');
        renderAll();
    }
}

function calculateAuditIntegrity() {
    const listElement = document.getElementById('math-audit-log-box');
    if (!listElement) return;

    const approved = nominations.filter(n => n.status === 'APPROVED');
    
    let html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Candidate</th>
                    <th>NET1 (Sum of Booth Tallies)</th>
                    <th>NRT2 (Server Accumulated Votes)</th>
                    <th>Verification Audit</th>
                </tr>
            </thead>
            <tbody>
    `;

    let overallPassed = true;
    let netTotal = 0;
    let nrtTotal = 0;

    approved.forEach(c => {
        let net1 = 0;
        booths.forEach(b => {
            const count = polls.filter(p => p.booth_number === b.booth_number && p.candidate_name === c.name_of_candidate).length;
            net1 += count;
        });

        let nrt2 = polls.filter(p => p.candidate_name === c.name_of_candidate).length;

        const matches = net1 === nrt2;
        if (!matches) overallPassed = false;

        netTotal += net1;
        nrtTotal += nrt2;

        html += `
            <tr>
                <td><strong>${c.name_of_candidate} (${c.party_name})</strong></td>
                <td>${net1}</td>
                <td>${nrt2}</td>
                <td>
                    <span style="color: ${matches ? 'var(--success)' : 'var(--danger)'}; font-weight:bold;">
                        ${matches ? '✓ PASSED (NET1 = NRT2)' : '✗ FAULT DETECTED'}
                    </span>
                </td>
            </tr>
        `;
    });

    let notaNet1 = 0;
    booths.forEach(b => {
        notaNet1 += polls.filter(p => p.booth_number === b.booth_number && p.candidate_name === 'NOTA').length;
    });
    let notaNrt2 = polls.filter(p => p.candidate_name === 'NOTA').length;
    netTotal += notaNet1;
    nrtTotal += notaNrt2;

    html += `
        <tr>
            <td><strong>None of the Above (NOTA)</strong></td>
            <td>${notaNet1}</td>
            <td>${notaNrt2}</td>
            <td>
                <span style="color: ${notaNet1 === notaNrt2 ? 'var(--success)' : 'var(--danger)'}; font-weight:bold;">
                    ${notaNet1 === notaNrt2 ? '✓ PASSED' : '✗ FAULT DETECTED'}
                </span>
            </td>
        </tr>
        <tr style="background:rgba(255,255,255,0.03); font-weight:bold;">
            <td>AGGREGATED TOTAL</td>
            <td>${netTotal}</td>
            <td>${nrtTotal}</td>
            <td>
                <span style="color: ${netTotal === nrtTotal ? 'var(--success)' : 'var(--danger)'}; font-weight:bold; font-size:1.1rem;">
                    ${netTotal === nrtTotal ? 'SECURE' : 'COMPROMISED'}
                </span>
            </td>
        </tr>
    `;

    html += '</tbody></table>';

    const statusBanner = document.getElementById('audit-integrity-status');
    if (statusBanner) {
        if (overallPassed && netTotal === nrtTotal) {
            statusBanner.className = "voter-status-alert success";
            statusBanner.innerHTML = "<strong>SECURE:</strong> All physical terminals match central DB (NET1 = NRT2). No inconsistencies found.";
        } else {
            statusBanner.className = "voter-status-alert warning";
            statusBanner.innerHTML = "<strong>CRITICAL AUDIT ERROR:</strong> Discrepancy detected in tally math matching. Investigate network queues.";
        }
    }

    listElement.innerHTML = html;
}

// ==========================================
// 7. ZONAL MONITORING & OBSERVER DASHBOARD
// ==========================================

function renderObserverSection() {
    const totalVotesCast = polls.length;
    const registeredVoters = voters.length;
    const turnoutPct = registeredVoters > 0 ? ((totalVotesCast / registeredVoters) * 100).toFixed(1) : 0;

    document.getElementById('obs-stat-voted').innerText = totalVotesCast;
    document.getElementById('obs-stat-turnout').innerText = `${turnoutPct}%`;
    
    const activeBooths = booths.length;
    document.getElementById('obs-stat-booths').innerText = `${activeBooths} Active`;

    const approved = nominations.filter(n => n.status === 'APPROVED');
    const tableBody = document.getElementById('observer-tally-body');
    if (tableBody) {
        let html = '';
        approved.forEach(c => {
            const count = polls.filter(p => p.candidate_name === c.name_of_candidate).length;
            const pct = totalVotesCast > 0 ? ((count / totalVotesCast) * 100).toFixed(1) : 0;
            
            html += `
                <tr>
                    <td><strong>${c.name_of_candidate}</strong></td>
                    <td>${c.party_name}</td>
                    <td><span style="font-size:1.3rem;">${c.party_symbol}</span></td>
                    <td style="font-size:1.1rem; font-weight:700; color:var(--primary);">${count}</td>
                    <td>
                        <div style="width:100%; height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden; margin-top:8px;">
                            <div style="width:${pct}%; height:100%; background:linear-gradient(to right, var(--primary), var(--secondary));"></div>
                        </div>
                        <span style="font-size:0.75rem; color:var(--text-muted);">${pct}% of total</span>
                    </td>
                </tr>
            `;
        });
        
        const notaCount = polls.filter(p => p.candidate_name === 'NOTA').length;
        const notaPct = totalVotesCast > 0 ? ((notaCount / totalVotesCast) * 100).toFixed(1) : 0;
        html += `
            <tr>
                <td><strong>NOTA</strong></td>
                <td>None of the Above</td>
                <td>✖️</td>
                <td style="font-size:1.1rem; font-weight:700; color:var(--text-muted);">${notaCount}</td>
                <td>
                    <div style="width:100%; height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden; margin-top:8px;">
                        <div style="width:${notaPct}%; height:100%; background:var(--text-muted);"></div>
                    </div>
                    <span style="font-size:0.75rem; color:var(--text-muted);">${notaPct}% of total</span>
                </td>
            </tr>
        `;

        tableBody.innerHTML = html;
    }

    renderCCTVs();
}

function renderCCTVs() {
    const container = document.getElementById('observer-cctv-grid');
    if (!container) return;

    let html = '';
    booths.forEach(b => {
        html += `
            <div class="cctv-card">
                <span class="cctv-live-tag">LIVE</span>
                <div class="cctv-stream-placeholder">
                    <div class="cctv-scanline"></div>
                    <div style="text-align: center; color: rgba(255,255,255,0.4); font-size: 0.8rem; font-family:'Space Grotesk', monospace;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📽️</div>
                        FEED ACTIVE<br>
                        FPS: 30 | PORT: 8080<br>
                        SEC_GUARD: OK
                    </div>
                </div>
                <div class="cctv-label">${b.booth_number} - Cam:${b.camera_id}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ==========================================
// 8. LOGS UTILITY
// ==========================================

function addSysLog(msg, type = 'info') {
    const list = document.getElementById('system-logs-list');
    if (!list) return;

    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-msg">${msg}</span>
    `;

    list.appendChild(entry);
    list.scrollTop = list.scrollHeight;
}

function clearLogs() {
    const list = document.getElementById('system-logs-list');
    if (list) list.innerHTML = '';
}
