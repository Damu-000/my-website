// HealthFlow Data Repository: Facilities, Doctors, Queues & Triage Rules

const INITIAL_FACILITIES = [
  {
    id: "fac-1",
    name: "Apex Super Specialty Hospital & Trauma Center",
    type: "hospital",
    category: "Super Specialty Hospital",
    address: "742 Metro Boulevard, Central Healthcare District",
    distanceKm: 2.8,
    travelTimeMins: 12,
    rating: 4.9,
    reviewsCount: 1420,
    phone: "+1 (555) 234-5678",
    emergencyOpen: true,
    erTraumaBays: 5,
    erWaitTimeMins: 4,
    generalBedsAvailable: 28,
    icuBedsAvailable: 6,
    hasPharmacy: true,
    hasDiagnostics: true,
    wheelchairAccessible: true,
    insuranceAccepted: ["CarePass Cashless", "BlueShield", "UnitedHealth", "Aetna", "StarHealth"],
    badge: "Lowest Wait Time Today",
    badgeType: "best",
    departments: [
      { id: "dept-gm", name: "General Medicine", icon: "🩺" },
      { id: "dept-cardio", name: "Cardiology & Vascular", icon: "❤️" },
      { id: "dept-ortho", name: "Orthopedics & Joint Care", icon: "🦴" },
      { id: "dept-ped", name: "Pediatrics & Child Health", icon: "👶" },
      { id: "dept-neuro", name: "Neurology", icon: "🧠" }
    ],
    doctors: [
      {
        id: "doc-1",
        name: "Dr. Evelyn Vance, MD",
        specialty: "Cardiology",
        departmentId: "dept-cardio",
        qualification: "FACC, Harvard Med",
        experience: "16 yrs exp",
        room: "OPD Suite 204",
        currentTokenServing: 14,
        totalQueueLength: 19,
        avgConsultTimeMins: 8,
        nextTokenNumber: 20,
        teleconsultAvailable: true,
        fee: "$65",
        status: "Active - On Duty"
      },
      {
        id: "doc-2",
        name: "Dr. Marcus Reed, MD",
        specialty: "General Medicine",
        departmentId: "dept-gm",
        qualification: "Internal Med Specialist",
        experience: "12 yrs exp",
        room: "OPD Suite 102",
        currentTokenServing: 27,
        totalQueueLength: 31,
        avgConsultTimeMins: 6,
        nextTokenNumber: 32,
        teleconsultAvailable: true,
        fee: "$40",
        status: "Active - On Duty"
      },
      {
        id: "doc-3",
        name: "Dr. Sophia Zhao, MS",
        specialty: "Orthopedics",
        departmentId: "dept-ortho",
        qualification: "Ortho Surgeon & Sports Care",
        experience: "14 yrs exp",
        room: "OPD Suite 310",
        currentTokenServing: 8,
        totalQueueLength: 11,
        avgConsultTimeMins: 10,
        nextTokenNumber: 12,
        teleconsultAvailable: false,
        fee: "$70",
        status: "Active - On Duty"
      }
    ]
  },
  {
    id: "fac-2",
    name: "Beacon 24/7 Urgent Care & Walk-in Clinic",
    type: "urgent_care",
    category: "24/7 Urgent Care",
    address: "185 Oakridge Square, Northside (Near Metro Station)",
    distanceKm: 1.4,
    travelTimeMins: 6,
    rating: 4.8,
    reviewsCount: 890,
    phone: "+1 (555) 456-7890",
    emergencyOpen: true,
    erTraumaBays: 3,
    erWaitTimeMins: 2,
    generalBedsAvailable: 12,
    icuBedsAvailable: 2,
    hasPharmacy: true,
    hasDiagnostics: true,
    wheelchairAccessible: true,
    insuranceAccepted: ["CarePass Cashless", "Cigna", "Medicare", "BlueShield"],
    badge: "Fastest OPD Turnaround",
    badgeType: "fast",
    departments: [
      { id: "dept-urgent", name: "Urgent Outpatient", icon: "⚡" },
      { id: "dept-gm", name: "Family & General Care", icon: "🩺" },
      { id: "dept-minor-trauma", name: "Minor Trauma & Wound Care", icon: "🩹" }
    ],
    doctors: [
      {
        id: "doc-4",
        name: "Dr. Nathan Cole, DO",
        specialty: "Urgent Care & Family Medicine",
        departmentId: "dept-urgent",
        qualification: "Board Certified Emergency Med",
        experience: "10 yrs exp",
        room: "Triage Bay 3",
        currentTokenServing: 34,
        totalQueueLength: 37,
        avgConsultTimeMins: 5,
        nextTokenNumber: 38,
        teleconsultAvailable: true,
        fee: "$45",
        status: "Active - On Duty"
      },
      {
        id: "doc-5",
        name: "Dr. Rachel Kim, MD",
        specialty: "Minor Trauma & Wound Care",
        departmentId: "dept-minor-trauma",
        qualification: "Acute Care Specialist",
        experience: "8 yrs exp",
        room: "Procedure Room B",
        currentTokenServing: 11,
        totalQueueLength: 13,
        avgConsultTimeMins: 9,
        nextTokenNumber: 14,
        teleconsultAvailable: false,
        fee: "$55",
        status: "Active - On Duty"
      }
    ]
  },
  {
    id: "fac-3",
    name: "Bloomfield Community Health & Pediatric Center",
    type: "clinic",
    category: "Community Family Clinic",
    address: "52 Elmhurst Avenue, West Suburbs",
    distanceKm: 4.1,
    travelTimeMins: 16,
    rating: 4.7,
    reviewsCount: 654,
    phone: "+1 (555) 789-0123",
    emergencyOpen: false,
    erTraumaBays: 0,
    erWaitTimeMins: null,
    generalBedsAvailable: 8,
    icuBedsAvailable: 0,
    hasPharmacy: true,
    hasDiagnostics: false,
    wheelchairAccessible: true,
    insuranceAccepted: ["CarePass Cashless", "Medicaid", "BlueCross", "StarHealth"],
    badge: "Top Pediatric OPD",
    badgeType: "pediatric",
    departments: [
      { id: "dept-ped", name: "Pediatrics & Child Wellness", icon: "👶" },
      { id: "dept-gm", name: "General Family Medicine", icon: "🩺" },
      { id: "dept-gyn", name: "Women's Health & Gyn", icon: "🌸" }
    ],
    doctors: [
      {
        id: "doc-6",
        name: "Dr. Ananya Sharma, MD",
        specialty: "Pediatrics",
        departmentId: "dept-ped",
        qualification: "FAAP, Child Development Specialist",
        experience: "15 yrs exp",
        room: "Pediatric Suite 1",
        currentTokenServing: 18,
        totalQueueLength: 22,
        avgConsultTimeMins: 7,
        nextTokenNumber: 23,
        teleconsultAvailable: true,
        fee: "$50",
        status: "Active - On Duty"
      },
      {
        id: "doc-7",
        name: "Dr. David Gallagher, MD",
        specialty: "Family Medicine",
        departmentId: "dept-gm",
        qualification: "Preventative & Primary Care",
        experience: "11 yrs exp",
        room: "Consult 104",
        currentTokenServing: 15,
        totalQueueLength: 16,
        avgConsultTimeMins: 8,
        nextTokenNumber: 17,
        teleconsultAvailable: true,
        fee: "$35",
        status: "Active - On Duty"
      }
    ]
  },
  {
    id: "fac-4",
    name: "Precision Labs, Diagnostics & Imaging Hub",
    type: "diagnostic",
    category: "Diagnostic & Imaging Lab",
    address: "310 Technology Park, Silicon Boulevard",
    distanceKm: 3.5,
    travelTimeMins: 14,
    rating: 4.9,
    reviewsCount: 1102,
    phone: "+1 (555) 321-9876",
    emergencyOpen: false,
    erTraumaBays: 0,
    erWaitTimeMins: null,
    generalBedsAvailable: 4,
    icuBedsAvailable: 0,
    hasPharmacy: false,
    hasDiagnostics: true,
    wheelchairAccessible: true,
    insuranceAccepted: ["CarePass Cashless", "Aetna", "UnitedHealth", "Cigna"],
    badge: "Fast Blood & MRI Tokens",
    badgeType: "lab",
    departments: [
      { id: "dept-blood", name: "Blood Tests & Phlebotomy", icon: "🩸" },
      { id: "dept-mri", name: "MRI, CT Scan & Ultrasound", icon: "🩻" },
      { id: "dept-xray", name: "Digital X-Ray & ECG", icon: "⚡" }
    ],
    doctors: [
      {
        id: "doc-8",
        name: "Dr. Katherine Lee, MD",
        specialty: "Radiology & Imaging",
        departmentId: "dept-mri",
        qualification: "Senior Consultant Radiologist",
        experience: "18 yrs exp",
        room: "Imaging Suite A",
        currentTokenServing: 9,
        totalQueueLength: 11,
        avgConsultTimeMins: 12,
        nextTokenNumber: 12,
        teleconsultAvailable: true,
        fee: "$60",
        status: "Active - On Duty"
      },
      {
        id: "doc-9",
        name: "Technician Desk A - Blood Draw",
        specialty: "Phlebotomy & Rapid Pathology",
        departmentId: "dept-blood",
        qualification: "Certified Lab Team",
        experience: "N/A",
        room: "Phlebotomy Station 1-4",
        currentTokenServing: 42,
        totalQueueLength: 45,
        avgConsultTimeMins: 3,
        nextTokenNumber: 46,
        teleconsultAvailable: false,
        fee: "$20",
        status: "Active - Running"
      }
    ]
  },
  {
    id: "fac-5",
    name: "St. Luke Comprehensive Heart & Specialty Hospital",
    type: "hospital",
    category: "Tertiary Multi-Specialty",
    address: "990 Grand Parkway, South Medical Ring",
    distanceKm: 6.2,
    travelTimeMins: 22,
    rating: 4.8,
    reviewsCount: 2310,
    phone: "+1 (555) 678-1234",
    emergencyOpen: true,
    erTraumaBays: 8,
    erWaitTimeMins: 6,
    generalBedsAvailable: 44,
    icuBedsAvailable: 11,
    hasPharmacy: true,
    hasDiagnostics: true,
    wheelchairAccessible: true,
    insuranceAccepted: ["CarePass Cashless", "All Major Insurances"],
    badge: "24/7 Cardiac Emergency",
    badgeType: "best",
    departments: [
      { id: "dept-cardio", name: "Cardiology", icon: "❤️" },
      { id: "dept-pulmo", name: "Pulmonology & Respiratory", icon: "🫁" },
      { id: "dept-ortho", name: "Orthopedic Surgery", icon: "🦴" },
      { id: "dept-derma", name: "Dermatology", icon: "✨" }
    ],
    doctors: [
      {
        id: "doc-10",
        name: "Dr. Arthur Campbell, MD",
        specialty: "Cardiology & Interventional",
        departmentId: "dept-cardio",
        qualification: "Chief of Cardiology, MD",
        experience: "22 yrs exp",
        room: "Cardiac Suite 401",
        currentTokenServing: 16,
        totalQueueLength: 21,
        avgConsultTimeMins: 10,
        nextTokenNumber: 22,
        teleconsultAvailable: true,
        fee: "$90",
        status: "Active - On Duty"
      },
      {
        id: "doc-11",
        name: "Dr. Elena Rostova, MD",
        specialty: "Pulmonology",
        departmentId: "dept-pulmo",
        qualification: "Chest & Asthma Specialist",
        experience: "13 yrs exp",
        room: "Suite 305",
        currentTokenServing: 19,
        totalQueueLength: 24,
        avgConsultTimeMins: 8,
        nextTokenNumber: 25,
        teleconsultAvailable: true,
        fee: "$65",
        status: "Active - On Duty"
      }
    ]
  },
  {
    id: "fac-6",
    name: "Evergreen Family Wellness & Dermatology Clinic",
    type: "clinic",
    category: "Specialist Outpatient Clinic",
    address: "48 Gardenia Road, Midtown East",
    distanceKm: 3.1,
    travelTimeMins: 11,
    rating: 4.9,
    reviewsCount: 420,
    phone: "+1 (555) 890-4321",
    emergencyOpen: false,
    erTraumaBays: 0,
    erWaitTimeMins: null,
    generalBedsAvailable: 2,
    icuBedsAvailable: 0,
    hasPharmacy: true,
    hasDiagnostics: false,
    wheelchairAccessible: true,
    insuranceAccepted: ["CarePass Cashless", "Cigna", "Aetna"],
    badge: "Same-Day Skin & ENT Tokens",
    badgeType: "fast",
    departments: [
      { id: "dept-derma", name: "Dermatology & Skin", icon: "✨" },
      { id: "dept-ent", name: "ENT & Allergy", icon: "👂" },
      { id: "dept-gm", name: "Preventative Wellness", icon: "🌱" }
    ],
    doctors: [
      {
        id: "doc-12",
        name: "Dr. Priya Balan, MD",
        specialty: "Dermatology",
        departmentId: "dept-derma",
        qualification: "Board Certified Dermatologist",
        experience: "9 yrs exp",
        room: "Suite 101",
        currentTokenServing: 7,
        totalQueueLength: 9,
        avgConsultTimeMins: 12,
        nextTokenNumber: 10,
        teleconsultAvailable: true,
        fee: "$60",
        status: "Active - On Duty"
      }
    ]
  }
];

