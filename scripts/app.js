// HealthFlow Main UI Controller & Interactions

document.addEventListener("DOMContentLoaded", () => {
  // UI State
  let currentFilter = "all";
  let currentSort = "wait";
  let searchQuery = "";
  let maxDistance = 25;

  // Cache DOM Elements
  const facilitiesGrid = document.getElementById("facilitiesGrid");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const filterChips = document.querySelectorAll(".chip-btn");
  const walletBadgeCount = document.getElementById("walletBadgeCount");
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const soundIcon = document.getElementById("soundIcon");

  // Modals
  const tokenModal = document.getElementById("tokenModal");
  const walletModal = document.getElementById("walletModal");
  const triageModal = document.getElementById("triageModal");
  const doctorDeskModal = document.getElementById("doctorDeskModal");
  const teleconsultModal = document.getElementById("teleconsultModal");
  const emergencyModal = document.getElementById("emergencyModal");

  // Hero Quick Card elements
  const heroTokenNum = document.getElementById("heroTokenNum");
  const heroCurrentServing = document.getElementById("heroCurrentServing");
  const heroWaitMins = document.getElementById("heroWaitMins");
  const heroCommutePrompt = document.getElementById("heroCommutePrompt");

  // 1. Initial Render & Sync
  renderFacilities();
  updateWalletCount();
  updateHeroPreview();

  // Listen to Queue Engine updates
  window.queueEngine.subscribe((facilities, tokens) => {
    renderFacilities();
    updateWalletCount();
    updateHeroPreview();
    if (walletModal.classList.contains("open")) {
      renderWalletTokens();
    }
    if (doctorDeskModal.classList.contains("open")) {
      renderDoctorDesk();
    }
  });

  // Listen to Notification Toasts
  window.addEventListener("healthflow-alert", (e) => {
    showToastNotification(e.detail.title, e.detail.body, e.detail.type);
  });

  // 2. Search & Filtering
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderFacilities();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderFacilities();
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.dataset.category || "all";
      renderFacilities();
    });
  });

  // Sound Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      window.queueEngine.audioEnabled = !window.queueEngine.audioEnabled;
      if (window.queueEngine.audioEnabled) {
        soundIcon.textContent = "🔊";
        soundToggleBtn.title = "Audio Chimes Enabled";
        window.queueEngine.playHospitalChime("alert");
        showToastNotification("Audio Chimes Activated", "Hospital announcements and queue turn sounds will play.", "info");
      } else {
        soundIcon.textContent = "🔇";
        soundToggleBtn.title = "Audio Chimes Muted";
        showToastNotification("Muted", "Audio chime announcements are now muted.", "info");
      }
    });
  }

  // 3. Render Facilities
  function renderFacilities() {
    if (!facilitiesGrid) return;
    const facilities = window.queueEngine.facilities;

    // Filter
    let filtered = facilities.filter(fac => {
      // Category filter
      if (currentFilter !== "all" && fac.type !== currentFilter) {
        return false;
      }
      // Search query
      if (searchQuery) {
        const matchName = fac.name.toLowerCase().includes(searchQuery);
        const matchDept = fac.departments.some(d => d.name.toLowerCase().includes(searchQuery));
        const matchDoc = fac.doctors.some(d => d.name.toLowerCase().includes(searchQuery) || d.specialty.toLowerCase().includes(searchQuery));
        const matchInsurance = fac.insuranceAccepted.some(i => i.toLowerCase().includes(searchQuery));
        if (!matchName && !matchDept && !matchDoc && !matchInsurance) {
          return false;
        }
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (currentSort === "wait") {
        const waitA = a.doctors[0] ? (a.doctors[0].nextTokenNumber - a.doctors[0].currentTokenServing) * a.doctors[0].avgConsultTimeMins : 99;
        const waitB = b.doctors[0] ? (b.doctors[0].nextTokenNumber - b.doctors[0].currentTokenServing) * b.doctors[0].avgConsultTimeMins : 99;
        return waitA - waitB;
      } else if (currentSort === "distance") {
        return a.distanceKm - b.distanceKm;
      } else if (currentSort === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

    if (filtered.length === 0) {
      facilitiesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px dashed var(--border-glass);">
          <div style="font-size: 36px; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 18px; margin-bottom: 6px;">No healthcare facilities found matching "${searchQuery}"</h3>
          <p style="color: var(--text-muted); font-size: 14px;">Try searching for a different symptom, doctor specialty (e.g. Cardiology, Pediatrics) or clear filters.</p>
          <button class="btn-primary" style="margin-top: 18px;" onclick="document.getElementById('searchInput').value=''; document.querySelector('[data-category=all]').click();">Reset Filters</button>
        </div>
      `;
      return;
    }

    facilitiesGrid.innerHTML = filtered.map(fac => {
      const minWait = fac.doctors[0] ? Math.max(0, (fac.doctors[0].nextTokenNumber - fac.doctors[0].currentTokenServing) * fac.doctors[0].avgConsultTimeMins) : 15;
      
      let badgeClass = "emerald";
      let badgeText = `🟢 ${minWait} min avg OPD wait`;
      if (minWait > 35) {
        badgeClass = "rose";
        badgeText = `🔴 High volume (${minWait}m wait)`;
      } else if (minWait > 15) {
        badgeClass = "amber";
        badgeText = `🟡 Moderate (${minWait}m wait)`;
      }

      return `
        <article class="facility-card" data-id="${fac.id}">
          <div>
            <div class="card-top-badges">
              <span class="category-tag">${fac.category}</span>
              <span class="status-badge ${badgeClass}">${badgeText}</span>
            </div>

            <h3 class="facility-name">${fac.name}</h3>
            <div class="facility-address">
              <span>📍 ${fac.address}</span>
            </div>

            <div class="facility-telemetry-row">
              <div class="telemetry-item">
                <span class="t-label">Distance / Commute</span>
                <span class="t-val">${fac.distanceKm} km • ~${fac.travelTimeMins}m</span>
              </div>
              <div class="telemetry-item">
                <span class="t-label">Available Beds</span>
                <span class="t-val highlight">${fac.generalBedsAvailable} General</span>
              </div>
              <div class="telemetry-item">
                <span class="t-label">ER Trauma Bays</span>
                <span class="t-val ${fac.erTraumaBays > 0 ? 'highlight' : ''}">${fac.erTraumaBays > 0 ? fac.erTraumaBays + ' Ready' : 'N/A'}</span>
              </div>
            </div>

            <div class="doctors-accordion">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 6px;">
                Active OPD Specialists on Duty:
              </div>
              ${fac.doctors.map(doc => {
                const ahead = Math.max(0, doc.nextTokenNumber - doc.currentTokenServing);
                const docWait = ahead * doc.avgConsultTimeMins;
                return `
                  <div class="doctor-queue-strip">
                    <div class="doctor-info-left">
                      <span class="doc-name">${doc.name}</span>
                      <span class="doc-spec">${doc.specialty} • ${doc.room}</span>
                    </div>
                    <div class="doc-queue-right">
                      <div class="doc-now-serving">Serving #${doc.currentTokenServing}</div>
                      <div class="doc-wait-mins">Next Token #${doc.nextTokenNumber} (~${docWait}m)</div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>

            <div style="margin-bottom: 18px; font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span>🛡️ Cashless:</span>
              ${fac.insuranceAccepted.slice(0, 3).map(ins => `<span style="background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 4px; color: var(--text-secondary);">${ins}</span>`).join("")}
            </div>
          </div>

          <div class="card-action-footer">
            <button class="btn-card-token" onclick="openTokenModalForFacility('${fac.id}')">
              <span>🎫 Get Remote Token</span>
            </button>
            <button class="btn-card-teleconsult" onclick="openTeleconsultModal('${fac.doctors[0]?.name || 'Specialist'}')">
              <span>💻 Teleconsult</span>
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  // 4. Update Hero Preview Card
  function updateHeroPreview() {
    const tokens = window.queueEngine.activeTokens;
    if (tokens.length > 0) {
      const token = tokens[0];
      const metrics = window.queueEngine.getTokenMetrics(token);

      if (heroTokenNum) heroTokenNum.textContent = `#${token.tokenNumber}`;
      if (heroCurrentServing) heroCurrentServing.textContent = `#${metrics.currentServing}`;
      if (heroWaitMins) heroWaitMins.textContent = `${metrics.estWaitMins}m`;

      if (heroCommutePrompt) {
        heroCommutePrompt.className = `commute-prompt-bar ${metrics.commuteStatus}`;
        heroCommutePrompt.innerHTML = `<span>${metrics.leavePrompt}</span>`;
      }
    } else {
      if (heroTokenNum) heroTokenNum.textContent = "None";
      if (heroCurrentServing) heroCurrentServing.textContent = "-";
      if (heroWaitMins) heroWaitMins.textContent = "0m";
      if (heroCommutePrompt) {
        heroCommutePrompt.className = "commute-prompt-bar relax";
        heroCommutePrompt.innerHTML = "<span>No active tokens. Click 'Get Remote Token' below to join from home!</span>";
      }
    }
  }

  // 5. Update Wallet Count
  function updateWalletCount() {
    const count = window.queueEngine.activeTokens.length;
    if (walletBadgeCount) {
      walletBadgeCount.textContent = count;
      walletBadgeCount.style.display = count > 0 ? "inline-flex" : "none";
    }
  }

  // 6. Token Booking Modal
  window.openTokenModalForFacility = function(facilityId = null, doctorId = null) {
    const facilities = window.queueEngine.facilities;
    const facSelect = document.getElementById("bookingFacilitySelect");
    const docSelect = document.getElementById("bookingDoctorSelect");

    if (facSelect) {
      facSelect.innerHTML = facilities.map(f => `
        <option value="${f.id}" ${facilityId === f.id ? 'selected' : ''}>${f.name} (~${f.travelTimeMins}m commute)</option>
      `).join("");

      const updateDoctors = () => {
        const selectedFac = facilities.find(f => f.id === facSelect.value) || facilities[0];
        if (docSelect && selectedFac) {
          docSelect.innerHTML = selectedFac.doctors.map(d => {
            const ahead = Math.max(0, d.nextTokenNumber - d.currentTokenServing);
            const wait = ahead * d.avgConsultTimeMins;
            return `
              <option value="${d.id}" ${doctorId === d.id ? 'selected' : ''}>
                ${d.name} (${d.specialty}) • Next Token #${d.nextTokenNumber} (~${wait}m wait)
              </option>
            `;
          }).join("");
        }
      };

      facSelect.onchange = updateDoctors;
      updateDoctors();
    }

    openModal(tokenModal);
  };

  // Handle Token Booking Submit
  const bookingForm = document.getElementById("tokenBookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const facilityId = document.getElementById("bookingFacilitySelect").value;
      const doctorId = document.getElementById("bookingDoctorSelect").value;
      const patientName = document.getElementById("bookingPatientName").value;
      const patientPhone = document.getElementById("bookingPatientPhone").value;
      const commuteMins = document.getElementById("bookingCommuteMins").value;
      const symptoms = document.getElementById("bookingSymptoms").value;
      const consultType = document.querySelector('input[name="bookingConsultType"]:checked')?.value || "in_person";

      try {
        const token = window.queueEngine.issueToken({
          facilityId,
          doctorId,
          patientName,
          patientPhone,
          commuteMins,
          symptoms,
          consultType
        });

        closeModal(tokenModal);
        bookingForm.reset();

        showToastNotification(
          `🎉 Token #${token.tokenNumber} Issued!`,
          `Assigned to ${token.doctorName} at ${token.facilityName}. Live tracker active in wallet!`,
          "serving"
        );

        // Open Wallet Passbook directly to show user their digital ticket
        openWalletModal();
      } catch (err) {
        alert("Error issuing token: " + err.message);
      }
    });
  }

  // 7. Wallet / Active Passbook
  window.openWalletModal = function() {
    renderWalletTokens();
    openModal(walletModal);
  };

  function renderWalletTokens() {
    const listContainer = document.getElementById("walletTokensList");
    if (!listContainer) return;
    const tokens = window.queueEngine.activeTokens;

    if (tokens.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <div style="font-size: 44px; margin-bottom: 12px;">🎫</div>
          <h4 style="font-size: 16px; margin-bottom: 6px; color: var(--text-main);">No Active OPD Tokens</h4>
          <p style="font-size: 13px; margin-bottom: 20px;">Explore healthcare facilities and get your remote token from home to skip waiting rooms!</p>
          <button class="btn-primary" onclick="closeModal(document.getElementById('walletModal')); openTokenModalForFacility();">Issue New Token</button>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = tokens.map(token => {
      const metrics = window.queueEngine.getTokenMetrics(token);

      return `
        <div class="digital-token-pass">
          <div class="pass-header">
            <div>
              <span class="category-tag">Digital OPD Walk-in Pass</span>
              <h4 style="font-size: 16px; font-weight: 800; margin-top: 2px;">${token.facilityName}</h4>
              <p style="font-size: 12px; color: var(--cyan-bright);">${token.specialty} • ${token.room}</p>
            </div>
            <div style="text-align: right;">
              <span class="live-indicator-chip">● LIVE QUEUE</span>
              <p style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Issued: ${new Date(token.issuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          <div class="pass-token-number-hero">
            <div class="token-title">YOUR QUEUE TOKEN NUMBER</div>
            <div class="token-num">#${token.tokenNumber}</div>
            <div style="font-size: 14px; font-weight: 700; color: var(--text-main);">Patient: ${token.patientName}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${token.symptoms}</div>
          </div>

          <div class="pass-live-sync-bar">
            <div class="sync-item">
              <span class="s-label">Now Serving</span>
              <span class="s-val" style="color: var(--status-emerald);">#${metrics.currentServing}</span>
            </div>
            <div class="sync-item">
              <span class="s-label">Patients Ahead</span>
              <span class="s-val">${metrics.ahead}</span>
            </div>
            <div class="sync-item">
              <span class="s-label">Estimated Wait</span>
              <span class="s-val" style="color: var(--cyan-bright);">${metrics.estWaitMins}m</span>
            </div>
          </div>

          <div class="pass-commute-alert ${metrics.commuteStatus}">
            <span style="font-size: 20px;">
              ${metrics.commuteStatus === 'leave_now' ? '🚨' : metrics.commuteStatus === 'serving' ? '🔔' : '🛋️'}
            </span>
            <div>
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.85;">Commute & Travel Status:</div>
              <div>${metrics.leavePrompt}</div>
            </div>
          </div>

          <div class="pass-footer-meta">
            <div>
              <span>Doctor: <strong>${token.doctorName}</strong></span>
              <span style="display: block; font-size: 11px; color: var(--text-muted);">Configured Commute: ~${token.commuteMins} mins</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-secondary" style="padding: 6px 12px; font-size: 11px;" onclick="window.queueEngine.playHospitalChime('call')">
                🔔 Test Sound
              </button>
              <button class="btn-secondary" style="padding: 6px 12px; font-size: 11px; color: #f87171; border-color: rgba(248,113,113,0.3);" onclick="window.queueEngine.cancelToken('${token.id}')">
                Cancel
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // 8. Doctor & Staff Admin Desk Simulator
  window.openDoctorDeskModal = function() {
    renderDoctorDesk();
    openModal(doctorDeskModal);
  };

  let activeDeskDocId = "doc-1";
  let activeDeskFacId = "fac-1";

  function renderDoctorDesk() {
    const selectorContainer = document.getElementById("deskDoctorSelector");
    const consoleContainer = document.getElementById("deskActiveConsole");
    if (!selectorContainer || !consoleContainer) return;

    const facilities = window.queueEngine.facilities;
    let allDoctors = [];
    facilities.forEach(f => {
      f.doctors.forEach(d => {
        allDoctors.push({ ...d, facilityName: f.name, facilityId: f.id });
      });
    });

    selectorContainer.innerHTML = allDoctors.map(doc => `
      <button class="desk-doc-btn ${doc.id === activeDeskDocId ? 'active' : ''}" onclick="selectDeskDoctor('${doc.facilityId}', '${doc.id}')">
        <div style="font-weight: 700; font-size: 13px;">${doc.name}</div>
        <div style="font-size: 11px; color: var(--cyan-bright);">${doc.specialty}</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">${doc.facilityName}</div>
      </button>
    `).join("");

    const currentDoc = allDoctors.find(d => d.id === activeDeskDocId) || allDoctors[0];
    if (currentDoc) {
      const ahead = Math.max(0, currentDoc.nextTokenNumber - currentDoc.currentTokenServing - 1);

      consoleContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div>
            <span class="live-indicator-chip">● ACTIVE OPD SESSION</span>
            <h3 style="font-size: 18px; font-weight: 800; margin-top: 4px;">${currentDoc.name}</h3>
            <p style="font-size: 12px; color: var(--text-secondary);">${currentDoc.specialty} • ${currentDoc.room}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: var(--text-muted);">Avg Consultation Time:</div>
            <div style="font-size: 16px; font-weight: 800; color: var(--cyan-bright);">${currentDoc.avgConsultTimeMins} mins / patient</div>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.4); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <div style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.08em;">
            Currently In Consultation Room
          </div>
          <div class="desk-serving-counter">Token #${currentDoc.currentTokenServing}</div>
          <div style="font-size: 13px; color: var(--text-secondary);">
            Next in Queue: <strong>#${currentDoc.currentTokenServing + 1}</strong> (${ahead} more patient tokens waiting)
          </div>
        </div>

        <div class="desk-action-buttons">
          <button class="btn-desk-call" onclick="advanceActiveDeskDoctor()">
            🔔 Call Next Patient (#${currentDoc.currentTokenServing + 1})
          </button>
          <button class="btn-desk-delay" onclick="delayActiveDeskDoctor()">
            ⏱️ Add 5m Consultation Buffer
          </button>
        </div>

        <p style="font-size: 11px; color: var(--text-muted); margin-top: 16px;">
          💡 <strong>Simulator Action:</strong> Clicking "Call Next Patient" advances the hospital queue live, emits the audio chime, and triggers the patient's commute alert!
        </p>
      `;
    }
  }

  window.selectDeskDoctor = function(facId, docId) {
    activeDeskFacId = facId;
    activeDeskDocId = docId;
    renderDoctorDesk();
  };

  window.advanceActiveDeskDoctor = function() {
    window.queueEngine.advanceDoctorQueue(activeDeskFacId, activeDeskDocId);
    renderDoctorDesk();
  };

  window.delayActiveDeskDoctor = function() {
    window.queueEngine.addDoctorDelay(activeDeskFacId, activeDeskDocId, 5);
    renderDoctorDesk();
    showToastNotification("OPD Delay Broadcasted", "Estimated wait times updated across the network.", "info");
  };

  // 9. Symptom Triage Modal
  window.openTriageModal = function() {
    openModal(triageModal);
  };

  const triageForm = document.getElementById("triageForm");
  if (triageForm) {
    triageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const symptomText = document.getElementById("triageSymptomsInput").value;
      const duration = document.getElementById("triageDurationSelect").value;
      const travelReady = document.getElementById("triageTravelRadioYes")?.checked;

      const result = window.triageEngine.evaluate({ symptomText, duration, travelReady });
      renderTriageResult(result);
    });
  }

  function renderTriageResult(res) {
    const resultBox = document.getElementById("triageResultBox");
    if (!resultBox) return;

    let bannerStyle = "border-color: var(--primary); background: rgba(14, 165, 233, 0.1);";
    if (res.classification === "EMERGENCY_RED") {
      bannerStyle = "border-color: var(--status-rose); background: rgba(244, 63, 94, 0.15);";
    } else if (res.classification === "TELEHEALTH_GREEN") {
      bannerStyle = "border-color: var(--status-emerald); background: rgba(16, 185, 129, 0.15);";
    }

    resultBox.style.display = "block";
    resultBox.innerHTML = `
      <div style="border: 1px solid; border-radius: 12px; padding: 20px; ${bannerStyle} margin-top: 20px;">
        <span class="status-badge ${res.classification === 'EMERGENCY_RED' ? 'rose' : res.classification === 'TELEHEALTH_GREEN' ? 'emerald' : 'amber'}">
          ${res.badge}
        </span>
        <h4 style="font-size: 18px; font-weight: 800; margin: 10px 0 6px;">${res.title}</h4>
        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">
          ${res.summary}
        </p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          ${res.requireSos ? `
            <button class="btn-emergency-sos btn-header-pill" onclick="closeModal(triageModal); openEmergencyModal();">
              🚨 View Nearest ER Trauma Bays
            </button>
          ` : ''}
          ${res.canTeleconsult ? `
            <button class="btn-card-teleconsult" style="padding: 10px 20px;" onclick="closeModal(triageModal); openTeleconsultModal('Dr. Julian Croft');">
              💻 Start Zero-Commute Video Consult
            </button>
          ` : ''}
          <button class="btn-primary" style="padding: 10px 20px;" onclick="closeModal(triageModal); openTokenModalForFacility();">
            🎫 Book Remote OPD Token
          </button>
        </div>
      </div>
    `;
  }

  // Quick triage tag fills
  window.fillTriageSymptom = function(text) {
    const input = document.getElementById("triageSymptomsInput");
    if (input) {
      input.value = text;
      input.focus();
    }
  };

  // 10. Teleconsult Simulation Modal
  window.openTeleconsultModal = function(doctorName = "Dr. Julian Croft") {
    const docNameSpan = document.getElementById("teleDocName");
    if (docNameSpan) docNameSpan.textContent = doctorName;
    openModal(teleconsultModal);
    window.queueEngine.playHospitalChime("alert");
  };

  // 11. Emergency Modal
  window.openEmergencyModal = function() {
    renderEmergencyCenters();
    openModal(emergencyModal);
  };

  function renderEmergencyCenters() {
    const container = document.getElementById("emergencyCentersList");
    if (!container) return;
    const facilities = window.queueEngine.facilities.filter(f => f.emergencyOpen);

    container.innerHTML = facilities.map(f => `
      <div style="background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h4 style="font-size: 16px; font-weight: 800; color: #fff;">${f.name}</h4>
            <p style="font-size: 12px; color: #fda4af;">📍 ${f.address} (${f.distanceKm} km • ~${f.travelTimeMins} mins drive)</p>
          </div>
          <span class="status-badge rose">● 24/7 OPEN</span>
        </div>
        <div style="display: flex; gap: 16px; margin-top: 12px; font-size: 13px;">
          <div>🚨 Trauma Bays: <strong>${f.erTraumaBays} Available</strong></div>
          <div>🛏️ ICU Beds: <strong>${f.icuBedsAvailable} Open</strong></div>
          <div>⏱️ Triage Wait: <strong>~${f.erWaitTimeMins} mins</strong></div>
        </div>
        <div style="margin-top: 12px; display: flex; gap: 10px;">
          <a href="tel:${f.phone}" class="btn-emergency-sos btn-header-pill" style="text-decoration: none;">
            📞 Call Emergency Hotline (${f.phone})
          </a>
          <button class="btn-secondary" style="font-size: 12px; padding: 6px 14px;" onclick="showToastNotification('Ambulance Dispatched', 'Paramedic unit en-route to your GPS location.', 'commute')">
            🚑 Dispatch Ambulance
          </button>
        </div>
      </div>
    `).join("");
  }

  // Modal Helpers
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  window.closeModal = function(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  };

  // Close when clicking backdrop
  document.querySelectorAll(".custom-modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  // Keyboard escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".custom-modal-backdrop.open").forEach(m => closeModal(m));
    }
  });

  // Toast Notification Generator
  function showToastNotification(title, body, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-message ${type}`;
    toast.innerHTML = `
      <div class="toast-title">
        <span>${type === 'serving' ? '🔔' : type === 'commute' ? '🚨' : 'ℹ️'}</span>
        <span>${title}</span>
      </div>
      <div class="toast-body">${body}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(120%)";
      toast.style.transition = "all 0.4s ease";
      setTimeout(() => toast.remove(), 400);
    }, 6000);
  }
});
