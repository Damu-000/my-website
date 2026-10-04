# CarePulse HealthFlow 🩺⚡

> **Smart Healthcare Facility Finder, Real-Time OPD Queue Tokens & Zero-Travel Consultations**

CarePulse HealthFlow is a modern healthcare web application engineered to eliminate overcrowded waiting rooms and unnecessary hospital commutes. Patients can search nearby medical facilities, check live specialist availability, generate digital queue tokens remotely, and receive predictive **"Leave Home Now"** notifications.

---

## ✨ Key Features

- **🏥 Smart Healthcare Facility Finder**:
  - Filter verified hospitals, clinics, and emergency centers by specialty, distance, wait time, and trauma readiness.
  - Interactive status badges displaying real-time bed capacity, ICU availability, and current OPD rush status.

- **🎫 Remote Digital OPD Queue Tokens**:
  - Secure an OPD queue pass remotely from anywhere.
  - Live token tracker showing queue position, estimated consultation time, and dynamic travel buffers.
  - Intelligent *"Leave Home Now"* alerts computed based on transit time and queue velocity.

- **🩺 Interactive Symptom Triage Engine**:
  - Multi-step diagnostic triage questionnaire assessing symptom urgency.
  - Automatically recommends appropriate care levels (Home Care, Teleconsult, Urgent OPD, or Immediate Emergency SOS).

- **🧑‍⚕️ Doctor & Staff Admin Desk Simulator**:
  - Interactive clinic console for healthcare providers.
  - Call next patient, mark in-consultation, complete visits, or issue priority triage bumps.
  - Dynamic synchronization with patient token status across the platform.

- **💻 Zero-Commute Video Teleconsultation**:
  - Instant virtual appointments with on-call specialists to avoid travel for routine inquiries.

- **🚨 1-Tap Emergency SOS**:
  - Direct routing to nearest trauma centers with real-time bay readiness and emergency dispatcher dials.

- **🔊 Audio & Toast Announcements**:
  - Optional chime and voice synthesis alerts for token call-outs.

---

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism, Responsive design)
- **Application Logic**: Vanilla JavaScript (ES6+ modular architecture)
- **Data & Engines**:
  - `data.js`: Mock regional healthcare facilities, specialists, and status feeds
  - `queue-engine.js`: Dynamic queue simulation, time estimation, and token state management
  - `triage-engine.js`: Algorithmic risk-scoring symptom evaluator
  - `app.js`: Reactive UI state binding, audio chimes, modal orchestration, and event handling

---

## 🚀 Getting Started

No build step or external dependencies required! You can run this project with any local web server or open it directly in a modern web browser.

### Option 1: Live Server / Python HTTP Server
```bash
# Clone the repository
git clone https://github.com/Damu-000/my-website.git

# Navigate into the project directory
cd my-website

# Start a lightweight local server (Python 3)
python -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.

### Option 2: Direct Browser Launch
Simply double-click `index.html` or open it with Google Chrome, Microsoft Edge, or Firefox.

---

## 📁 Project Structure

```
pulsemed-healthflow/
├── assets/
│   └── hero-banner.jpg        # High-resolution healthcare banner
├── scripts/
│   ├── app.js                 # Primary UI controllers & modal managers
│   ├── data.js                # Healthcare providers & facility database
│   ├── queue-engine.js        # OPD token & real-time queue algorithm
│   └── triage-engine.js       # Symptom checker triage matrix
├── styles/
│   └── main.css               # Complete responsive design & theme tokens
├── .gitignore
├── index.html                 # Main application interface
└── README.md                  # Project documentation
```

---

## 🔒 License
This project is open-source under the [MIT License](LICENSE).