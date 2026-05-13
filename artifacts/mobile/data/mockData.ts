export interface Guru {
  id: string;
  name: string;
  profession: string;
  experience: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  village: string;
  district: string;
  bio: string;
  availability: string;
  whatsapp: string;
  initials: string;
  avatarColor: string;
  languages: string[];
  sessionsCompleted: number;
  studentsTaught: number;
}

export interface Session {
  id: string;
  guruId: string;
  guruName: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  duration: string;
  mode: "in-person" | "online";
  spotsLeft: number;
  totalSpots: number;
}

export interface Appreciation {
  id: string;
  studentName: string;
  grade: string;
  school: string;
  guruName: string;
  message: string;
  date: string;
  gradientStart: string;
  gradientEnd: string;
}

export interface BookedSession {
  id: string;
  guruId: string;
  guruName: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  guruInitials: string;
  guruAvatarColor: string;
}

export const GURUS: Guru[] = [
  {
    id: "1",
    name: "Nagaraj Patil",
    profession: "Retired Mathematics Teacher",
    experience: "32 years",
    subjects: ["Mathematics", "Physics", "Statistics"],
    rating: 4.9,
    reviewCount: 48,
    village: "Alnavar",
    district: "Dharwad",
    bio: "Spent 32 years teaching at government high schools across north Karnataka. Passionate about making mathematics accessible to rural students who lack quality coaching. Believes every child can excel with the right guidance.",
    availability: "Mon, Wed, Fri — 4:00–7:00 PM",
    whatsapp: "+91 94481 23456",
    initials: "NP",
    avatarColor: "#2D6A4F",
    languages: ["Kannada", "Hindi", "English"],
    sessionsCompleted: 124,
    studentsTaught: 340,
  },
  {
    id: "2",
    name: "Sujatha Rao",
    profession: "Retired Science Teacher",
    experience: "28 years",
    subjects: ["Biology", "Chemistry", "Environmental Science"],
    rating: 4.8,
    reviewCount: 36,
    village: "Nanjangud",
    district: "Mysuru",
    bio: "Former head of science department at Mysuru Government PU College. Specializes in practical science experiments with local materials. Mentored students who went on to study medicine and engineering.",
    availability: "Tue, Thu, Sat — 5:00–8:00 PM",
    whatsapp: "+91 96320 78901",
    initials: "SR",
    avatarColor: "#6B3FA0",
    languages: ["Kannada", "Telugu", "English"],
    sessionsCompleted: 89,
    studentsTaught: 210,
  },
  {
    id: "3",
    name: "Ramesh Kulkarni",
    profession: "Retired ISRO Engineer",
    experience: "38 years",
    subjects: ["Engineering Concepts", "Physics", "Computer Science"],
    rating: 4.9,
    reviewCount: 29,
    village: "Channapatna",
    district: "Ramanagara",
    bio: "Worked at ISRO for nearly four decades on satellite communications. Now dedicating time to inspire rural youth about science and technology. Runs free weekend workshops on basic electronics and robotics.",
    availability: "Sat, Sun — 10:00 AM–1:00 PM",
    whatsapp: "+91 98450 34567",
    initials: "RK",
    avatarColor: "#C4520A",
    languages: ["Kannada", "English"],
    sessionsCompleted: 67,
    studentsTaught: 145,
  },
  {
    id: "4",
    name: "Kavitha Hegde",
    profession: "Retired School Principal",
    experience: "35 years",
    subjects: ["English Language", "Life Skills", "Leadership"],
    rating: 4.7,
    reviewCount: 52,
    village: "Haveri",
    district: "Haveri",
    bio: "Former principal of a 2,000-student school in north Karnataka. Expert in English communication for rural students, career guidance, and building confidence in first-generation learners.",
    availability: "Mon–Fri — 6:00–8:00 PM",
    whatsapp: "+91 97312 45678",
    initials: "KH",
    avatarColor: "#BE185D",
    languages: ["Kannada", "English", "Marathi"],
    sessionsCompleted: 156,
    studentsTaught: 420,
  },
  {
    id: "5",
    name: "Venkatesh Murthy",
    profession: "Retired Government Doctor",
    experience: "30 years",
    subjects: ["Health & Hygiene", "Biology", "First Aid"],
    rating: 4.8,
    reviewCount: 41,
    village: "Bhadravati",
    district: "Shivamogga",
    bio: "Served as a district health officer for 20 years. Now teaches health literacy, menstrual health, nutrition, and basic medicine to adolescents in government schools across Malnad region.",
    availability: "Wed, Fri — 4:30–7:00 PM",
    whatsapp: "+91 94824 56789",
    initials: "VM",
    avatarColor: "#0369A1",
    languages: ["Kannada", "Tamil", "English"],
    sessionsCompleted: 98,
    studentsTaught: 280,
  },
  {
    id: "6",
    name: "Prabha Shetty",
    profession: "Retired Bank Manager",
    experience: "26 years",
    subjects: ["Financial Literacy", "Commerce", "Accountancy"],
    rating: 4.6,
    reviewCount: 33,
    village: "Kundapura",
    district: "Udupi",
    bio: "Senior manager with Canara Bank for 26 years. Now teaches rural families and students about savings, banking, schemes for rural youth, and basic accounting. Helped over 200 families open their first bank accounts.",
    availability: "Tue, Thu, Sat — 5:30–8:00 PM",
    whatsapp: "+91 99160 67890",
    initials: "PS",
    avatarColor: "#CA8A04",
    languages: ["Kannada", "Tulu", "English"],
    sessionsCompleted: 72,
    studentsTaught: 190,
  },
  {
    id: "7",
    name: "Krishnamurthy D",
    profession: "Retired IAS Officer",
    experience: "33 years",
    subjects: ["General Knowledge", "Competitive Exams", "Governance"],
    rating: 4.9,
    reviewCount: 22,
    village: "Devadurga",
    district: "Raichur",
    bio: "Retired IAS officer with experience in rural development and education policy. Now coaches Hyderabad-Karnataka region students for UPSC, KAS, and competitive exams free of charge.",
    availability: "Sat, Sun — 8:00–11:00 AM",
    whatsapp: "+91 95350 12345",
    initials: "KD",
    avatarColor: "#4F46E5",
    languages: ["Kannada", "Urdu", "Telugu", "English"],
    sessionsCompleted: 45,
    studentsTaught: 88,
  },
  {
    id: "8",
    name: "Anita Bhat",
    profession: "Retired Home Science Teacher",
    experience: "24 years",
    subjects: ["Home Science", "Nutrition", "Women Empowerment"],
    rating: 4.7,
    reviewCount: 45,
    village: "Sirsi",
    district: "Uttara Kannada",
    bio: "Taught home science and nutrition at several Sarvodaya Vidyalayas. Runs skill workshops for girls on tailoring, food processing, and entrepreneurship to help them become financially independent.",
    availability: "Mon, Wed, Fri — 3:00–6:00 PM",
    whatsapp: "+91 93415 89012",
    initials: "AB",
    avatarColor: "#0D9488",
    languages: ["Kannada", "Konkani", "English"],
    sessionsCompleted: 113,
    studentsTaught: 320,
  },
];

