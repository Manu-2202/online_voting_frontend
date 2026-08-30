import React, { useState, useEffect, useRef } from 'react';
import './style.css';

const API_BASE = import.meta.env.VITE_API_URL || 'https://online-voting-backend-duwm.onrender.com';

const TRANSLATIONS = {
  en: {
    title: "AADHAR ELECTRONIC VOTING",
    subtitle: "AUTOMATED SECURE DEMOCRACY",
    kiosk: "Polling Kiosk (APS/MPS)",
    commandCenter: "ECI Live Command Center",
    nomPortal: "Nomination Portal",
    resDecl: "Results Declaration",
    aadhaarReg: "Aadhaar Registry",
    sound: "Sound",
    simulate: "Simulate 25 Votes",
    reset: "Reset System",
    // Voter Kiosk
    boothConsole: "Physical Booth Console",
    voterEntry: "SIMULATE VOTER ENTRY",
    voterSelectPlaceholder: "Select Voter Identity Profile...",
    voted: "Voted",
    notVoted: "Not Voted",
    wait: "Wait",
    proceed: "Proceed",
    entryActuator: "ENTRY ACTUATOR (SOLENOID)",
    fpModule: "AADHAR FP MODULE",
    irisScanner: "AADHAR IRIS SCANNER",
    scanThumbText: "TAP TO SCAN THUMB",
    scanIrisText: "TAP TO SCAN IRIS",
    // Screens
    stationTitle: "Automated Polling Station",
    stationDesc: "Please proceed to the entry gate, and scan either your Left Thumbprint or IRIS on the external physical scanner to verify identity.",
    ballotTitle: "ELECTRONIC BALLOT SHEET",
    ballotDesc: "Verify your name on top. Touch/select the corresponding candidate button to place your vote.",
    changeTitle: "VOTE RE-EVALUATION OPTION",
    changeDesc: "You selected: {candidate}. Do you want to change your vote to a different candidate?",
    yesRe: "YES (Re-select)",
    noConfirm: "NO (Confirm Selection)",
    confirmTitle: "CONFIRM & RECORD VOTE",
    confirmDesc: "You are submitting your vote to: {candidate}. Confirming will lock and encrypt your ballot into MERN databases.",
    submitVote: "SUBMIT VOTE",
    cancel: "CANCEL",
    vvpatTitle: "VVPAT PAPER AUDIT TRAIL",
    vvpatDesc: "Your ballot is saved. The printer below is dispensing the confirmation slip. Drop it in the audit box.",
    dropSlip: "Drop Slip in Audit Box",
    exitTitle: "Exit Gate Validation Required",
    exitDesc: "Your vote has been verified and stored. Tap the Exit Biometric Scanner below to open the door and leave the booth.",
    exitScanBtn: "SCAN THUMB TO EXIT",
    completeTitle: "Voting Complete",
    completeDesc: "Thank you! Your vote has been recorded securely. The terminal has reset for the next voter profile.",
    nextVoterBtn: "Start Next Voter",
    
    // ECI Live Command Center
    totalVotes: "Total Votes Cast",
    turnout: "Aggregated Turnout %",
    stations: "Configured Stations",
    threats: "Threat Alerts",
    activeText: "Active",
    triggeredText: "Triggered",
    liveTallies: "Live Candidate Tallies",
    talliesDesc: "Constituency votes logged and synced in real-time.",
    contestant: "Contestant",
    partyName: "Party Name",
    symbol: "Symbol",
    polledVotes: "Polled Votes",
    tallyBar: "Tally Bar",
    cctvFeeds: "Active CCTV Camera Feeds",
    cctvDesc: "Live monitoring surveillance links at polling stations for security validation.",
    feedActive: "FEED ACTIVE",
    live: "LIVE",
    
    // Nomination Portal
    nomInbox: "Nomination Inbox",
    boothSetup: "Booth Setup & IPs",
    contRegistry: "Contestant Registry",
    candNomInbox: "Candidate Nomination Inbox",
    nomAuditingDesc: "Auditing queue of submitted nominations. Verify payment transaction logs, PDFs, and candidate profiles before approving for ballot deployment.",
    nomId: "Nomination ID",
    candName: "Candidate Name",
    partyAffil: "Party Affiliation",
    aadharCard: "Aadhar Card",
    secDeposit: "Security Deposit",
    verifStatus: "Verification Status",
    actControls: "Action Controls",
    reviewed: "Reviewed",
    approveBtn: "Approve",
    rejectBtn: "Reject",
    
    boothAllocTitle: "Booth Allocation & Terminal IP Config",
    boothAllocDesc: "Registered physical and mobile polling station terminal gateways connected to constituency subnet.",
    terminalId: "Terminal ID",
    geoLoc: "Geographic Location",
    constCode: "Constituency Code",
    terminalIp: "Terminal IP Address",
    cctvCamId: "CCTV Camera ID",
    secOfficer: "Security Guard Officer",
    operState: "Operational State",
    online: "ONLINE",
    
    registerNewTerminal: "Register New Terminal Gateway (Physical / Mobile)",
    terminalIdCode: "Terminal ID Code",
    physicalLocName: "Physical Location Name",
    mlaConstCode: "MLA Constituency Code",
    terminalSubnetIp: "Terminal Subnet IP Address",
    camFeedIdCode: "Camera Feed ID Code",
    saveConfigBtn: "Save & Configuration Register",
    
    approvedContestants: "Approved Contestant Registry",
    contestantRegistryDesc: "Finalized contestant ballots for MLA / MP election, sorted alphabetically as security policy mandate.",
    ballotId: "Ballot ID",
    contactEmail: "Contact Email",
    regMobile: "Registered Mobile",

    // Results Declaration
    electedRole: "ELECTED AS MEMBER OF LEGISLATIVE ASSEMBLY",
    winnerVotes: "Winner Votes",
    runnerVotes: "Runner Votes",
    victoryMargin: "Victory Margin",
    resultTallyTitle: "Official Election Result Tally & Vote Share",
    resultTallyDesc: "Constituency totals authenticated via secure database transaction ledgers.",
    printCert: "Print ECI Certificate",
    rank: "Rank",
    party: "Party",
    officialStatus: "Official Status",
    noVotesCast: "No Votes Cast Yet",
    noVotesDesc: "The Results Declaration panel will activate once voters start casting ballots at the kiosk.",

    // Aadhaar Registry
    aadhaarVaultTitle: "Aadhaar Registry Vault",
    aadhaarVaultDesc: "Central database mirroring active Aadhaar biometric keys, addresses, and transaction hashes.",
    aadhaarNumber: "Aadhaar Number",
    fullName: "Full Name",
    mlaConst: "MLA Const",
    dobLabel: "Age/DOB",
    votingState: "Voting State",
    syncTime: "Sync Timestamp",
    
    timelineSettings: "Electoral Timeline Settings",
    timezoneOffset: "TIMEZONE OFFSET",
    pollStart: "POLL START TIME",
    pollEnd: "POLL END TIME",
    updateConfig: "Update Config",
    electionState: "ELECTION STATE",
    toggleLock: "Toggle Lock",
    
    cryptoMathCheck: "Database Cryptographic Math Check",
    cryptoMathPassed: "NET1 = NRT2 verified.",
    candidateCol: "Candidate",
    net1Col: "NET1",
    nrt2Col: "NRT2",
    
    // Logs Footer
    sysLogsTitle: "SYSTEM TRANSACTION & LOGS",
    clearConsole: "Clear Console",
    // Nomination Form
    fileNomBtn: "File Nomination",
    formAadharId: "Candidate Aadhaar Number (12 digits)",
    formCandName: "Candidate Full Name",
    formPartyName: "Party Name",
    formPartySymbol: "Select Party Symbol",
    formPhoto: "Candidate Photo Avatar / Emoji",
    formSecDeposit: "Security Deposit Amount",
    formTxnNum: "Payment Transaction Reference Number",
    formPaidDate: "Payment Date",
    formMobile: "Contact Mobile Number",
    formEmail: "Email Address",
    formCommAddress: "Communication / Mailing Address",
    formSubmitBtn: "Submit Nomination File",
    formSuccessTitle: "Nomination Filed Successfully!",
    formSuccessDesc: "Your candidate nomination profile has been securely recorded into the MERN database. The constituency Returning Officer will review it in the inbox shortly.",
    formBackBtn: "File Another Nomination",
    // Election Types
    electionType: "Election Type",
    superAdminConsole: "Super Admin Console",
    electionTypesTab: "Election Types Manager",
    addElectionType: "Add New Election Type",
    elecId: "Election ID (alphanumeric, lowercase)",
    elecName: "Election Name",
    elecDesc: "Election Description",
    saveElecType: "Save Election Type",
    elecSuccess: "Election Type successfully created!"
  },
  te: {
    title: "ఆధార్ ఎలక్ట్రానిక్ ఓటింగ్",
    subtitle: "ఆటోమేటెడ్ సురక్షిత ప్రజాస్వామ్యం",
    kiosk: "పోలింగ్ కేంద్రం (APS/MPS)",
    commandCenter: "ECI లైవ్ కమాండ్ సెంటర్",
    nomPortal: "నామినేషన్ పోర్టల్",
    resDecl: "ఫలితాల ప్రకటన",
    aadhaarReg: "ఆధార్ రిజిస్ట్రీ",
    sound: "ధ్వని",
    simulate: "25 ఓట్లను అనుకరించు",
    reset: "వ్యవస్థను రీసెట్ చేయి",
    boothConsole: "భౌతిక బూత్ కన్సోల్",
    voterEntry: "ఓటరు ప్రవేశాన్ని అనుకరించు",
    voterSelectPlaceholder: "ఓటరు గుర్తింపు ప్రొఫైల్‌ను ఎంచుకోండి...",
    voted: "ఓటు వేశారు",
    notVoted: "ఓటు వేయలేదు",
    wait: "వేచి ఉండండి",
    proceed: "ముందుకు సాగండి",
    entryActuator: "ప్రవేశ గేట్ యాక్యుయేటర్ (సోలనోయిడ్)",
    fpModule: "ఆధార్ వేలిముద్ర మాడ్యూల్",
    irisScanner: "ఆధార్ ఐరిస్ స్కానర్",
    scanThumbText: "వేలిముద్ర స్కాన్ చేయడానికి నొక్కండి",
    scanIrisText: "ఐరిస్ స్కాన్ చేయడానికి నొక్కండి",
    stationTitle: "ఆటోమేటెడ్ పోలింగ్ స్టేషన్",
    stationDesc: "దయచేసి ప్రవేశ ద్వారం వద్దకు వెళ్లి, గుర్తింపును ధృవీకరించడానికి మీ ఎడమ వేలిముద్ర లేదా ఐరిస్‌ను స్కాన్ చేయండి.",
    ballotTitle: "ఎలక్ట్రానిక్ బ్యాలెట్ పత్రం",
    ballotDesc: "పైన మీ పేరును ధృవీకరించుకోండి. ఓటు వేయడానికి సంబంధిత అభ్యర్థి బటన్‌ను తాకండి/ఎంచుకోండి.",
    changeTitle: "ఓటు పునఃపరిశీలన ఎంపిక",
    changeDesc: "మీరు ఎంచుకున్నది: {candidate}. మీరు మీ ఓటును వేరే అభ్యర్థికి మార్చాలనుకుంటున్నారా?",
    yesRe: "అవును (మళ్లీ ఎంచుకోండి)",
    noConfirm: "లేదు (ధృవీకరించండి)",
    confirmTitle: "ఓటును ధృవీకరించండి & నమోదు చేయండి",
    confirmDesc: "మీరు మీ ఓటును దీనికి సమర్పిస్తున్నారు: {candidate}. ధృవీకరించడం ద్వారా మీ బ్యాలెట్ ఎన్‌క్రిప్ట్ చేయబడి భద్రపరచబడుతుంది.",
    submitVote: "ఓటు సమర్పించండి",
    cancel: "రద్దు చేయి",
    vvpatTitle: "VVPAT కాగితం ఆడిట్ ట్రయల్",
    vvpatDesc: "మీ ఓటు భద్రపరచబడింది. ప్రింటర్ రసీదు చీటీని ఇస్తోంది. దాన్ని ఆడిట్ పెట్టెలో వేయండి.",
    dropSlip: "చీటీని ఆడిట్ పెట్టెలో వేయండి",
    exitTitle: "నిష్క్రమణ గేట్ ధృవీకరణ అవసరం",
    exitDesc: "మీ ఓటు ధృవీకరించబడింది. తలుపు తెరిచి వెళ్ళడానికి నిష్క్రమణ బయోమెట్రిక్ స్కానర్‌ను నొక్కండి.",
    exitScanBtn: "నిష్క్రమించడానికి స్కాన్ చేయి",
    completeTitle: "ఓటింగ్ పూర్తయింది",
    completeDesc: "ధన్యవాదాలు! మీ ఓటు విజయవంతంగా నమోదైంది. తదుపరి ఓటరు కోసం టెర్మినల్ రీసెట్ చేయబడింది.",
    nextVoterBtn: "తదుపరి ఓటరును ప్రారంభించండి",

    // ECI Live Command Center
    totalVotes: "మొత్తం పోలైన ఓట్లు",
    turnout: "మొత్తం ఓటింగ్ శాతం %",
    stations: "కాన్ఫిగర్ చేసిన కేంద్రాలు",
    threats: "భద్రతా హెచ్చరికలు",
    activeText: "క్రియాశీలం",
    triggeredText: "ప్రేరేపించబడింది",
    liveTallies: "प्रत्यक्ष అభ్యర్థి ఫలితాలు",
    talliesDesc: "నియోజకవర్గం ఓట్లు నిజసమయంలో నమోదు చేయబడి సమకాలీకరించబడతాయి.",
    contestant: "అభ్యర్థి",
    partyName: "పార్టీ పేరు",
    symbol: "గుర్తు",
    polledVotes: "పోలైన ఓట్లు",
    tallyBar: "ఫలితాల పట్టిక",
    cctvFeeds: "క్రియాశీల సిసిటివి కెమెరా ఫీడ్‌లు",
    cctvDesc: "భద్రత ధృవీకరణ కోసం పోలింగ్ కేంద్రాల వద్ద ప్రత్యక్ష పర్యవేక్షణ ఫీడ్‌లు.",
    feedActive: "ఫీడ్ క్రియాశీలంగా ఉంది",
    live: "ప్రత్యక్ష ప్రసారం",

    // Nomination Portal
    nomInbox: "నామినేషన్ ఇన్బాక్స్",
    boothSetup: "బూత్ సెటప్ & ఐపిలు",
    contRegistry: "పోటీదారుల రిజిస్ట్రీ",
    candNomInbox: "అభ్యర్థి నామినేషన్ ఇన్బాక్స్",
    nomAuditingDesc: "సమర్పించిన నామినేషన్ల ఆడిటింగ్ క్యూ. బ్యాలెట్ మోహరింపునకు ముందు చెల్లింపు లావాదేవీల లాగ్‌లు, పిడిఎఫ్‌లు మరియు అభ్యర్థి ప్రొఫైల్‌లను ధృవీకరించండి.",
    nomId: "నామినేషన్ ఐడి",
    candName: "అభ్యర్థి పేరు",
    partyAffil: "పార్టీ అనుబంధం",
    aadharCard: "ఆధార్ కార్డ్",
    secDeposit: "భద్రతా డిపాజిట్",
    verifStatus: "ధృవీకరణ స్థితి",
    actControls: "నియంత్రణ చర్యలు",
    reviewed: "సమీక్షించబడింది",
    approveBtn: "ఆమోదించు",
    rejectBtn: "తిరస్కరించు",
    
    boothAllocTitle: "బూత్ కేటాయింపు & టెర్మినల్ ఐపి కాన్ఫిగరేషన్",
    boothAllocDesc: "నియోజకవర్గ సబ్‌నెట్‌కు అనుసంధానించబడిన భౌతిక మరియు మొబైల్ పోలింగ్ స్టేషన్ టెర్మినల్ గేట్‌వేలు.",
    terminalId: "టెర్మినల్ ఐడి",
    geoLoc: "భౌగోళిక స్థానం",
    constCode: "నియోజకవర్గ కోడ్",
    terminalIp: "టెర్మినల్ ఐపి చిరునామా",
    cctvCamId: "సిసిటివి కెమెరా ఐడి",
    secOfficer: "భద్రతా గార్డు అధికారి",
    operState: "కార్యాచరణ స్థితి",
    online: "ఆన్‌లైన్",
    
    registerNewTerminal: "కొత్త టెర్మినల్ గేట్‌వేని నమోదు చేయండి (భౌతిక / మొబైల్)",
    terminalIdCode: "టెర్మినల్ ఐడి కోడ్",
    physicalLocName: "భౌతిక స్థాన పేరు",
    mlaConstCode: "ఎమ్మెల్యే నియోజకవర్గ కోడ్",
    terminalSubnetIp: "టెర్మినల్ సబ్‌నెట్ ఐపి చిరునామా",
    camFeedIdCode: "కెమెరా ఫీడ్ ఐడి కోడ్",
    saveConfigBtn: "సేవ్ చేయి & కాన్ఫిగరేషన్ నమోదు చేయి",
    
    approvedContestants: "ఆమోదించబడిన పోటీదారుల రిజిస్ట్రీ",
    contestantRegistryDesc: "ఎమ్మెల్యే / ఎంపీ ఎన్నికల కోసం ఖరారు చేసిన పోటీదారుల బ్యాలెట్‌లు, భద్రతా విధానం ప్రకారం అక్షర క్రమంలో అమర్చబడ్డాయి.",
    ballotId: "బ్యాలెట్ ఐడి",
    contactEmail: "సంప్రదింపు ఈమెయిల్",
    regMobile: "నమోదిత మొబైల్ నంబర్",

    // Results Declaration
    electedRole: "శాసనసభ సభ్యునిగా ఎన్నికయ్యారు (ఎమ్మెల్యే)",
    winnerVotes: "విజేత ఓట్లు",
    runnerVotes: "ద్వితీయ స్థాన ఓట్లు",
    victoryMargin: "మెజారిటీ మార్జిన్",
    resultTallyTitle: "అధికారిక ఎన్నికల ఫలితాల గణన & ఓట్ల వాటా",
    resultTallyDesc: "సురక్షిత డేటాబేస్ లావాదేవీల రిజిస్టర్ల ద్వారా ధృవీకరించబడిన నియోజకవర్గం మొత్తాలు.",
    printCert: "ఈసిఐ సర్టిఫికేట్ ప్రింట్ చేయి",
    rank: "ర్యాంక్",
    party: "పార్టీ",
    officialStatus: "అధికారిక స్థితి",
    noVotesCast: "ఇంకా ఓట్లు పోల్ కాలేదు",
    noVotesDesc: "ఓటర్లు కియోస్క్ వద్ద ఓట్లు వేయడం ప్రారంభించిన తర్వాత ఫలితాల ప్రకటన ప్యానెల్ సక్రియం చేయబడుతుంది.",

    // Aadhaar Registry
    aadhaarVaultTitle: "ఆధార్ రిజిస్ట్రీ వాల్ట్",
    aadhaarVaultDesc: "క్రియాశీల ఆధార్ బయోమెట్రిక్ కీలు, చిరునామాలు మరియు లావాదేవీల హ్యాష్‌లను ప్రతిబింబించే కేంద్ర డేటాబేస్.",
    aadhaarNumber: "ఆధార్ సంఖ్య",
    fullName: "పూర్తి పేరు",
    mlaConst: "ఎమ్మెల్యే నియోజకవర్గం",
    dobLabel: "వయస్సు / పుట్టిన తేదీ",
    votingState: "ఓటింగ్ స్థితి",
    syncTime: "సమకాలీకరణ సమయం",
    
    timelineSettings: "ఎన్నికల కాలక్రమ సెట్టింగులు",
    timezoneOffset: "టైమ్‌జోన్ ఆఫ్‌సెట్",
    pollStart: "పోలింగ్ ప్రారంభ సమయం",
    pollEnd: "పోలింగ్ ముగింపు సమయం",
    updateConfig: "కాన్ఫिగరేషన్ అప్‌డేట్ చేయి",
    electionState: "ఎన్నికల స్థితి",
    toggleLock: "లాక్ టోగుల్ చేయి",
    
    cryptoMathCheck: "డేటాబేస్ క్రిప్టోగ్రాఫిక్ గణిత తనిఖీ",
    cryptoMathPassed: "NET1 = NRT2 ధృవీకరించబడింది.",
    candidateCol: "అభ్యర్థి",
    net1Col: "NET1",
    nrt2Col: "NRT2",
    
    // Logs Footer
    sysLogsTitle: "సిస్టమ్ లావాదేవీలు & లాగ్‌లు",
    clearConsole: "కన్సోల్ క్లియర్ చేయి",
    // Nomination Form
    fileNomBtn: "నామినేషన్ దాఖలు చేయి",
    formAadharId: "అభ్యర్థి ఆధార్ సంఖ్య (12 అంకెలు)",
    formCandName: "అభ్యర్థి పూర్తి పేరు",
    formPartyName: "పార్టీ పేరు",
    formPartySymbol: "పార్టీ గుర్తును ఎంచుకోండి",
    formPhoto: "అభ్యర్థి ఫోటో అవతార్ / ఎమోజి",
    formSecDeposit: "భద్రతా డిపాజిట్ మొత్తం",
    formTxnNum: "చెల్లింపు లావాదేవీ రిఫరెన్స్ సంఖ్య",
    formPaidDate: "చెల్లింపు తేదీ",
    formMobile: "సంప్రదింపు మొబైల్ సంఖ్య",
    formEmail: "ఈమెయిల్ చిరునామా",
    formCommAddress: "సమాచార మార్పిడి / నివాస చిరునామా",
    formSubmitBtn: "నామినేషన్ పత్రాన్ని సమర్పించండి",
    formSuccessTitle: "నామినేషన్ విజయవంతంగా దాఖలైంది!",
    formSuccessDesc: "మీ అభ్యర్థి నామినేషన్ ప్రొఫైల్ డేటాబేస్లో భద్రపరచబడింది. నియోజకవర్గ రిటర్నింగ్ అధికారి త్వరలో సమీక్షిస్తారు.",
    formBackBtn: "మరొక నామినేషన్ దాఖలు చేయి",
    // Election Types
    electionType: "ఎన్నికల రకం",
    superAdminConsole: "సూపర్ అడ్మిన్ కన్సోల్",
    electionTypesTab: "ఎన్నికల రకాల మేనేజర్",
    addElectionType: "కొత్త ఎన్నికల రకాన్ని జోడించండి",
    elecId: "ఎన్నికల ఐడి (ఆల్ఫాన్యూమరిక్, చిన్న అక్షరాలు)",
    elecName: "ఎన్నికల పేరు",
    elecDesc: "ఎన్నికల వివరణ",
    saveElecType: "ఎన్నికల రకాన్ని సేవ్ చేయి",
    elecSuccess: "ఎన్నికల రకం విజయవంతంగా సృష్టించబడింది!"
  },
  hi: {
    title: "आधार इलेक्ट्रॉनिक मतदान",
    subtitle: "स्वचालित सुरक्षित लोकतंत्र",
    kiosk: "मतदान केंद्र (APS/MPS)",
    commandCenter: "ECI लाइव कमांड सेंटर",
    nomPortal: "नामांकन पोर्टल",
    resDecl: "परिणाम घोषणा",
    aadhaarReg: "आधार रजिस्ट्री",
    sound: "ध्वनि",
    simulate: "25 मतों का अनुकरण करें",
    reset: "सिस्टम रीसेट करें",
    boothConsole: "भौतिक बूथ कंसोल",
    voterEntry: "मतदाता प्रवेश अनुकरण",
    voterSelectPlaceholder: "मतदाता पहचान प्रोफ़ाइल चुनें...",
    voted: "मतदान किया",
    notVoted: "मतदान नहीं किया",
    wait: "प्रतीक्षा करें",
    proceed: "आगे बढ़ें",
    entryActuator: "प्रवेश द्वार एक्चुएटर (सॉलोनॉइड)",
    fpModule: "आधार फिंगरप्रिंट मॉड्यूल",
    irisScanner: "आधार आईरिस स्कैनर",
    scanThumbText: "स्कैन करने के लिए टैप करें",
    scanIrisText: "आईरिस स्कैन करने के लिए टैप करें",
    stationTitle: "स्वचालित मतदान केंद्र",
    stationDesc: "कृपया प्रवेश द्वार पर जाएं, और पहचान सत्यापित करने के लिए बाहरी फिंगरप्रिंट या आईरिस स्कैनर को स्कैन करें।",
    ballotTitle: "इलेक्ट्रॉनिक मतपत्र",
    ballotDesc: "ऊपर अपना नाम सत्यापित करें। अपना वोट डालने के लिए संबंधित उम्मीदवार बटन को स्पर्श करें/चुनें।",
    changeTitle: "मत पुनर्मूल्यांकन विकल्प",
    changeDesc: "आपने चुना: {candidate}। क्या आप अपना वोट किसी अन्य उम्मीदवार में बदलना चाहते हैं?",
    yesRe: "हाँ (पुनः चुनें)",
    noConfirm: "नहीं (पुष्टि करें)",
    confirmTitle: "पुष्टि करें और वोट दर्ज करें",
    confirmDesc: "आप अपना vote इसे दे रहे हैं: {candidate}। पुष्टि करने से आपका मतपत्र एन्क्रिप्ट होकर सुरक्षित रूप से सहेज लिया जाएगा।",
    submitVote: "वोट जमा करें",
    cancel: "रद्द करें",
    vvpatTitle: "VVPAT पेपर ऑडिट ट्रेल",
    vvpatDesc: "आपका मत सहेज लिया गया है। प्रिंटर पुष्टिकरण पर्ची निकाल रहा है। इसे ऑडिट बॉक्स में डालें।",
    dropSlip: "पर्ची ऑडिट बॉक्स में डालें",
    exitTitle: "निकास द्वार सत्यापन आवश्यक",
    exitDesc: "आपका वोट सत्यापित हो गया है। बाहर जाने के लिए निकास बायोमेट्रिक स्कैनर को स्पर्श करें।",
    exitScanBtn: "बाहर जाने के लिए स्कैन करें",
    completeTitle: "मतदान पूर्ण",
    completeDesc: "धन्यवाद! आपका मत सफलतापूर्वक दर्ज हो गया है। अगले मतदाता के लिए टर्मिनल रीसेट हो गया है।",
    nextVoterBtn: "अगला मतदाता शुरू करें",

    // ECI Live Command Center
    totalVotes: "कुल डाले गए वोट",
    turnout: "कुल मतदान प्रतिशत %",
    stations: "कॉन्फ़िगर किए गए केंद्र",
    threats: "सुरक्षा अलर्ट",
    activeText: "सक्रिय",
    triggeredText: "सक्रिय हुआ",
    liveTallies: "लाइव उम्मीदवार परिणाम",
    talliesDesc: "निर्वाचन क्षेत्र के वोट वास्तविक समय में दर्ज और समकालित किए जाते हैं।",
    contestant: "उम्मीदवार",
    partyName: "दल का नाम",
    symbol: "चुनाव चिह्न",
    polledVotes: "प्राप्त वोट",
    tallyBar: "परिणाम तालिका",
    cctvFeeds: "सक्रिय सीसीटीवी कैमरा फीड",
    cctvDesc: "सुरक्षा सत्यापन के लिए मतदान केंद्रों पर लाइव निगरानी फीड।",
    feedActive: "फीड सक्रिय है",
    live: "लाइव",

    // Nomination Portal
    nomInbox: "नामांकन इनबॉक्स",
    boothSetup: "बूथ सेटअप और आईपी",
    contRegistry: "प्रतियोगी रजिस्ट्री",
    candNomInbox: "उम्मीदवार नामांकन इनबॉक्स",
    nomAuditingDesc: "जमा किए गए नामांकनों की ऑडिटिंग कतार। मतपत्र पर लगाने से पहले भुगतान लेनदेन लॉग, पीडीएफ और उम्मीदवार प्रोफाइल सत्यापित करें।",
    nomId: "नामांकन आईडी",
    candName: "उम्मीदवार का नाम",
    partyAffil: "दलीय संबद्धता",
    aadharCard: "आधार कार्ड",
    secDeposit: "सुरक्षा जमा",
    verifStatus: "सत्यापन स्थिति",
    actControls: "नियंत्रण कार्रवाई",
    reviewed: "समीक्षित",
    approveBtn: "स्वीकार करें",
    rejectBtn: "अस्वीकार करें",
    
    boothAllocTitle: "बूथ आवंटन और टर्मिनल आईपी कॉन्फ़िगरेशन",
    boothAllocDesc: "निर्वाचन क्षेत्र सबनेट से जुड़े भौतिक और मोबाइल मतदान केंद्र टर्मिनल गेटवे।",
    terminalId: "टर्मिनल आईडी",
    geoLoc: "भौगोलिक स्थिति",
    constCode: "निर्वाचन क्षेत्र कोड",
    terminalIp: "टर्मिनल आईपी पता",
    cctvCamId: "सीसीटीवी कैमरा आईडी",
    secOfficer: "सुरक्षा गार्ड अधिकारी",
    operState: "परिचालन स्थिति",
    online: "ऑनलाइन",
    
    registerNewTerminal: "नया टर्मिनल गेटवे पंजीकृत करें (भौतिक / मोबाइल)",
    terminalIdCode: "टर्मिनल आईडी कोड",
    physicalLocName: "भौतिक स्थान का नाम",
    mlaConstCode: "विधायक निर्वाचन क्षेत्र कोड",
    terminalSubnetIp: "टर्मिनल सबनेट आईपी पता",
    camFeedIdCode: "कैमरा फीड आईडी कोड",
    saveConfigBtn: "सहेजें और कॉन्फ़िगरेशन पंजीकृत करें",
    
    approvedContestants: "स्वीकृत उम्मीदवार रजिस्ट्री",
    contestantRegistryDesc: "स्वीकृत उम्मीदवार मतपत्र सूची, वर्णानुक्रम में व्यवस्थित।",
    ballotId: "मतपत्र आईडी",
    contactEmail: "संपर्क ईमेल",
    regMobile: "पंजीकृत मोबाइल नंबर",

    // Results Declaration
    electedRole: "विधानसभा सदस्य के रूप में निर्वाचित (विधायक)",
    winnerVotes: "विजेता के वोट",
    runnerVotes: "उपविजेता के वोट",
    victoryMargin: "जीत का अंतर",
    resultTallyTitle: "आधिकारिक चुनाव परिणाम गणना और वोट शेयर",
    resultTallyDesc: "डेटाबेस लेनदेन रजिस्ट्रारों के माध्यम से सत्यापित निर्वाचन क्षेत्र का कुल योग।",
    printCert: "ईसीआई प्रमाणपत्र प्रिंट करें",
    rank: "रैंक",
    party: "दल",
    officialStatus: "आधिकारिक स्थिति",
    noVotesCast: "अभी कोई वोट नहीं डाला गया है",
    noVotesDesc: "मतदाताओं द्वारा मतदान केंद्र पर मतदान शुरू करने के बाद परिणाम घोषणा पैनल सक्रिय हो जाएगा।",

    // Aadhaar Registry
    aadhaarVaultTitle: "आधार रजिस्ट्री वॉल्ट",
    aadhaarVaultDesc: "सक्रिय आधार बायोमेट्रिक कुंजी, पते और लेनदेन हैश का केंद्रीय डेटाबेस।",
    aadhaarNumber: "आधार संख्या",
    fullName: "पूरा नाम",
    mlaConst: "विधायक निर्वाचन क्षेत्र",
    dobLabel: "आयु / जन्म तिथि",
    votingState: "मतदान की स्थिति",
    syncTime: "समकालन समय",
    
    timelineSettings: "चुनाव समयरेखा सेटिंग्स",
    timezoneOffset: "समय क्षेत्र ऑफ़सेट",
    pollStart: "मतदान शुरू होने का समय",
    pollEnd: "मतदान समाप्त होने का समय",
    updateConfig: "कॉन्फ़िगरेशन अपडेट करें",
    electionState: "चुनाव की स्थिति",
    toggleLock: "लॉक टॉगल करें",
    
    cryptoMathCheck: "डेटाबेस क्रिप्टोग्राफिक गणितीय सत्यापन",
    cryptoMathPassed: "NET1 = NRT2 सत्यापित।",
    candidateCol: "उम्मीदवार",
    net1Col: "NET1",
    nrt2Col: "NRT2",
    
    // Logs Footer
    sysLogsTitle: "सिस्टम लेनदेन और लॉग",
    clearConsole: "कंसोल साफ़ करें",
    // Nomination Form
    fileNomBtn: "नामांकन दाखिल करें",
    formAadharId: "उम्मीदवार आधार संख्या (12 अंक)",
    formCandName: "उम्मीदवार का पूरा नाम",
    formPartyName: "दल का नाम",
    formPartySymbol: "चुनाव चिह्न चुनें",
    formPhoto: "उम्मीदवार फोटो अवतार / इमोजी",
    formSecDeposit: "सुरक्षा जमा राशि",
    formTxnNum: "भुगतान लेनदेन संदर्भ संख्या",
    formPaidDate: "भुगतान तिथि",
    formMobile: "संपर्क मोबाइल नंबर",
    formEmail: "ईमेल पता",
    formCommAddress: "पत्राचार / संचार का पता",
    formSubmitBtn: "नामांकन पत्र जमा करें",
    formSuccessTitle: "नामांकन सफलतापूर्वक दाखिल किया गया!",
    formSuccessDesc: "आपका उम्मीदवार नामांकन प्रोफ़ाइल सुरक्षित रूप से डेटाबेस में दर्ज हो गया है। निर्वाचन अधिकारी जल्द ही इसकी समीक्षा करेंगे।",
    formBackBtn: "एक और नामांकन दाखिल करें",
    // Election Types
    electionType: "चुनाव का प्रकार",
    superAdminConsole: "सुपर एडमिन कंसोल",
    electionTypesTab: "चुनाव प्रकार प्रबंधक",
    addElectionType: "नया चुनाव प्रकार जोड़ें",
    elecId: "चुनाव आईडी (अल्फ़ान्यूमेरिक, लोअरकेस)",
    elecName: "चुनाव का नाम",
    elecDesc: "चुनाव विवरण",
    saveElecType: "चुनाव प्रकार सहेजें",
    elecSuccess: "चुनाव प्रकार सफलतापूर्वक बनाया गया!"
  }
};

