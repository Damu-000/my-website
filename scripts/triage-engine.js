// HealthFlow Smart Symptom Triage Engine

class TriageEngine {
  constructor() {
    this.rules = [
      {
        keywords: ["chest pain", "shortness of breath", "breathing difficulty", "stroke", "paralysis", "droop", "unconscious", "head injury", "severe bleeding"],
        classification: "EMERGENCY_RED",
        title: "Immediate Emergency Care Required (Level 1 Red)",
        summary: "Your symptoms indicate a potentially life-threatening condition requiring immediate hospital resuscitation or trauma care. Do not wait in an outpatient queue.",
        badge: "🚨 RED TRIAGE - CALL 911 / HEAD TO ER",
        actionText: "Route to Nearest Emergency Trauma Bay",
        suggestedFacilityType: "hospital",
        requireSos: true,
        canTeleconsult: false
      },
      {
        keywords: ["fracture", "broken bone", "high fever", "severe abdominal pain", "asthma attack", "deep cut", "sprain", "vomiting blood"],
        classification: "URGENT_YELLOW",
        title: "Urgent Outpatient / Walk-in Care (Level 2 Yellow)",
        summary: "You need prompt physical evaluation within 1 to 2 hours. Secure a remote walk-in token now so you can avoid waiting room exposure.",
        badge: "⚡ YELLOW TRIAGE - URGENT OPD TOKEN",
        actionText: "Book Fast Urgent Care Token",
        suggestedFacilityType: "urgent_care",
        requireSos: false,
        canTeleconsult: false
      },
      {
        keywords: ["rash", "cold", "cough", "sore throat", "mild fever", "acne", "flu", "sinus", "pink eye", "prescription refill", "headache", "itch"],
        classification: "TELEHEALTH_GREEN",
        title: "Zero-Commute Virtual Teleconsult Recommended (Level 3 Green)",
        summary: "Great news: your condition can be thoroughly evaluated via an instant video consultation with a certified physician right from your home, saving 100% of travel and waiting room exposure.",
        badge: "🌱 GREEN TRIAGE - INSTANT VIRTUAL CONSULT",
        actionText: "Connect with On-Call Doctor (Wait ~3m)",
        suggestedFacilityType: "telehealth",
        requireSos: false,
        canTeleconsult: true
      },
      {
        keywords: ["joint pain", "back pain", "diabetes", "hypertension", "skin check", "child checkup", "ear wax", "allergies", "routine"],
        classification: "ROUTINE_BLUE",
        title: "Specialist Outpatient Token (Level 4 Blue)",
        summary: "A scheduled specialist appointment or remote OPD token is best. You can issue a token from home and arrive only when your slot is near.",
        badge: "🩺 BLUE TRIAGE - SPECIALIST OPD TOKEN",
        actionText: "Select Specialist & Book Token",
        suggestedFacilityType: "clinic",
        requireSos: false,
        canTeleconsult: true
      }
    ];
  }

  evaluate({ symptomText, duration, travelReady, ageGroup = "adult" }) {
    const text = (symptomText || "").toLowerCase();

    // Check emergency red flags first
    for (const rule of this.rules) {
      const match = rule.keywords.some(kw => text.includes(kw));
      if (match) {
        return {
          ...rule,
          duration,
          travelReady,
          ageGroup,
          evaluatedAt: new Date()
        };
      }
    }

    // Default heuristic based on travel preference and general symptoms
    if (!travelReady) {
      return {
        classification: "TELEHEALTH_GREEN",
        title: "Virtual Doctor Video Consult Recommended",
        summary: "Since traveling is difficult or inconvenient today, connect via secure teleconsult to receive medical advice, prescriptions, or referrals without leaving home.",
        badge: "🌱 GREEN TRIAGE - ZERO TRAVEL TELEHEALTH",
        actionText: "Start Instant Teleconsult (~3 min wait)",
        suggestedFacilityType: "telehealth",
        requireSos: false,
        canTeleconsult: true
      };
    }

    return {
      classification: "ROUTINE_BLUE",
      title: "Outpatient Clinic Consultation",
      summary: "Your symptoms are suitable for a regular outpatient doctor consultation. Issue a remote token to skip the waiting room queue.",
      badge: "🩺 BLUE TRIAGE - REMOTE CLINIC TOKEN",
      actionText: "Find Nearest Clinic & Issue Token",
      suggestedFacilityType: "clinic",
      requireSos: false,
      canTeleconsult: true
    };
  }
}

// Global instance
window.triageEngine = new TriageEngine();