export const UPCOMING_SESSIONS: Session[] = [
  {
    id: "sess1",
    guruId: "1",
    guruName: "Nagaraj Patil",
    subject: "Class 10 Mathematics — Trigonometry",
    date: "Fri, 15 Jun 2026",
    time: "4:00 PM",
    location: "Village Library, Alnavar, Dharwad",
    duration: "2 hours",
    mode: "in-person",
    spotsLeft: 4,
    totalSpots: 15,
  },
  {
    id: "sess2",
    guruId: "2",
    guruName: "Sujatha Rao",
    subject: "Biology — Human Body Systems",
    date: "Tue, 17 Jun 2026",
    time: "5:30 PM",
    location: "Panchayat Hall, Nanjangud",
    duration: "1.5 hours",
    mode: "in-person",
    spotsLeft: 8,
    totalSpots: 20,
  },
  {
    id: "sess3",
    guruId: "3",
    guruName: "Ramesh Kulkarni",
    subject: "Introduction to Robotics & Electronics",
    date: "Sat, 21 Jun 2026",
    time: "10:00 AM",
    location: "Govt. High School, Channapatna",
    duration: "3 hours",
    mode: "in-person",
    spotsLeft: 2,
    totalSpots: 12,
  },
  {
    id: "sess4",
    guruId: "4",
    guruName: "Kavitha Hegde",
    subject: "Spoken English for Rural Students",
    date: "Mon, 23 Jun 2026",
    time: "6:00 PM",
    location: "Community Centre, Haveri",
    duration: "1.5 hours",
    mode: "in-person",
    spotsLeft: 12,
    totalSpots: 25,
  },
  {
    id: "sess5",
    guruId: "7",
    guruName: "Krishnamurthy D",
    subject: "KAS Exam — Current Affairs Prep",
    date: "Sun, 29 Jun 2026",
    time: "9:00 AM",
    location: "District Library, Raichur",
    duration: "2.5 hours",
    mode: "in-person",
    spotsLeft: 6,
    totalSpots: 15,
  },
];