// ============================================================
// PARTY SYMBOLS PER ELECTION TYPE
// Each election type has its own set of parties/symbols
// so symbols from one type never bleed into another.
// ============================================================
const ELECTION_TYPE_SYMBOLS = {
  general: [
    { symbol: '🪷', label: 'Lotus (BJP)' },
    { symbol: '✋', label: 'Hand (INC)' },
    { symbol: '🛠️', label: 'Hammer & Sickle (CPI)' },
    { symbol: '🚲', label: 'Bicycle (TDP)' },
    { symbol: '⚖️', label: 'Scale (YSRCP)' },
    { symbol: '☀️', label: 'Sun (DMK)' },
    { symbol: '🐘', label: 'Elephant (BSP)' },
    { symbol: '🦁', label: 'Lion (Independent)' },
    { symbol: '🏹', label: 'Bow & Arrow (SHS)' },
    { symbol: '🌾', label: 'Ear of Corn (CPI-M)' }
  ],
  banking: [
    { symbol: '🏦', label: 'Bank Building (Board Nominee)' },
    { symbol: '💰', label: 'Money Bag (Finance Panel)' },
    { symbol: '📊', label: 'Bar Chart (Growth Alliance)' },
    { symbol: '🤝', label: 'Handshake (Cooperative Front)' },
    { symbol: '💳', label: 'Credit Card (Digital Banking)' },
    { symbol: '🔐', label: 'Lock (Secure Deposits)' },
    { symbol: '🏛️', label: 'Pillars (Heritage Banking)' },
    { symbol: '📈', label: 'Rising Chart (Progress Group)' }
  ],
  college: [
    { symbol: '🎓', label: 'Graduation Cap (Scholar Party)' },
    { symbol: '📚', label: 'Books (Student Alliance)' },
    { symbol: '✏️', label: 'Pencil (Creative Front)' },
    { symbol: '🏅', label: 'Medal (Sports Council)' },
    { symbol: '🔬', label: 'Microscope (Science Club)' },
    { symbol: '🎨', label: 'Palette (Arts Panel)' },
    { symbol: '🌱', label: 'Seedling (Green Campus)' },
    { symbol: '💡', label: 'Bulb (Innovation Group)' }
  ]
};

