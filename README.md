# Online Voting System - Frontend UI (`online_voting_frontend`)

Interactive Frontend Client and Kiosk Simulation for the **Aadhaar-Based Automated & Remote Electronic Voting System**, based on the research paper *"Remotely Connected and Mobile Automated Polling Station for Electronic Voting Using Aadhar Based Authentication"* (Dr. R.V. Krishnaiah & R. Vamsi Krishna, *IJAEMA* 2022).

---

## 🌟 Key Features

- **Automated Kiosk & Solenoid Gate Simulation**:
  - Green/Red Entry light indicators with 1-second solenoid gate pulse
  - Left thumbprint scanner with laser scan visualizer
  - IRIS ocular scanner with targeting reticle
  - Dual biometric `OR` logic verification
  - Real-time threat detection for duplicate/double voting attempts
- **Ballot Navigation (Paper Flowcharts)**:
  - **Screen 1**: E-Ballot sheet with candidate list sorted alphabetically, symbols, photos, and digital stylus touch selection
  - **Screen 2**: Vote change option (`YES` to re-select, `NO` to proceed)
  - **Screen 3**: Submit confirmation locking ballot to database
  - **VVPAT Module**: Realistic thermal receipt printing with confirmed candidate symbol, barcode, and automated drop into sealed audit box
  - **Exit Flow**: Thumbprint verification to open exit door & reset terminal
- **ECI Live Command Center & Admin Portals**:
  - **Table 1 to Table 5 Matrices**: Live booth, constituency, MLA, and MP poll audits with mathematical verification (`NET1 = NRT2`)
  - **Turnout Percentage**: Real-time hourly timeline and progress bar
  - **Results Declaration**: First Lead (Winner), Second Lead (Runner-up), and victory margin counter
  - **CCTV Surveillance**: Multi-camera GSM live feed switcher
  - **Nomination Portal**: Candidate registration, document audit, and withdrawal workflows

---

## 🛠️ How to Run Locally

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## 📦 Deployment (Vercel / Netlify / Render)

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