// Teleconsult Specialists Available Immediately
const TELECONSULT_DOCTORS = [
  {
    id: "tele-1",
    name: "Dr. Julian Croft, MD",
    specialty: "General Medicine & Acute Telehealth",
    waitMins: 3,
    rating: 4.9,
    fee: "$29",
    languages: "English, Spanish",
    isOnline: true
  },
  {
    id: "tele-2",
    name: "Dr. Maya Lin, MD",
    specialty: "Pediatrics & Child Care",
    waitMins: 5,
    rating: 4.8,
    fee: "$35",
    languages: "English, Mandarin",
    isOnline: true
  },
  {
    id: "tele-3",
    name: "Dr. Tariq Al-Mansoor, MD",
    specialty: "Dermatology & Quick Skin Evaluation",
    waitMins: 8,
    rating: 4.9,
    fee: "$40",
    languages: "English, Arabic",
    isOnline: true
  }
];

// Symptom Triage Tree
const TRIAGE_QUESTIONS = [
  {
    id: "symp-1",
    label: "What is your primary symptom or reason for care?",
    options: [
      { text: "Severe chest pain, breathing difficulty, sudden facial droop or numbness", severity: "emergency", dept: "Emergency / Cardiology" },
      { text: "High fever (>102°F), persistent vomiting, acute severe abdominal pain", severity: "urgent", dept: "dept-urgent" },
      { text: "Sprained ankle, suspected fracture, joint swelling after fall", severity: "urgent", dept: "dept-ortho" },
      { text: "Persistent cough, sore throat, mild cold, body aches for 2-3 days", severity: "telehealth", dept: "dept-gm" },
      { text: "Skin rash, hives, acne flare-up, allergic itch", severity: "telehealth", dept: "dept-derma" },
      { text: "Child ear pain, infant fever, routine vaccination check", severity: "clinic", dept: "dept-ped" },
      { text: "Prescription refill, routine blood work, annual checkup", severity: "routine", dept: "dept-gm" }
    ]
  },
  {
    id: "symp-2",
    label: "How long have you had this condition?",
    options: [
      { text: "Under 1 hour (Sudden onset)", weight: 3 },
      { text: "1 - 24 hours", weight: 2 },
      { text: "2 - 7 days", weight: 1 },
      { text: "More than a week / Chronic condition", weight: 0 }
    ]
  },
  {
    id: "symp-3",
    label: "Can you travel comfortably to a clinic right now?",
    options: [
      { text: "Yes, I have private transport / ride available (10-25 mins)", travelReady: true },
      { text: "No / Prefer to avoid travel entirely from home", travelReady: false, preferVirtual: true },
      { text: "Need urgent transport / ambulance assistance", travelReady: false, needSos: true }
    ]
  }
];