// Returns symbols for a given election type, falls back to generic list
function getSymbolsForType(electionTypeId) {
  return ELECTION_TYPE_SYMBOLS[electionTypeId] || [
    { symbol: '⭐', label: 'Star (Independent)' },
    { symbol: '🔵', label: 'Blue Circle (Panel A)' },
    { symbol: '🔴', label: 'Red Circle (Panel B)' },
    { symbol: '🟢', label: 'Green Circle (Panel C)' },
    { symbol: '🏳️', label: 'Flag (Neutral)' }
  ];
}

// Seed Database fallback defaults
const DEFAULT_VOTERS = [
  { aadhar_id: '123456789012', name: 'Rahul Sharma', address: 'Plot 45, Jubilee Hills, Hyderabad, AP-094', dob: '1990-05-14', fingerprint_hash: 'FP_RAHUL_9081', iris_hash: 'IRIS_RAHUL_4421', has_voted: false, vote_timestamp: null, mla_constituency: 'AP-094', mp_constituency: 'MP-05' },
  { aadhar_id: '987654321098', name: 'Priya Patel', address: 'Flat 102, Gachibowli, Hyderabad, AP-094', dob: '1995-11-22', fingerprint_hash: 'FP_PRIYA_3321', iris_hash: 'IRIS_PRIYA_8812', has_voted: false, vote_timestamp: null, mla_constituency: 'AP-094', mp_constituency: 'MP-05' },
  { aadhar_id: '111122223333', name: 'Amit Kumar', address: 'Ward 3, Nizamabad, AP-094', dob: '1988-02-09', fingerprint_hash: 'FP_AMIT_7751', iris_hash: 'IRIS_AMIT_1123', has_voted: true, vote_timestamp: '2026-08-29T10:15:30Z', mla_constituency: 'AP-094', mp_constituency: 'MP-05' },
  { aadhar_id: '444455556666', name: 'Sarah D Souza', address: 'Secunderabad Cantonment, AP-094', dob: '1992-08-30', fingerprint_hash: 'FP_SARAH_0091', iris_hash: 'IRIS_SARAH_9941', has_voted: false, vote_timestamp: null, mla_constituency: 'AP-094', mp_constituency: 'MP-05' },
  { aadhar_id: '777788889999', name: 'Rajesh Rao', address: 'Khammam Central, TS-012', dob: '1985-04-17', fingerprint_hash: 'FP_RAJESH_8123', iris_hash: 'IRIS_RAJESH_0098', has_voted: false, mla_constituency: 'TS-012', mp_constituency: 'MP-02' }
];