export const APPRECIATIONS: Appreciation[] = [
  {
    id: "app1",
    studentName: "Divya Nayak",
    grade: "10th Grade",
    school: "Govt. High School, Alnavar",
    guruName: "Nagaraj Patil",
    message:
      "Nagaraj sir made trigonometry feel like a game. I scored 98 in my board exam after just three sessions with him. He never made me feel stupid for asking basic questions. I owe my engineering seat to his guidance.",
    date: "May 2026",
    gradientStart: "#2D6A4F",
    gradientEnd: "#3D9A6A",
  },
  {
    id: "app2",
    studentName: "Raju Hosamani",
    grade: "12th Grade",
    school: "Sarvodaya PU College, Dharwad",
    guruName: "Ramesh Kulkarni",
    message:
      "Sir showed us how satellites work using cardboard and wires. I never thought I could understand engineering — but now I want to join ISRO one day. Thank you for believing in village kids like me.",
    date: "April 2026",
    gradientStart: "#C4520A",
    gradientEnd: "#EA580C",
  },
  {
    id: "app3",
    studentName: "Meena Patgar",
    grade: "8th Grade",
    school: "Govt. Middle School, Nanjangud",
    guruName: "Sujatha Rao",
    message:
      "I was afraid of science. Sujatha ma'am brought a live frog heart for us to see and explained biology in Kannada with such love. Now science is my favourite subject and I want to become a doctor.",
    date: "May 2026",
    gradientStart: "#6B3FA0",
    gradientEnd: "#8B5CF6",
  },
  {
    id: "app4",
    studentName: "Suresh Lamani",
    grade: "Parents Group",
    school: "Devadurga Village",
    guruName: "Krishnamurthy D",
    message:
      "My son wanted to give up his dream of becoming an officer. After three months with Krishnamurthy sir, he cleared the KAS prelims. What IAS coaching centres charge lakhs for, sir gave freely.",
    date: "March 2026",
    gradientStart: "#4F46E5",
    gradientEnd: "#7C3AED",
  },
  {
    id: "app5",
    studentName: "Ananya Shetty",
    grade: "11th Grade",
    school: "Govt. PU College, Kundapura",
    guruName: "Prabha Shetty",
    message:
      "Prabha ma'am taught us how to open a bank account and explained government scholarship schemes. I got a scholarship I didn't know existed. She is truly a community treasure.",
    date: "April 2026",
    gradientStart: "#CA8A04",
    gradientEnd: "#D97706",
  },
  {
    id: "app6",
    studentName: "Bhavana Gowda",
    grade: "12th Grade",
    school: "Govt. High School, Haveri",
    guruName: "Kavitha Hegde",
    message:
      "I could not speak one sentence of English without shaking. After Kavitha ma'am's sessions, I spoke at my district youth conference. The confidence she builds is something no textbook can teach.",
    date: "May 2026",
    gradientStart: "#BE185D",
    gradientEnd: "#EC4899",
  },
];

export const INITIAL_BOOKINGS: BookedSession[] = [
  {
    id: "bk1",
    guruId: "1",
    guruName: "Nagaraj Patil",
    subject: "Class 10 Mathematics — Trigonometry",
    date: "Fri, 15 Jun 2026",
    time: "4:00 PM",
    location: "Village Library, Alnavar, Dharwad",
    status: "upcoming",
    guruInitials: "NP",
    guruAvatarColor: "#2D6A4F",
  },
];
