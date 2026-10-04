// HealthFlow Queue & Commute Engine: Web Audio Chimes, State & Real-Time Sync

class QueueEngine {
  constructor() {
    this.storageKey = "careflow_facilities_v1";
    this.tokenStorageKey = "careflow_active_tokens_v1";
    this.audioCtx = null;
    this.audioEnabled = true;
    this.listeners = [];
    
    this.facilities = this.loadFacilities();
    this.activeTokens = this.loadActiveTokens();
  }

  // Load / Store Facilities
  loadFacilities() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved facilities, resetting to initial", e);
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_FACILITIES));
  }

  saveFacilities() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.facilities));
    this.notify();
  }

  // Load / Store User Tokens
  loadActiveTokens() {
    const saved = localStorage.getItem(this.tokenStorageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved tokens", e);
      }
    }
    // Default demo token so the user experiences the live tracker right upon landing!
    return [
      {
        id: "tok-demo-1",
        tokenNumber: 20,
        facilityId: "fac-1",
        facilityName: "Apex Super Specialty Hospital",
        doctorId: "doc-1",
        doctorName: "Dr. Evelyn Vance, MD",
        specialty: "Cardiology",
        room: "OPD Suite 204",
        patientName: "Alex Jordan",
        patientPhone: "+1 (555) 019-2834",
        commuteMins: 15,
        symptoms: "Mild palpitations, routine checkup",
        issuedAt: new Date(Date.now() - 25 * 60000).toISOString(),
        status: "waiting", // waiting | ready_to_leave | now_serving | completed
        smsAlerts: true
      }
    ];
  }

  saveActiveTokens() {
    localStorage.setItem(this.tokenStorageKey, JSON.stringify(this.activeTokens));
    this.notify();
  }

  // Subscribe to changes
  subscribe(fn) {
    this.listeners.push(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.facilities, this.activeTokens));
  }

  // Web Audio Hospital Chime Synthesizer
  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playHospitalChime(type = "call") {
    if (!this.audioEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      
      if (type === "call") {
        // Classic pleasant airport / hospital announcement 3-tone chime (F4 -> A4 -> C5)
        const notes = [349.23, 440.0, 523.25];
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.28);

          gain.gain.setValueAtTime(0.001, now + idx * 0.28);
          gain.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.28 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.28 + 0.65);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now + idx * 0.28);
          osc.stop(now + idx * 0.28 + 0.7);
        });
      } else if (type === "alert") {
        // High attention alert chime (A4 -> E5)
        const notes = [440.0, 659.25];
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.2);

          gain.gain.setValueAtTime(0.001, now + idx * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.22, now + idx * 0.2 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.2 + 0.45);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now + idx * 0.2);
          osc.stop(now + idx * 0.2 + 0.5);
        });
      }
    } catch (e) {
      console.warn("Audio chime could not play due to browser policy:", e);
    }
  }

  // Issue a new token remotely
  issueToken({ facilityId, doctorId, patientName, patientPhone, commuteMins, symptoms, consultType = "in_person" }) {
    const facility = this.facilities.find(f => f.id === facilityId);
    if (!facility) throw new Error("Facility not found");

    const doctor = facility.doctors.find(d => d.id === doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const tokenNum = doctor.nextTokenNumber;
    doctor.nextTokenNumber += 1;
    doctor.totalQueueLength += 1;

    const token = {
      id: "tok-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      tokenNumber: tokenNum,
      facilityId: facility.id,
      facilityName: facility.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      room: doctor.room,
      patientName: patientName.trim() || "Patient",
      patientPhone: patientPhone.trim() || "+1 555-0100",
      commuteMins: parseInt(commuteMins, 10) || facility.travelTimeMins || 15,
      symptoms: symptoms.trim() || "Outpatient Consultation",
      consultType,
      issuedAt: new Date().toISOString(),
      status: "waiting",
      smsAlerts: true
    };

    this.activeTokens.unshift(token);
    this.saveFacilities();
    this.saveActiveTokens();

    this.playHospitalChime("alert");
    return token;
  }

  // Cancel / Delete a token
  cancelToken(tokenId) {
    this.activeTokens = this.activeTokens.filter(t => t.id !== tokenId);
    this.saveActiveTokens();
  }

  // Doctor Admin Desk: Advance Queue
  advanceDoctorQueue(facilityId, doctorId) {
    const facility = this.facilities.find(f => f.id === facilityId);
    if (!facility) return null;
    const doctor = facility.doctors.find(d => d.id === doctorId);
    if (!doctor) return null;

    if (doctor.currentTokenServing < doctor.nextTokenNumber - 1) {
      doctor.currentTokenServing += 1;
      this.saveFacilities();

      // Check if any user token is called or near
      this.checkUserTokenStatus(facilityId, doctorId, doctor.currentTokenServing);
      return doctor;
    }
    return null;
  }

  // Doctor Admin Desk: Reset or Add Delay
  addDoctorDelay(facilityId, doctorId, additionalMins = 10) {
    const facility = this.facilities.find(f => f.id === facilityId);
    if (!facility) return;
    const doctor = facility.doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    doctor.avgConsultTimeMins = Math.min(25, doctor.avgConsultTimeMins + Math.round(additionalMins / 3));
    this.saveFacilities();
    this.playHospitalChime("alert");
  }

  // Check user tokens relative to queue status
  checkUserTokenStatus(facilityId, doctorId, currentServing) {
    let triggeredCall = false;

    this.activeTokens.forEach(tok => {
      if (tok.facilityId === facilityId && tok.doctorId === doctorId) {
        if (tok.tokenNumber === currentServing) {
          tok.status = "now_serving";
          triggeredCall = true;
          this.triggerNotification({
            title: `🔔 YOUR TOKEN #${tok.tokenNumber} IS CALLED!`,
            body: `Dr. ${tok.doctorName} is ready for you now in ${tok.room}. Please step inside!`,
            type: "serving"
          });
        } else if (tok.tokenNumber > currentServing) {
          const ahead = tok.tokenNumber - currentServing;
          const facility = this.facilities.find(f => f.id === facilityId);
          const doctor = facility?.doctors.find(d => d.id === doctorId);
          const waitMins = ahead * (doctor ? doctor.avgConsultTimeMins : 8);

          if (waitMins <= tok.commuteMins + 5 && tok.status === "waiting") {
            tok.status = "ready_to_leave";
            this.triggerNotification({
              title: `🚗 LEAVE HOME NOW!`,
              body: `Only ${ahead} patients ahead of Token #${tok.tokenNumber} (~${waitMins}m wait). Your commute is ~${tok.commuteMins}m. Walk in right on time!`,
              type: "commute"
            });
          }
        } else if (tok.tokenNumber < currentServing && tok.status !== "completed") {
          tok.status = "completed";
        }
      }
    });

    this.saveActiveTokens();

    if (triggeredCall) {
      this.playHospitalChime("call");
    } else {
      this.playHospitalChime("alert");
    }
  }

  // Calculate detailed timing metrics for a token
  getTokenMetrics(token) {
    const facility = this.facilities.find(f => f.id === token.facilityId);
    const doctor = facility?.doctors.find(d => d.id === token.doctorId);
    
    if (!doctor) {
      return {
        currentServing: "-",
        ahead: 0,
        estWaitMins: 0,
        callTimeFormatted: "Immediate",
        commuteStatus: "ready",
        leavePrompt: "Doctor information updating"
      };
    }

    const currentServing = doctor.currentTokenServing;
    const ahead = Math.max(0, token.tokenNumber - currentServing);
    const estWaitMins = ahead * doctor.avgConsultTimeMins;
    
    const callDate = new Date(Date.now() + estWaitMins * 60000);
    const callTimeFormatted = callDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let commuteStatus = "relax"; // relax | prepare | leave_now | at_clinic | serving | passed
    let leavePrompt = "Relax at home. We will alert you when it's time to commute.";

    if (ahead === 0) {
      commuteStatus = "serving";
      leavePrompt = "🎉 Your token is being called right now! Enter consultation room.";
    } else if (token.tokenNumber < currentServing) {
      commuteStatus = "passed";
      leavePrompt = "Your consultation turn has concluded or was marked attended.";
    } else if (estWaitMins <= token.commuteMins) {
      commuteStatus = "leave_now";
      leavePrompt = `🚨 LEAVE NOW! Your ~${token.commuteMins} min commute matches the remaining wait time.`;
    } else if (estWaitMins <= token.commuteMins + 10) {
      commuteStatus = "prepare";
      leavePrompt = `👟 Get ready! Your commute starts in ~${estWaitMins - token.commuteMins} mins.`;
    } else {
      commuteStatus = "relax";
      leavePrompt = `🛋️ Rest at home. ${ahead} patients ahead (~${estWaitMins}m wait). Commute takes ~${token.commuteMins}m.`;
    }

    return {
      currentServing,
      ahead,
      estWaitMins,
      callTimeFormatted,
      commuteStatus,
      leavePrompt,
      doctor
    };
  }

  // Trigger browser or in-app floating banner notification
  triggerNotification({ title, body, type = "info" }) {
    // Custom event dispatched for UI notification toast
    window.dispatchEvent(new CustomEvent("healthflow-alert", {
      detail: { title, body, type, timestamp: new Date() }
    }));
  }

  // Reset to sample initial state
  resetAll() {
    this.facilities = JSON.parse(JSON.stringify(INITIAL_FACILITIES));
    this.activeTokens = this.loadActiveTokens();
    this.saveFacilities();
    this.saveActiveTokens();
  }
}

// Global instance
window.queueEngine = new QueueEngine();