const DEFAULT_NOMINATIONS = [
  { nomination_id: 1, candidate_aadhar_id: '222233334444', name_of_candidate: 'A. Ramu', party_name: 'BJP', party_symbol: '🪷', candidate_photo: 'AR', fee_amount: 25000, paid_date: '2026-08-10', transaction_number: 'TXN88921', mobile: '9988776655', email: 'ramu@bjp.org', communication_address: 'Visakhapatnam AP', status: 'APPROVED', election_type: 'general' },
  { nomination_id: 2, candidate_aadhar_id: '555566667777', name_of_candidate: 'D. Suresh', party_name: 'CONGRESS-I', party_symbol: '✋', candidate_photo: 'DS', fee_amount: 25000, paid_date: '2026-08-12', transaction_number: 'TXN91882', mobile: '9848012345', email: 'suresh@congress.in', communication_address: 'Vijayawada AP', status: 'APPROVED', election_type: 'general' },
  { nomination_id: 3, candidate_aadhar_id: '888899990000', name_of_candidate: 'M. Naresh', party_name: 'CPI', party_symbol: '🛠️', candidate_photo: 'MN', fee_amount: 25000, paid_date: '2026-08-14', transaction_number: 'TXN11209', mobile: '9440123456', email: 'naresh@cpi.org', communication_address: 'Guntur AP', status: 'APPROVED', election_type: 'general' },
  { nomination_id: 4, candidate_aadhar_id: '999900001111', name_of_candidate: 'K. Rao', party_name: 'TDP', party_symbol: '🚲', candidate_photo: 'KR', fee_amount: 25000, paid_date: '2026-08-18', transaction_number: 'TXN50442', mobile: '9177283921', email: 'rao@tdp.org', communication_address: 'Tirupati AP', status: 'PENDING', election_type: 'general' }
];

const DEFAULT_BOOTHS = [
  { booth_number: 'BOOTH-01', location_name: 'Government High School, Room 1', mla_constituency_code: 'AP-094', mp_constituency_code: 'MP-05', camera_id: 'CAM-0192', ip_address: '192.168.10.4', agent_name: 'Inspector Prasad', election_type: 'general' },
  { booth_number: 'BOOTH-02', location_name: 'Community Hall, Gachibowli', mla_constituency_code: 'AP-094', mp_constituency_code: 'MP-05', camera_id: 'CAM-0881', ip_address: '192.168.10.15', agent_name: 'Sub-Inspector Nair', election_type: 'general' },
  { booth_number: 'BOOTH-03 (MPS)', location_name: 'Mobile Van 1 (Armed Escorted)', mla_constituency_code: 'AP-094', mp_constituency_code: 'MP-05', camera_id: 'CAM-0552', ip_address: '10.120.45.101', agent_name: 'Commander Das', election_type: 'general' }
];

const DEFAULT_POLLS = [
  { booth_number: 'BOOTH-01', candidate_name: 'A. Ramu', party_name: 'BJP', mla_constituency: 'AP-094', vote_time: '2026-08-29T08:14:02Z', election_type: 'general' },
  { booth_number: 'BOOTH-01', candidate_name: 'D. Suresh', party_name: 'CONGRESS-I', mla_constituency: 'AP-094', vote_time: '2026-08-29T08:25:40Z', election_type: 'general' },
  { booth_number: 'BOOTH-02', candidate_name: 'A. Ramu', party_name: 'BJP', mla_constituency: 'AP-094', vote_time: '2026-08-29T08:33:11Z', election_type: 'general' }
];

const DEFAULT_ELECTION_TYPES = [
  { id: 'general', name: 'General Assembly Elections', desc: 'National/State democratic legislative voting.' },
  { id: 'banking', name: 'Banking Board Elections', desc: 'Board of directors election for cooperative banks.' },
  { id: 'college', name: 'College Union Elections', desc: 'Student council representative elections.' }
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

function App() {
  // Navigation & Role states
  const [activeTab, setActiveTab] = useState('voter');
  const [adminPanel, setAdminPanel] = useState('nominations');
  const [usingBackend, setUsingBackend] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'en');
  const [electionTypes, setElectionTypes] = useState([]);
  const [activeElectionType, setActiveElectionType] = useState('general');
  const [newElecId, setNewElecId] = useState('');
  const [newElecName, setNewElecName] = useState('');
  const [newElecDesc, setNewElecDesc] = useState('');

  // Auth states
  const [userRole, setUserRole] = useState(null); // null | 'admin' | 'superadmin'
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginTarget, setLoginTarget] = useState(null); // 'admin' | 'super-admin'
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const LANG_OPTIONS = [
    { code: 'en', flag: '🌐', label: 'English',   short: 'English' },
    { code: 'te', flag: '🇮🇳', label: 'తెలుగు',   short: 'తెలుగు' },
    { code: 'hi', flag: '🇮🇳', label: 'हिन्दी',    short: 'हिन्दी' }
  ];
  const activeLang = LANG_OPTIONS.find(l => l.code === lang) || LANG_OPTIONS[0];

  // Admin Access Management States
  const [adminCredentials, setAdminCredentials] = useState(() => {
    const saved = localStorage.getItem('admin_credentials');
    return saved ? JSON.parse(saved) : [
      { username: 'superadmin', password: 'super@123',  role: 'superadmin' },
      { username: 'admin',      password: 'admin@123',  role: 'admin', assignedElectionType: 'general' }
    ];
  });
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminElec, setNewAdminElec] = useState('general');
  const [adminSetupMsg, setAdminSetupMsg] = useState('');
  const handleTabClick = (tab) => {
    if ((tab === 'admin' || tab === 'super-admin') && !userRole) {
      setLoginTarget(tab);
      setLoginError('');
      setLoginUsername('');
      setLoginPassword('');
      setShowLoginModal(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const match = adminCredentials.find(
      c => c.username === loginUsername.trim() && c.password === loginPassword
    );
    if (!match) {
      setLoginError('Invalid username or password. Please try again.');
      return;
    }
    // Super-admin tab requires superadmin role
    if (loginTarget === 'super-admin' && match.role !== 'superadmin') {
      setLoginError('Access denied. Super Admin credentials required.');
      return;
    }
    setUserRole(match.role);
    setShowLoginModal(false);
    setActiveTab(loginTarget);
    
    // Assign election type for specific admins
    if (match.role === 'admin' && match.assignedElectionType) {
      setActiveElectionType(match.assignedElectionType);
      addSysLog(`Authenticated as ADMIN restricted to election type: ${match.assignedElectionType.toUpperCase()}`, 'success');
    } else {
      addSysLog(`Authenticated as ${match.role.toUpperCase()}: ${match.username}`, 'success');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab('voter');
    addSysLog('User logged out. Session ended.', 'info');
  };

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

  // Database States
  const [voters, setVoters] = useState([]);
  const [nominations, setNominations] = useState([]);
  const [booths, setBooths] = useState([]);
  const [polls, setPolls] = useState([]);

  // Config States
  const [timezone, setTimezone] = useState('GMT+5:30');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('18:00');
  const [electionStatus, setElectionStatus] = useState('ACTIVE');

  // Voter Flow States
  const [currentVoter, setCurrentVoter] = useState(null);
  const [scannedBiometric, setScannedBiometric] = useState(false);
  const [entryDoorOpen, setEntryDoorOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votingStep, setVotingStep] = useState('auth-required'); // auth-required, e-ballot, change-confirm, submit-confirm, vvpatslip, exit-required, completed
  const [exitDoorOpen, setExitDoorOpen] = useState(false);

  // Forms States
  const [newBoothId, setNewBoothId] = useState('');
  const [newBoothLocation, setNewBoothLocation] = useState('');
  const [newBoothIp, setNewBoothIp] = useState('');
  const [newBoothCamera, setNewBoothCamera] = useState('');

  // Logging Console
  const [systemLogs, setSystemLogs] = useState([]);
  const logsEndRef = useRef(null);

  const speakText = (text) => {
    if (soundEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const triggerSimulation = async () => {
    addSysLog('Initiating batch simulation of 25 votes...', 'info');
    if (usingBackend) {
      try {
        const res = await fetch(`${API_BASE}/api/super/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ election_type: activeElectionType })
        });
        const data = await res.json();
        if (data.success) {
          addSysLog(`Successfully simulated and logged ${data.count} votes in the database.`, 'success');
          speakText(`Simulated ${data.count} votes successfully.`);
          await syncData();
        }
      } catch (e) {
        addSysLog('Simulation error.', 'danger');
      }
    } else {
      const timestamp = new Date().toISOString();
      const unvoted = voters.filter(v => !v.has_voted);
      if (unvoted.length === 0) {
        alert('All registered voters have already voted.');
        return;
      }
      const approved = nominations.filter(n => n.status === 'APPROVED' && (n.election_type || 'general') === activeElectionType);
      const candidates = approved.map(c => ({ name: c.name_of_candidate, party: c.party_name }));
      candidates.push({ name: 'NOTA', party: 'NOTA' });

      const count = Math.min(25, unvoted.length);
      const newVotes = [];
      const updatedVoters = voters.map(v => {
        const isUnvotedIndex = unvoted.slice(0, count).some(uv => uv.aadhar_id === v.aadhar_id);
        if (isUnvotedIndex) {
          const choice = candidates[Math.floor(Math.random() * candidates.length)];
          newVotes.push({
            booth_number: 'BOOTH-01',
            candidate_name: choice.name,
            party_name: choice.party,
            mla_constituency: v.mla_constituency,
            vote_time: timestamp,
            election_type: activeElectionType
          });
          return { ...v, has_voted: true, vote_timestamp: timestamp };
        }
        return v;
      });

      setPolls(prev => [...prev, ...newVotes]);
      setVoters(updatedVoters);
      setDB('polls_db', [...polls, ...newVotes]);
      setDB('voters_db', updatedVoters);
      
      addSysLog(`Simulated and logged ${count} votes in LocalStorage.`, 'success');
      speakText(`Simulated ${count} votes locally.`);
    }
  };


  // Sync state on load and tab change
  useEffect(() => {
    syncData();
  }, [activeTab]);

  // Close language dropdown when clicking anywhere outside
  useEffect(() => {
    if (!showLangMenu) return;
    const handler = () => setShowLangMenu(false);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showLangMenu]);

  useEffect(() => {
    // Only auto-scroll within the logs container, never scroll the whole page
    if (logsEndRef.current) {
      const container = logsEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [systemLogs]);

  const addSysLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setSystemLogs(prev => [...prev, { time, msg, type }]);
  };

  const syncData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      if (res.ok) {
        const settings = await res.json();
        setTimezone(settings.timezone || 'GMT+5:30');
        setStartTime(settings.start_time || '07:00');
        setEndTime(settings.end_time || '18:00');
        setElectionStatus(settings.status || 'ACTIVE');

        setVoters(await (await fetch(`${API_BASE}/api/voters`)).json());
        setNominations(await (await fetch(`${API_BASE}/api/nominations`)).json());
        setBooths(await (await fetch(`${API_BASE}/api/booths`)).json());
        setPolls(await (await fetch(`${API_BASE}/api/polls`)).json());

        const typesRes = await fetch(`${API_BASE}/api/election-types`);
        if (typesRes.ok) {
          setElectionTypes(await typesRes.json());
        }

        if (!usingBackend) {
          setUsingBackend(true);
          addSysLog('Link established: Express MongoDB backend connected.', 'success');
        }
      } else {
        throw new Error('API offline');
      }
    } catch (e) {
      setUsingBackend(false);
      setVoters(getDB('voters_db', DEFAULT_VOTERS));
      setNominations(getDB('nominations_db', DEFAULT_NOMINATIONS));
      setBooths(getDB('booths_db', DEFAULT_BOOTHS));
      setPolls(getDB('polls_db', DEFAULT_POLLS));
      setElectionTypes(getDB('election_types_db', DEFAULT_ELECTION_TYPES));
      addSysLog('Running in offline LocalStorage fallback mode.', 'warning');
    }
  };

  // ==========================================
  // VOTER FLOW HANDLERS
  // ==========================================

  const handleVoterSelect = (e) => {
    const val = e.target.value;
    if (!val) {
      setCurrentVoter(null);
      resetVoterFlow();
      return;
    }
    const matched = voters.find(v => v.aadhar_id === val);
    setCurrentVoter(matched);
    addSysLog(`Voter profile selected: ${matched.name} (Aadhar: ${matched.aadhar_id})`, 'info');
    setVotingStep('auth-required');
    setScannedBiometric(false);
    setEntryDoorOpen(false);
    setExitDoorOpen(false);
  };

  const startBiometricScan = (type) => {
    if (!currentVoter) {
      alert('Please select a voter profile first!');
      return;
    }

    const scanner = document.getElementById(`${type}-scanner`);
    if (scanner) scanner.classList.add('scanning');
    addSysLog(`Initiating ${type.toUpperCase()} scan against Aadhar vault...`, 'info');

    setTimeout(async () => {
      if (scanner) scanner.classList.remove('scanning');

      if (usingBackend) {
        try {
          const res = await fetch(`${API_BASE}/api/voters/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aadhar_id: currentVoter.aadhar_id })
          });
          const responseData = await res.json();

          if (!res.ok) {
            addSysLog(`SECURITY DENIED: ${responseData.error}`, 'danger');
            alert(`Security Warning: ${responseData.error}`);
            resetVoterFlow();
            syncData();
            return;
          }

          addSysLog(`Aadhar matched: Verified.`, 'success');
          setScannedBiometric(true);
          setEntryDoorOpen(true);

          setTimeout(() => {
            setEntryDoorOpen(false);
            setVotingStep('e-ballot');
            addSysLog('Entry Door locked. E-Ballot Terminal activated.', 'info');
          }, 1500);
        } catch (err) {
          addSysLog('Backend Connection lost during scan.', 'danger');
        }
      } else {
        if (currentVoter.has_voted) {
          addSysLog(`CRITICAL SECURITY ALERT: Aadhar ID ${currentVoter.aadhar_id} multiple voting trigger.`, 'danger');
          alert(`Security Violation: Voter ${currentVoter.name} has already voted.`);
          resetVoterFlow();
          return;
        }

        addSysLog(`Aadhar matched: Verified locally.`, 'success');
        setScannedBiometric(true);
        setEntryDoorOpen(true);

        setTimeout(() => {
          setEntryDoorOpen(false);
          setVotingStep('e-ballot');
        }, 1500);
      }
    }, 1500);
  };

  const selectCandidate = (cand) => {
    setSelectedCandidate(cand);
    addSysLog(`Selection registered: ${cand.name_of_candidate}.`, 'info');
    setVotingStep('change-confirm');
  };

  const confirmChangeDecision = (change) => {
    if (change) {
      addSysLog('Voter re-selecting candidate.', 'warning');
      setSelectedCandidate(null);
      setVotingStep('e-ballot');
    } else {
      addSysLog('Selection finalized.', 'success');
      setVotingStep('submit-confirm');
    }
  };

  const submitFinalVote = async () => {
    if (!selectedCandidate || !currentVoter) return;

    addSysLog(`Transmitting vote to local server...`, 'info');
    const voteTime = new Date().toISOString();

    if (usingBackend) {
      try {
        const res = await fetch(`${API_BASE}/api/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            aadhar_id: currentVoter.aadhar_id,
            candidate_name: selectedCandidate.name_of_candidate,
            party_name: selectedCandidate.party_name,
            mla_constituency: currentVoter.mla_constituency,
            vote_time: voteTime,
            election_type: activeElectionType
          })
        });

        if (res.ok) {
          addSysLog('Vote transaction securely saved to MongoDB database.', 'success');
          setVotingStep('vvpatslip');
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
      const newVote = {
        booth_number: 'BOOTH-01',
        candidate_name: selectedCandidate.name_of_candidate,
        party_name: selectedCandidate.party_name,
        mla_constituency: currentVoter.mla_constituency,
        vote_time: voteTime,
        election_type: activeElectionType
      };
      const updatedPolls = [...polls, newVote];
      setPolls(updatedPolls);
      setDB('polls_db', updatedPolls);

      const updatedVoters = voters.map(v => {
        if (v.aadhar_id === currentVoter.aadhar_id) {
          return { ...v, has_voted: true, vote_timestamp: voteTime };
        }
        return v;
      });
      setVoters(updatedVoters);
      setDB('voters_db', updatedVoters);

      addSysLog('Vote transaction written locally.', 'success');
      setVotingStep('vvpatslip');
      setTimeout(() => {
        const slip = document.getElementById('vvpat-receipt-slip');
        if (slip) slip.classList.add('dispensed');
      }, 500);
    }
  };

  const dropSlipInBox = () => {
    addSysLog('VVPAT confirmation slip deposited inside the sealed drop box.', 'success');
    setVotingStep('exit-required');
  };

  const startExitBiometricScan = () => {
    const scanner = document.getElementById('exit-scanner');
    if (scanner) scanner.classList.add('scanning');
    addSysLog('Verifying voter identity biometric at EXIT door...', 'info');

    setTimeout(() => {
      if (scanner) scanner.classList.remove('scanning');
      addSysLog('Exit scan complete. Matching signature validated.', 'success');
      setExitDoorOpen(true);
      addSysLog('Exit Solenoid unlocked. Voter exited booth.', 'success');

      setTimeout(async () => {
        setExitDoorOpen(false);
        setVotingStep('completed');
        addSysLog('Exit door closed. System reset. Status: GREEN.', 'info');
        setCurrentVoter(null);
        setSelectedCandidate(null);
        await syncData();
      }, 1500);
    }, 1500);
  };

  const resetVoterFlow = () => {
    setCurrentVoter(null);
    setSelectedCandidate(null);
    setScannedBiometric(false);
    setEntryDoorOpen(false);
    setExitDoorOpen(false);
    setVotingStep('auth-required');
  };

  // ==========================================
  // ADMIN PORTAL OPERATIONS
  // ==========================================

  const auditNomination = async (id, decision) => {
    if (usingBackend) {
      try {
        const res = await fetch(`${API_BASE}/api/nominations/audit`, {
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
      const updated = nominations.map(n => {
        if (n.nomination_id === id) {
          return { ...n, status: decision };
        }
        return n;
      });
      setNominations(updated);
      setDB('nominations_db', updated);
      addSysLog(`Nomination updated locally: ${decision}`, 'success');
    }
  };

  const handleCreateElectionType = async (e) => {
    e.preventDefault();
    if (!newElecId || !newElecName || !newElecDesc) {
      alert('All election type inputs are required.');
      return;
    }

    const payload = { id: newElecId, name: newElecName, desc: newElecDesc };

    if (usingBackend) {
      try {
        const res = await fetch(`${API_BASE}/api/election-types`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Failed to save election type.');
          return;
        }
        addSysLog(`Created new election type on DB: ${newElecName}`, 'success');
        speakText(`Election type ${newElecName} created successfully.`);
        await syncData();
      } catch (err) {
        addSysLog('Database error saving election type. Falling back to local state.', 'warning');
      }
    }

    // Local update
    const dup = electionTypes.some(et => et.id === newElecId);
    if (dup) {
      alert('An election type with this ID already exists.');
      return;
    }

    const updated = [...electionTypes, payload];
    setElectionTypes(updated);
    setDB('election_types_db', updated);
    addSysLog(`Registered election type locally: ${newElecName}`, 'info');

    // Reset inputs
    setNewElecId('');
    setNewElecName('');
    setNewElecDesc('');
  };

  const submitNomination = async (e) => {
    e.preventDefault();
    
    // Simple 12-digit Aadhaar validation
    if (!/^\d{12}$/.test(nomAadhar)) {
      alert('Aadhaar Number must be exactly 12 numeric digits.');
      return;
    }

    const payload = {
      candidate_aadhar_id: nomAadhar,
      name_of_candidate: nomName,
      party_name: nomPartyName,
      party_symbol: nomPartySymbol,
      candidate_photo: nomPhoto,
      fee_amount: 25000,
      paid_date: nomPaidDate,
      transaction_number: nomTxnNum,
      mobile: nomMobile,
      email: nomEmail,
      communication_address: nomCommAddress,
      election_type: activeElectionType
    };

    if (usingBackend) {
      try {
        const res = await fetch(`${API_BASE}/api/nominations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Failed to submit nomination.');
          return;
        }
        addSysLog(`Nomination filed on DB for: ${nomName}`, 'success');
        speakText(`Nomination filed successfully for ${nomName}`);
      } catch (err) {
        addSysLog('Database nomination submit failed. Falling back to local state.', 'warning');
      }
    }

    // Always update local state & localStorage db to ensure smooth sync
    const maxNom = nominations.reduce((max, n) => n.nomination_id > max ? n.nomination_id : max, 0);
    const nextId = maxNom + 1;
    const newEntry = {
      nomination_id: nextId,
      ...payload,
      status: 'APPROVED'
    };

    // Check duplicate locally
    const dup = nominations.some(n => n.candidate_aadhar_id === nomAadhar);
    if (dup) {
      alert('A nomination has already been filed for this Aadhaar ID.');
      return;
    }

    const updatedList = [...nominations, newEntry];
    setNominations(updatedList);
    setDB('nominations_db', updatedList);
    addSysLog(`Local nomination registered: ${nomName} (${nomPartyName})`, 'info');

    // Trigger Success view and reset form values
    setNomSuccess(true);
    setNomAadhar('');
    setNomName('');
    setNomPartyName('');
    setNomPartySymbol('🪷');
    setNomPhoto('👤');
    setNomTxnNum('');
    setNomPaidDate(new Date().toISOString().split('T')[0]);
    setNomMobile('');
    setNomEmail('');
    setNomCommAddress('');
  };

  const createNewBooth = async (e) => {
    e.preventDefault();
    if (!newBoothId || !newBoothLocation || !newBoothIp || !newBoothCamera) {
      alert('All booth configuration inputs are required.');
      return;
    }

    const newBooth = {
      booth_number: newBoothId,
      location_name: newBoothLocation,
      mla_constituency_code: 'AP-094',
      camera_id: newBoothCamera,
      ip_address: newBoothIp,
      agent_name: 'Zonal Guard Assigned',
      election_type: activeElectionType
    };

    if (usingBackend) {
      try {
        const res = await fetch(`${API_BASE}/api/booths`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBooth)
        });
        if (res.ok) {
          addSysLog(`Registered new booth terminal: ${newBoothId} to MongoDB db.`, 'success');
          await syncData();
        } else {
          const data = await res.json();
          alert(data.error);
        }
      } catch (e) {
        addSysLog('Booth terminal insertion failed.', 'danger');
      }
    } else {
      const updated = [...booths, newBooth];
      setBooths(updated);
      setDB('booths_db', updated);
      addSysLog(`Registered booth terminal locally: ${newBoothId}`, 'success');
    }

    setNewBoothId('');
    setNewBoothLocation('');
    setNewBoothIp('');
    setNewBoothCamera('');
  };

  // ==========================================
  // SUPER ADMIN OPERATIONS
  // ==========================================

  const saveSuperSettings = async (e) => {
    e.preventDefault();
    if (usingBackend) {
      try {
        await fetch(`${API_BASE}/api/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timezone, start_time: startTime, end_time: endTime })
        });
        addSysLog('Electoral settings updated in database settings.', 'success');
        await syncData();
      } catch (e) {
        addSysLog('Settings update failed.', 'danger');
      }
    } else {
      addSysLog('Electoral settings saved in memory.', 'success');
    }
    alert('Timeline settings saved.');
  };

  const toggleElectionStatus = async () => {
    const nextStatus = electionStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    if (usingBackend) {
      try {
        await fetch(`${API_BASE}/api/settings`, {
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
      setElectionStatus(nextStatus);
      addSysLog(`ELECTION STATE: Changed to ${nextStatus}.`, 'success');
    }
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (adminCredentials.some(c => c.username === newAdminUser.trim())) {
      setAdminSetupMsg('Error: Username already exists!');
      return;
    }
    const updated = [...adminCredentials, { 
      username: newAdminUser.trim(), 
      password: newAdminPass, 
      role: 'admin', 
      assignedElectionType: newAdminElec 
    }];
    setAdminCredentials(updated);
    localStorage.setItem('admin_credentials', JSON.stringify(updated));
    setAdminSetupMsg(`Success: Admin '${newAdminUser}' created for ${newAdminElec}!`);
    setNewAdminUser('');
    setNewAdminPass('');
    setTimeout(() => setAdminSetupMsg(''), 5000);
  };

  const resetSimulation = async () => {
    if (confirm('Are you sure you want to clear current polls database and reset all voter statuses?')) {
      if (usingBackend) {
        try {
          await fetch(`${API_BASE}/api/super/reset`, { method: 'POST' });
          addSysLog('MongoDB Database collections cleared and re-seeded successfully.', 'warning');
          await syncData();
        } catch (e) {
          addSysLog('Database reset failed.', 'danger');
        }
      } else {
        localStorage.removeItem('polls_db');
        localStorage.removeItem('voters_db');
        const resetVoters = DEFAULT_VOTERS.map(v => ({ ...v, has_voted: false, vote_timestamp: null }));
        setVoters(resetVoters);
        setPolls(DEFAULT_POLLS);
        setDB('voters_db', resetVoters);
        setDB('polls_db', DEFAULT_POLLS);
        addSysLog('LocalStorage data cleared.', 'warning');
      }

      resetVoterFlow();
      alert('Simulation reset complete.');
    }
  };

  // Integrity Tally Math Helper
  const renderAuditIntegrityRows = () => {
    const approved = nominations.filter(n => n.status === 'APPROVED' && (n.election_type || 'general') === activeElectionType);
    const filteredBooths = booths.filter(b => (b.election_type || 'general') === activeElectionType);
    const filteredPolls = polls.filter(p => (p.election_type || 'general') === activeElectionType);
    let overallPassed = true;
    let netTotal = 0;
    let nrtTotal = 0;

    const rows = approved.map(c => {
      let net1 = 0;
      filteredBooths.forEach(b => {
        const count = filteredPolls.filter(p => p.booth_number === b.booth_number && p.candidate_name === c.name_of_candidate).length;
        net1 += count;
      });
      const nrt2 = filteredPolls.filter(p => p.candidate_name === c.name_of_candidate).length;
      const matches = net1 === nrt2;
      if (!matches) overallPassed = false;

      netTotal += net1;
      nrtTotal += nrt2;

      return (
        <tr key={c.nomination_id}>
          <td><strong>{c.name_of_candidate} ({c.party_name})</strong></td>
          <td>{net1}</td>
          <td>{nrt2}</td>
          <td>
            <span style={{ color: matches ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
              {matches ? '✓ PASSED (NET1 = NRT2)' : '✗ FAULT DETECTED'}
            </span>
          </td>
        </tr>
      );
    });

    let notaNet1 = 0;
    filteredBooths.forEach(b => {
      notaNet1 += filteredPolls.filter(p => p.booth_number === b.booth_number && p.candidate_name === 'NOTA').length;
    });
    const notaNrt2 = filteredPolls.filter(p => p.candidate_name === 'NOTA').length;
    netTotal += notaNet1;
    nrtTotal += notaNrt2;

    const allPassed = overallPassed && (netTotal === nrtTotal);

    return {
      allPassed,
      rows: (
        <>
          {rows}
          <tr key="nota">
            <td><strong>None of the Above (NOTA)</strong></td>
            <td>{notaNet1}</td>
            <td>{notaNrt2}</td>
            <td>
              <span style={{ color: notaNet1 === notaNrt2 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                {notaNet1 === notaNrt2 ? '✓ PASSED' : '✗ FAULT DETECTED'}
              </span>
            </td>
          </tr>
          <tr key="total" style={{ background: 'rgba(255,255,255,0.03)', fontWeight: 'bold' }}>
            <td>AGGREGATED TOTAL</td>
            <td>{netTotal}</td>
            <td>{nrtTotal}</td>
            <td>
              <span style={{ color: allPassed ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                {allPassed ? 'SECURE' : 'COMPROMISED'}
              </span>
            </td>
          </tr>
        </>
      )
    };
  };

  const auditResults = renderAuditIntegrityRows();

  const calculateWinnerInfo = () => {
    const approved = nominations.filter(n => n.status === 'APPROVED' && (n.election_type || 'general') === activeElectionType);
    if (approved.length === 0) return null;

    const filteredPolls = polls.filter(p => (p.election_type || 'general') === activeElectionType);

    const tallies = approved.map(c => {
      const count = filteredPolls.filter(p => p.candidate_name === c.name_of_candidate).length;
      return { ...c, votes: count };
    });
    
    const notaCount = filteredPolls.filter(p => p.candidate_name === 'NOTA').length;
    tallies.push({ name_of_candidate: 'None of the Above (NOTA)', party_name: 'NOTA', party_symbol: '✖️', votes: notaCount, nomination_id: 'NOTA' });

    tallies.sort((a, b) => b.votes - a.votes);

    const winner = tallies[0];
    const runner = tallies.length > 1 ? tallies[1] : { name_of_candidate: 'N/A', votes: 0 };
    const totalVotes = filteredPolls.length;

    return {
      winner,
      runner,
      totalVotes,
      rankings: tallies
    };
  };

  const winInfo = calculateWinnerInfo();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="app-container">
      {/* ========================================== */}
      {/* HEADER & NAVIGATION                        */}
      {/* ========================================== */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-badge">
              <span style={{ fontSize: '1.25rem' }}>🏛️</span>
            </div>
            <div className="brand-info">
              <div className="brand-title">
                <span>AADHAAR</span>
                <span className="brand-tag">VOTEX</span>
              </div>
              <span className="brand-subtitle">{t.subtitle || 'Automated Secure Democracy'}</span>
            </div>
          </div>

          <nav className="role-tabs">
            <button className={`tab-btn ${activeTab === 'voter' ? 'active' : ''}`} onClick={() => handleTabClick('voter')}>
              <span>🗳️</span> {t.kiosk}
            </button>
            <button className={`tab-btn ${activeTab === 'observer' ? 'active' : ''}`} onClick={() => handleTabClick('observer')}>
              <span>📽️</span> {t.commandCenter}
            </button>
            <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => handleTabClick('results')}>
              <span>🏆</span> {t.resDecl}
            </button>
            <a href="/admin" style={{ textDecoration: 'none' }}>
              <button type="button" className="tab-btn">
                <span>🔐</span> Admin Portal
              </button>
            </a>
          </nav>

          <div className="header-actions">
            {/* Language Selector */}
            <select
              value={lang}
              onChange={(e) => {
                const newLang = e.target.value;
                setLang(newLang);
                localStorage.setItem('app_lang', newLang);
                addSysLog(`Language changed to: ${newLang.toUpperCase()}`, 'info');
              }}
              className="header-select"
              title="Select Language"
            >
              <option value="en" style={{ background: '#0f172a', color: '#fff' }}>🌐 English</option>
              <option value="te" style={{ background: '#0f172a', color: '#fff' }}>🇮🇳 తెలుగు (Telugu)</option>
              <option value="hi" style={{ background: '#0f172a', color: '#fff' }}>🇮🇳 हिन्दी (Hindi)</option>
            </select>

            <button className="header-btn sound" onClick={() => setSoundEnabled(!soundEnabled)} title="Toggle Audio">
              <span>{soundEnabled ? `🔊 ${t.sound}` : `🔇 Muted`}</span>
            </button>
            <button className="header-btn simulate" onClick={triggerSimulation} title="Simulate 25 Votes">
              <span>⚡ {t.simulate}</span>
            </button>
            <button className="header-btn reset" onClick={resetSimulation} title="Reset Database">
              <span>🔄 {t.reset}</span>
            </button>
            {userRole && (
              <button className="header-btn" onClick={handleLogout} style={{ background: 'rgba(255,23,68,0.15)', border: '1px solid rgba(255,23,68,0.4)', color: 'var(--danger)' }}>
                <span>🚪 Logout ({userRole})</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* MAIN CONTENT AREA                          */}
      {/* ========================================== */}
      <main className="app-content">

        {/* 1. POLL KIOSK (VOTER FLOW) */}
        {activeTab === 'voter' && (
          <section id="voter-view" className="view-section active">
            <div className="voter-split-layout">
              {/* Left Controls */}
              <div className="booth-controls-card glass-panel">
                <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{t.boothConsole}</h2>

                <div className="form-group">
                  <label htmlFor="voter-identity-select">{t.voterEntry}</label>
                  <select id="voter-identity-select" className="form-input" onChange={handleVoterSelect} value={currentVoter ? currentVoter.aadhar_id : ''}>
                    <option value="">{t.voterSelectPlaceholder}</option>
                    {voters.map(v => (
                      <option key={v.aadhar_id} value={v.aadhar_id}>
                        {v.name} ({v.aadhar_id}) - {v.has_voted ? t.voted : t.notVoted}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="indicator-lights">
                  <div className="light-box">
                    <div id="red-light" className={`light-bulb red ${votingStep !== 'auth-required' ? 'active' : ''}`}></div>
                    <span>{t.wait}</span>
                  </div>
                  <div className="light-box">
                    <div id="green-light" className={`light-bulb green ${votingStep === 'auth-required' ? 'active' : ''}`}></div>
                    <span>{t.proceed}</span>
                  </div>
                </div>

                <div className="physical-gate-sim">
                  <div id="entry-gate" className={`gate-container ${entryDoorOpen ? 'open' : ''}`}>
                    <div className="gate-label">{t.entryActuator}</div>
                    <div className="gate-doors">
                      <div className="gate-door left">◀</div>
                      <div className="gate-door right">▶</div>
                    </div>
                  </div>
                </div>

                <div id="fingerprint-scanner" className="scanner-hardware">
                  <div className="gate-label">{t.fpModule}</div>
                  <div className="scan-zone" onClick={() => startBiometricScan('fingerprint')}>
                    <div className="scanner-laser"></div>
                    <span className="scan-icon">☝️</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{t.scanThumbText}</span>
                </div>

                <div id="iris-scanner" className="scanner-hardware">
                  <div className="gate-label">{t.irisScanner}</div>
                  <div className="scan-zone" onClick={() => startBiometricScan('iris')}>
                    <div className="scanner-laser"></div>
                    <span className="scan-icon">👁️</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{t.scanIrisText}</span>
                </div>
              </div>

              {/* Right Terminal */}
              <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <div className="booth-terminal-display" style={{ background: 'rgba(4, 7, 18, 0.95)', border: '4px solid #1e293b', borderRadius: 'var(--border-radius-lg)', height: '100%' }}>

                  {votingStep === 'auth-required' && (
                    <div id="screen-auth" className="terminal-screen active" style={{ alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '4rem' }}>🔒</div>
                      <h2>{t.stationTitle}</h2>
                      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem' }}>
                        {t.stationDesc}
                      </p>
                    </div>
                  )}

                  {votingStep === 'e-ballot' && (
                    <div id="screen-ballot" className="terminal-screen active">
                      <div className="terminal-header">
                        <h3>{t.ballotTitle}</h3>
                        <span className="voter-identity-badge" style={{ color: 'var(--secondary)' }}>AADHAR CONNECTED</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                        {t.ballotDesc}
                      </p>
                      <div id="ballot-candidates-list" className="candidate-selection-grid">
                        {nominations.filter(n => n.status === 'APPROVED' && (n.election_type || 'general') === activeElectionType)
                          .sort((a, b) => a.name_of_candidate.localeCompare(b.name_of_candidate))
                          .map((c, index) => (
                            <div key={c.nomination_id} className="candidate-row-btn" onClick={() => selectCandidate(c)}>
                              <span className="candidate-sno">{index + 1}</span>
                              <div className="candidate-profile-block">
                                <div className="candidate-avatar">{c.candidate_photo}</div>
                                <div className="candidate-info-text">
                                  <h4>{c.name_of_candidate}</h4>
                                  <p>ID: CAN-AP094-0{c.nomination_id}</p>
                                </div>
                              </div>
                              <div className="candidate-party-label">{c.party_name}</div>
                              <div className="candidate-symbol-icon">{c.party_symbol}</div>
                              <div className="vote-select-indicator"></div>
                            </div>
                          ))}
                        
                        {/* NOTA Option */}
                        <div className="candidate-row-btn" onClick={() => selectCandidate({ nomination_id: 'NOTA', name_of_candidate: 'NOTA', party_name: 'NOTA', party_symbol: '✖️' })}>
                          <span className="candidate-sno">NOTA</span>
                          <div className="candidate-profile-block">
                            <div className="candidate-avatar">🚫</div>
                            <div className="candidate-info-text">
                              <h4>None of the Above (NOTA)</h4>
                              <p>Standard Neutral Option</p>
                            </div>
                          </div>
                          <div className="candidate-party-label">NOTA</div>
                          <div className="candidate-symbol-icon">✖️</div>
                          <div className="vote-select-indicator"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {votingStep === 'change-confirm' && (
                    <div id="screen-change" className="terminal-screen active">
                      <div className="terminal-header">
                        <h3>{t.changeTitle}</h3>
                      </div>
                      <div className="confirm-box">
                        <div style={{ fontSize: '3rem' }}>🔄</div>
                        <div className="confirm-question">
                          {t.changeDesc.replace("{candidate}", selectedCandidate?.name_of_candidate)}
                        </div>
                        <div className="confirm-actions">
                          <button className="btn btn-primary" onClick={() => confirmChangeDecision(true)}>{t.yesRe}</button>
                          <button className="btn btn-outline" onClick={() => confirmChangeDecision(false)}>{t.noConfirm}</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {votingStep === 'submit-confirm' && (
                    <div id="screen-submit-confirm" className="terminal-screen active">
                      <div className="terminal-header">
                        <h3>{t.confirmTitle}</h3>
                      </div>
                      <div className="confirm-box">
                        <div style={{ fontSize: '3rem' }}>📥</div>
                        <div className="confirm-question">
                          {t.confirmDesc.replace("{candidate}", selectedCandidate?.name_of_candidate)}
                        </div>
                        <div className="confirm-actions">
                          <button className="btn btn-success" onClick={submitFinalVote}>{t.submitVote}</button>
                          <button className="btn btn-outline" onClick={() => setVotingStep('e-ballot')}>{t.cancel}</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {votingStep === 'vvpatslip' && (
                    <div id="screen-vvpat" className="terminal-screen active">
                      <div className="terminal-header">
                        <h3>{t.vvpatTitle}</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', justifyContent: 'center', flex: 1 }}>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '450px', fontSize: '0.9rem' }}>
                          {t.vvpatDesc}
                        </p>

                        <div className="vvpat-printer-card" style={{ width: '320px' }}>
                          <div className="printer-mouth"></div>
                          <div id="vvpat-receipt-slip" className="printed-slip">
                            <div id="vvpat-slip-placeholder">
                              <div style={{ fontWeight: 'bold', borderBottom: '1px dashed #000', paddingBottom: '5px', marginBottom: '5px', fontSize: '0.65rem', color: '#000' }}>
                                ELECTION COMMISSION OF INDIA<br />VVPAT AUDIT SLIP
                              </div>
                              <div style={{ textAlign: 'left', lineHeight: 1.3, color: '#000' }}>
                                <strong>Booth:</strong> BOOTH-01<br />
                                <strong>MLA Const:</strong> {currentVoter?.mla_constituency}<br />
                                <strong>Party:</strong> {selectedCandidate?.party_name}<br />
                                <strong>Symbol:</strong> {selectedCandidate?.party_symbol}<br />
                                <strong>Candidate:</strong> {selectedCandidate?.name_of_candidate}<br />
                              </div>
                              <div style={{ borderTop: '1px dashed #000', marginTop: '5px', paddingTop: '5px', fontSize: '0.55rem', fontWeight: 'bold', color: '#000' }}>
                                SLIP DROPPED IN AUDIT BOX
                              </div>
                            </div>
                          </div>
                          <div className="vvpat-status-txt">PRINTING RECEIPT...</div>
                        </div>

                        <button className="btn btn-success" onClick={dropSlipInBox}>{t.dropSlip}</button>
                      </div>
                    </div>
                  )}

                  {votingStep === 'exit-required' && (
                    <div id="screen-exit" className="terminal-screen active" style={{ alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '4rem' }}>🚪</div>
                      <h2>{t.exitTitle}</h2>
                      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem' }}>
                        {t.exitDesc}
                      </p>

                      <div id="exit-gate" className={`gate-container ${exitDoorOpen ? 'open' : ''}`} style={{ width: '250px' }}>
                        <div className="gate-label">EXIT ACTUATOR</div>
                        <div className="gate-doors">
                          <div className="gate-door left">◀</div>
                          <div className="gate-door right">▶</div>
                        </div>
                      </div>

                      <div id="exit-scanner" className="scanner-hardware" style={{ width: '200px' }}>
                        <div className="scan-zone" onClick={startExitBiometricScan}>
                          <div className="scanner-laser"></div>
                          <span className="scan-icon">☝️</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{t.exitScanBtn}</span>
                      </div>
                    </div>
                  )}

                  {votingStep === 'completed' && (
                    <div id="screen-completed" className="terminal-screen active" style={{ alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '4rem', color: 'var(--success)' }}>✅</div>
                      <h2>{t.completeTitle}</h2>
                      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem' }}>
                        {t.completeDesc}
                      </p>
                      <button className="btn btn-outline" onClick={resetVoterFlow}>{t.nextVoterBtn}</button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. ECI LIVE COMMAND CENTER (OBSERVER VIEW) */}
        {activeTab === 'observer' && (
          <section id="observer-view" className="view-section active">
            <div className="stats-cards-grid">
              {(() => {
                const filteredPolls = polls.filter(p => (p.election_type || 'general') === activeElectionType);
                const filteredBooths = booths.filter(b => (b.election_type || 'general') === activeElectionType);
                const threatCount = systemLogs.filter(log => log.type === 'error').length;
                return (
                  <>
                    <div className="stats-card glass-panel">
                      <span className="stats-label">{t.totalVotes}</span>
                      <div className="stats-val">{filteredPolls.length}</div>
                    </div>
                    <div className="stats-card glass-panel">
                      <span className="stats-label">{t.turnout}</span>
                      <div className="stats-val">{voters.length > 0 ? ((filteredPolls.length / voters.length) * 100).toFixed(1) : 0}%</div>
                    </div>
                    <div className="stats-card glass-panel">
                      <span className="stats-label">{t.stations}</span>
                      <div className="stats-val">{filteredBooths.length} {t.activeText}</div>
                    </div>
                    <div className="stats-card glass-panel">
                      <span className="stats-label">{t.threats}</span>
                      <div className="stats-val" style={{ color: threatCount > 0 ? 'var(--danger)' : 'var(--success)' }}>
                        {threatCount} {t.triggeredText}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="voter-split-layout" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {/* Tally Stats */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2>{t.liveTallies}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  {t.talliesDesc}
                </p>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{t.contestant}</th>
                        <th>{t.partyName}</th>
                        <th>{t.symbol}</th>
                        <th>{t.polledVotes}</th>
                        <th>{t.tallyBar}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nominations.filter(n => n.status === 'APPROVED' && (n.election_type || 'general') === activeElectionType).map(c => {
                        const filteredPolls = polls.filter(p => (p.election_type || 'general') === activeElectionType);
                        const count = filteredPolls.filter(p => p.candidate_name === c.name_of_candidate).length;
                        const pct = filteredPolls.length > 0 ? ((count / filteredPolls.length) * 100).toFixed(1) : 0;
                        return (
                          <tr key={c.nomination_id}>
                            <td><strong>{c.name_of_candidate}</strong></td>
                            <td>{c.party_name}</td>
                            <td><span style={{ fontSize: '1.3rem' }}>{c.party_symbol}</span></td>
                            <td style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>{count}</td>
                            <td>
                              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }}></div>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pct}% of total</span>
                            </td>
                          </tr>
                        );
                      })}
                      {/* NOTA option stats */}
                      <tr key="nota-stats">
                        <td><strong>NOTA</strong></td>
                        <td>None of the Above</td>
                        <td>✖️</td>
                        <td style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {polls.filter(p => p.candidate_name === 'NOTA' && (p.election_type || 'general') === activeElectionType).length}
                        </td>
                        <td>
                          {(() => {
                            const filteredPolls = polls.filter(p => (p.election_type || 'general') === activeElectionType);
                            const notaCount = filteredPolls.filter(p => p.candidate_name === 'NOTA').length;
                            const pct = filteredPolls.length > 0 ? ((notaCount / filteredPolls.length) * 100).toFixed(1) : 0;
                            return (
                              <>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--text-muted)' }}></div>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {pct}% of total
                                </span>
                              </>
                            );
                          })()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CCTV Camera grid */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2>{t.cctvFeeds}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  {t.cctvDesc}
                </p>
                <div className="cctv-grid">
                  {booths.filter(b => (b.election_type || 'general') === activeElectionType).map(b => (
                    <div key={b.booth_number} className="cctv-card">
                      <span className="cctv-live-tag">{t.live}</span>
                      <div className="cctv-stream-placeholder">
                        <div className="cctv-scanline"></div>
                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: "'Space Grotesk', monospace" }}>
                          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📽️</div>
                          {t.feedActive}<br />
                          FPS: 30 | PORT: 8080<br />
                          SEC_GUARD: OK
                        </div>
                      </div>
                      <div className="cctv-label">{b.booth_number} - Cam:{b.camera_id}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. NOMINATION PORTAL (CONSTITUENCY ADMIN) */}
        {activeTab === 'admin' && (userRole === 'admin' || userRole === 'superadmin') && (
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
        )}

        {/* 4. RESULTS DECLARATION TAB */}
        {activeTab === 'results' && (
          <section id="results-view" className="view-section active">
            {winInfo && polls.length > 0 ? (
              <>
                {/* Winner Card */}
                <div className="results-hero-card">
                  <div className="trophy-glow">🏆</div>
                  <div className="declaration-badge">{t.resDecl}: PONNUR (AP-094)</div>
                  <div className="winner-name-txt">{winInfo.winner.name_of_candidate} ({winInfo.winner.party_name})</div>
                  <div className="winner-subtitle">{t.electedRole}</div>

                  <div className="margin-pill-box">
                    <div className="margin-pill-item">
                      🥇 {t.winnerVotes}: <strong>{winInfo.winner.votes}</strong>
                    </div>
                    <div className="margin-pill-item">
                      🥈 {t.runnerVotes}: <strong>{winInfo.runner.votes}</strong> ({winInfo.runner.name_of_candidate})
                    </div>
                    <div className="margin-pill-item">
                      ⚡ {t.victoryMargin}: <strong>+{winInfo.winner.votes - winInfo.runner.votes}</strong> votes
                    </div>
                  </div>
                </div>

                {/* Rankings Table */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                      <h2>{t.resultTallyTitle}</h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        {t.resultTallyDesc}
                      </p>
                    </div>
                    <button className="btn btn-outline" onClick={() => window.print()}>
                      🖨️ {t.printCert}
                    </button>
                  </div>

                  <div className="data-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{t.rank}</th>
                          <th>{t.candName}</th>
                          <th>{t.party}</th>
                          <th>{t.polledVotes}</th>
                          <th>{t.tallyBar}</th>
                          <th>{t.officialStatus}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {winInfo.rankings.map((c, index) => {
                          const pct = winInfo.totalVotes > 0 ? ((c.votes / winInfo.totalVotes) * 100).toFixed(2) : '0.00';
                          let statusClass = 'trailed';
                          let statusText = lang === 'te' ? 'వెనుకంజలో ఉన్నారు' : lang === 'hi' ? 'पीछे रहे' : 'TRAILED';

                          if (index === 0) {
                            statusClass = 'winner';
                            statusText = lang === 'te' ? 'విజేత (మొదటి స్థానం)' : lang === 'hi' ? 'विजेता (प्रथम बढ़त)' : 'WINNER (1st Lead)';
                          } else if (index === 1) {
                            statusClass = 'runner';
                            statusText = lang === 'te' ? 'రన్నరప్ (రెండో స్థానం)' : lang === 'hi' ? 'उपविजेता (द्वितीय बढ़त)' : 'RUNNER (2nd Lead)';
                          }

                          return (
                            <tr key={c.nomination_id || index}>
                              <td><strong>#{index + 1}</strong></td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <div className="candidate-avatar" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                                    {c.candidate_photo || '🚫'}
                                  </div>
                                  <div>
                                    <strong>{c.name_of_candidate}</strong>
                                  </div>
                                </div>
                              </td>
                              <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{c.party_name}</td>
                              <td style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{c.votes}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                  <div style={{ width: '120px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', background: index === 0 ? 'var(--success)' : index === 1 ? 'var(--warning)' : 'var(--text-muted)' }}></div>
                                  </div>
                                  <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{pct}%</span>
                                </div>
                              </td>
                              <td>
                                <span className={`status-badge ${statusClass}`}>{statusText}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏆</div>
                <h2>{t.noVotesCast}</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '1rem auto' }}>
                  {t.noVotesDesc}
                </p>
              </div>
            )}
          </section>
        )}

        {/* 5. AADHAAR REGISTRY & SUPER ADMIN CONFIGS */}
        {activeTab === 'super-admin' && userRole === 'superadmin' && (
          <section id="super-admin-view" className="view-section active">
            <div className="admin-grid-layout" style={{ gridTemplateColumns: '1fr 380px' }}>
              
              {/* Left Column container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Left: Voter Aadhaar List */}
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
                                background: v.has_voted ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 179, 0, 0.15)',
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

                {/* Left: Election Type Management Console — superadmin only */}
                {userRole === 'superadmin' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h2>📂 {t.electionTypesTab}</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                    Register and review election models inside the Aadhar-Based Automated Electronic Voting System network.
                  </p>

                  <div className="data-table-container" style={{ marginBottom: '1.5rem' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '120px' }}>ID</th>
                          <th>Name</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {electionTypes.map(et => (
                          <tr key={et.id}>
                            <td><code>{et.id}</code></td>
                            <td><strong>{et.name}</strong></td>
                            <td><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{et.desc}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>➕ {t.addElectionType}</h3>
                    <form onSubmit={handleCreateElectionType}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>{t.elecId}</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. sports" 
                            value={newElecId}
                            onChange={(e) => setNewElecId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>{t.elecName}</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. Sports Club President" 
                            value={newElecName}
                            onChange={(e) => setNewElecName(e.target.value)}
                            required 
                          />
                        </div>
                      </div>
                      <div className="form-group" style={{ marginTop: '0.5rem' }}>
                        <label>{t.elecDesc}</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. Vote for the president of the community sports club." 
                          value={newElecDesc}
                          onChange={(e) => setNewElecDesc(e.target.value)}
                          required 
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                        💾 {t.saveElecType}
                      </button>
                    </form>
                  </div>
                </div>
                )}
                
                {/* Admin Access Management - superadmin only */}
                {userRole === 'superadmin' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <h2>🔐 Admin Access Management</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                    Create restricted Admin accounts locked to a specific election type.
                  </p>
                  
                  <div className="data-table-container" style={{ marginBottom: '1.5rem' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Assigned Election Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminCredentials.filter(c => c.role === 'admin').map((c, i) => (
                          <tr key={i}>
                            <td><strong>{c.username}</strong></td>
                            <td><code style={{ color: 'var(--secondary)' }}>{c.assignedElectionType}</code></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>➕ Grant Admin Access</h3>
                    <form onSubmit={handleCreateAdmin}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Username</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. admin_sports" 
                            value={newAdminUser}
                            onChange={(e) => setNewAdminUser(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="form-group">
                          <label>Password</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="e.g. secure@123" 
                            value={newAdminPass}
                            onChange={(e) => setNewAdminPass(e.target.value)}
                            required 
                          />
                        </div>
                      </div>
                      <div className="form-group" style={{ marginTop: '0.5rem' }}>
                        <label>Assign Election Type</label>
                        <select
                          className="form-input"
                          value={newAdminElec}
                          onChange={(e) => setNewAdminElec(e.target.value)}
                          required
                        >
                          {electionTypes.map(et => (
                            <option key={et.id} value={et.id}>{et.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      {adminSetupMsg && (
                        <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, background: adminSetupMsg.startsWith('Error') ? 'rgba(255, 23, 68, 0.15)' : 'rgba(0, 230, 118, 0.15)', color: adminSetupMsg.startsWith('Error') ? 'var(--danger)' : 'var(--success)' }}>
                          {adminSetupMsg}
                        </div>
                      )}
                      
                      <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                        💾 Save Admin Credential
                      </button>
                    </form>
                  </div>
                </div>
                )}
              </div>{/* end left column */}

              {/* Right: Configurations & Math Audits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Admin configuration settings */}
                <div className="booth-controls-card glass-panel" style={{ gap: '1rem' }}>
                  <h3 style={{ color: 'var(--warning)' }}>{t.timelineSettings}</h3>
                  <form onSubmit={saveSuperSettings}>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label>{t.timezoneOffset}</label>
                      <input type="text" className="form-input" value={timezone} onChange={(e) => setTimezone(e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label>{t.pollStart}</label>
                      <input type="time" className="form-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label>{t.pollEnd}</label>
                      <input type="time" className="form-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
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

                {/* Audit panel */}
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
          </section>
        )}

        {/* Bottom system logs */}
        <footer className="logs-container glass-panel">
          <div className="logs-header">
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 700 }}>🖥️ {t.sysLogsTitle}</h3>
            <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setSystemLogs([])}>{t.clearConsole}</button>
          </div>
          <div className="logs-list">
            {systemLogs.map((log, idx) => (
              <div key={idx} className={`log-entry ${log.type}`}>
                <span className="log-time">[{log.time}]</span>
                <span className="log-msg">{log.msg}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </footer>

      </main>

      {/* ========================================== */}
      {/* LOGIN MODAL OVERLAY                        */}
      {/* ========================================== */}
      {showLoginModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(4, 7, 18, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '24px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%', width: '32px', height: '32px',
                color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>

            {/* Icon + Title */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1rem',
                background: loginTarget === 'super-admin'
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: loginTarget === 'super-admin'
                  ? '0 8px 32px rgba(245,158,11,0.4)'
                  : '0 8px 32px rgba(99,102,241,0.4)'
              }}>
                {loginTarget === 'super-admin' ? '👑' : '🏢'}
              </div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                {loginTarget === 'super-admin' ? 'Super Admin Login' : 'Admin Login'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {loginTarget === 'super-admin'
                  ? 'Restricted access — Super Administrator credentials required'
                  : 'Returning Officer / Constituency Administrator access'}
              </p>
            </div>

            {/* Credentials hint box */}
            <div style={{
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.8rem'
            }}>
              {loginTarget === 'super-admin' ? (
                <><strong style={{ color: 'var(--warning)' }}>👑 Super Admin</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Username: <code style={{ color: '#a5b4fc' }}>superadmin</code> &nbsp;|&nbsp; Password: <code style={{ color: '#a5b4fc' }}>super@123</code>
                  </div></>
              ) : (
                <><strong style={{ color: 'var(--primary)' }}>🏢 Admin</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Username: <code style={{ color: '#a5b4fc' }}>admin</code> &nbsp;|&nbsp; Password: <code style={{ color: '#a5b4fc' }}>admin@123</code>
                  </div></>
              )}
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} autoComplete="off">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Username
                </label>
                <input
                  id="login-username"
                  type="text"
                  className="form-input"
                  placeholder="Enter username"
                  value={loginUsername}
                  onChange={(e) => { setLoginUsername(e.target.value); setLoginError(''); }}
                  autoFocus
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }}
                  style={{ marginTop: '0.5rem' }}
                />
              </div>

              {loginError && (
                <div style={{
                  background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.3)',
                  borderRadius: '10px', padding: '0.75rem 1rem',
                  color: 'var(--danger)', fontSize: '0.82rem', marginBottom: '1.25rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  ⚠️ {loginError}
                </div>
              )}

              <button
                id="login-submit-btn"
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700, borderRadius: '14px' }}
              >
                🔐 {loginTarget === 'super-admin' ? 'Access Super Admin Panel' : 'Access Admin Panel'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );

  function switchAdminPanel(panel) {
    setAdminPanel(panel);
  }
}

export default App;

