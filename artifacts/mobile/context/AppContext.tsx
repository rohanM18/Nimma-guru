import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { APPRECIATIONS, Appreciation, BookedSession, GURUS, INITIAL_BOOKINGS } from "@/data/mockData";

export type Role = "student" | "guru" | null;
export type Language = "en" | "kn";
export type TextSize = "normal" | "large";

export interface StudentProfile {
  fullName: string;
  age: string;
  school: string;
  village: string;
  bio: string;
  interests: string;
  subjects: string;
}

export interface GuruProfile {
  fullName: string;
  profession: string;
  experience: string;
  subjects: string;
  availability: string;
  bio: string;
  village: string;
  whatsapp: string;
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  isOnboarded: boolean;
  setIsOnboarded: (v: boolean) => void;
  studentProfile: StudentProfile;
  setStudentProfile: (p: StudentProfile) => void;
  guruProfile: GuruProfile;
  setGuruProfile: (p: GuruProfile) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  textSize: TextSize;
  setTextSize: (s: TextSize) => void;
  bookings: BookedSession[];
  addBooking: (b: BookedSession) => void;
  removeBooking: (id: string) => void;
  appreciations: Appreciation[];
  addAppreciation: (a: Appreciation) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    tagline: "Village mentorship through Gyaan-Daan",
    gurus: "Gurus",
    calendar: "Calendar",
    bookings: "Bookings",
    thanks: "Thanks",
    profile: "Profile",
    discoverGurus: "Discover Gurus",
    searchPlaceholder: "Search by name, subject or village...",
    bookSession: "Book Session",
    appreciationWall: "Appreciation Wall",
    addNote: "Add Note",
    settings: "Settings",
    language: "Language",
    darkMode: "Dark Mode",
    textSize: "Text Size",
    learn: "Learn",
    teach: "Teach",
    student: "Student / Parent",
    mentor: "Guru / Mentor",
    welcomeBack: "Welcome Back",
    signInGoogle: "Continue with Google",
    signInPhone: "Continue with Phone OTP",
    upcoming: "Upcoming Sessions",
    myBookings: "My Bookings",
    noBookings: "No bookings yet",
    noSessions: "No upcoming sessions",
    directions: "Directions",
    whatsapp: "WhatsApp",
    experience: "Experience",
    availability: "Availability",
    languages: "Languages",
    subjectsTaught: "Subjects",
    rating: "Rating",
    reviews: "reviews",
    spotsLeft: "spots left",
    booked: "Booked",
    thankYouNote: "Write a thank-you note",
    yourName: "Your name",
    grade: "Grade / Class",
    school: "School name",
    message: "Your message",
    postNote: "Post Note",
    cancel: "Cancel",
    normal: "Normal",
    large: "Large",
    village: "Village",
    district: "District",
    sessionsCompleted: "Sessions",
    studentsTaught: "Students",
    myProfile: "My Profile",
    fullName: "Full Name",
    save: "Save",
  },
  kn: {
    tagline: "ಜ್ಞಾನ-ದಾನದ ಮೂಲಕ ಗ್ರಾಮ ಮಾರ್ಗದರ್ಶನ",
    gurus: "ಗುರುಗಳು",
    calendar: "ಕ್ಯಾಲೆಂಡರ್",
    bookings: "ಬುಕಿಂಗ್",
    thanks: "ಧನ್ಯವಾದ",
    profile: "ಪ್ರೊಫೈಲ್",
    discoverGurus: "ಗುರುಗಳನ್ನು ಹುಡುಕಿ",
    searchPlaceholder: "ಹೆಸರು, ವಿಷಯ ಅಥವಾ ಗ್ರಾಮದಿಂದ ಹುಡುಕಿ...",
    bookSession: "ಸೆಷನ್ ಬುಕ್ ಮಾಡಿ",
    appreciationWall: "ಕೃತಜ್ಞತಾ ಗೋಡೆ",
    addNote: "ನೋಟ್ ಸೇರಿಸಿ",
    settings: "ಸೆಟ್ಟಿಂಗ್ಸ್",
    language: "ಭಾಷೆ",
    darkMode: "ಡಾರ್ಕ್ ಮೋಡ್",
    textSize: "ಅಕ್ಷರ ಗಾತ್ರ",
    learn: "ಕಲಿಯಿರಿ",
    teach: "ಕಲಿಸಿರಿ",
    student: "ವಿದ್ಯಾರ್ಥಿ / ಪೋಷಕ",
    mentor: "ಗುರು / ಮಾರ್ಗದರ್ಶಕ",
    welcomeBack: "ಸ್ವಾಗತ",
    signInGoogle: "Google ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ",
    signInPhone: "Phone OTP ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ",
    upcoming: "ಮುಂಬರುವ ಸೆಷನ್‌ಗಳು",
    myBookings: "ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು",
    noBookings: "ಯಾವುದೇ ಬುಕಿಂಗ್ ಇಲ್ಲ",
    noSessions: "ಮುಂಬರುವ ಸೆಷನ್‌ಗಳಿಲ್ಲ",
    directions: "ದಿಕ್ಕುಗಳು",
    whatsapp: "ವಾಟ್ಸ್‌ಆಪ್",
    experience: "ಅನುಭವ",
    availability: "ಲಭ್ಯತೆ",
    languages: "ಭಾಷೆಗಳು",
    subjectsTaught: "ವಿಷಯಗಳು",
    rating: "ರೇಟಿಂಗ್",
    reviews: "ವಿಮರ್ಶೆಗಳು",
    spotsLeft: "ಸ್ಥಳಗಳು ಉಳಿದಿವೆ",
    booked: "ಬುಕ್ ಆಗಿದೆ",
    thankYouNote: "ಧನ್ಯವಾದ ಟಿಪ್ಪಣಿ ಬರೆಯಿರಿ",
    yourName: "ನಿಮ್ಮ ಹೆಸರು",
    grade: "ತರಗತಿ",
    school: "ಶಾಲೆಯ ಹೆಸರು",
    message: "ನಿಮ್ಮ ಸಂದೇಶ",
    postNote: "ಪೋಸ್ಟ್ ಮಾಡಿ",
    cancel: "ರದ್ದು",
    normal: "ಸಾಮಾನ್ಯ",
    large: "ದೊಡ್ಡದು",
    village: "ಗ್ರಾಮ",
    district: "ಜಿಲ್ಲೆ",
    sessionsCompleted: "ಸೆಷನ್‌ಗಳು",
    studentsTaught: "ವಿದ್ಯಾರ್ಥಿಗಳು",
    myProfile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    save: "ಉಳಿಸಿ",
  },
};

const defaultStudent: StudentProfile = {
  fullName: "",
  age: "",
  school: "",
  village: "",
  bio: "",
  interests: "",
  subjects: "",
};

const defaultGuru: GuruProfile = {
  fullName: "",
  profession: "",
  experience: "",
  subjects: "",
  availability: "",
  bio: "",
  village: "",
  whatsapp: "",
};

const AppContext = createContext<AppContextType>({
  role: null,
  setRole: () => {},
  isOnboarded: false,
  setIsOnboarded: () => {},
  studentProfile: defaultStudent,
  setStudentProfile: () => {},
  guruProfile: defaultGuru,
  setGuruProfile: () => {},
  language: "en",
  setLanguage: () => {},
  textSize: "normal",
  setTextSize: () => {},
  bookings: [],
  addBooking: () => {},
  removeBooking: () => {},
  appreciations: [],
  addAppreciation: () => {},
  t: (k) => k,
});

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);
  const [isOnboarded, setIsOnboardedState] = useState(false);
  const [studentProfile, setStudentProfileState] = useState<StudentProfile>(defaultStudent);
  const [guruProfile, setGuruProfileState] = useState<GuruProfile>(defaultGuru);
  const [language, setLanguageState] = useState<Language>("en");
  const [textSize, setTextSizeState] = useState<TextSize>("normal");
  const [bookings, setBookings] = useState<BookedSession[]>(INITIAL_BOOKINGS);
  const [appreciations, setAppreciations] = useState<Appreciation[]>(APPRECIATIONS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadState() {
      try {
        const [onboarded, savedRole, savedLang, savedSize, savedBookings, savedAppreciations, savedStudent, savedGuru] = await Promise.all([
          AsyncStorage.getItem("isOnboarded"),
          AsyncStorage.getItem("role"),
          AsyncStorage.getItem("language"),
          AsyncStorage.getItem("textSize"),
          AsyncStorage.getItem("bookings"),
          AsyncStorage.getItem("appreciations"),
          AsyncStorage.getItem("studentProfile"),
          AsyncStorage.getItem("guruProfile"),
        ]);
        if (onboarded === "true") setIsOnboardedState(true);
        if (savedRole) setRoleState(savedRole as Role);
        if (savedLang) setLanguageState(savedLang as Language);
        if (savedSize) setTextSizeState(savedSize as TextSize);
        if (savedBookings) setBookings(JSON.parse(savedBookings));
        if (savedAppreciations) setAppreciations(JSON.parse(savedAppreciations));
        if (savedStudent) setStudentProfileState(JSON.parse(savedStudent));
        if (savedGuru) setGuruProfileState(JSON.parse(savedGuru));
      } catch {}
      setLoaded(true);
    }
    loadState();
  }, []);

  const setRole = useCallback(async (r: Role) => {
    setRoleState(r);
    if (r) await AsyncStorage.setItem("role", r);
  }, []);

  const setIsOnboarded = useCallback(async (v: boolean) => {
    setIsOnboardedState(v);
    await AsyncStorage.setItem("isOnboarded", String(v));
  }, []);

  const setStudentProfile = useCallback(async (p: StudentProfile) => {
    setStudentProfileState(p);
    await AsyncStorage.setItem("studentProfile", JSON.stringify(p));
  }, []);

  const setGuruProfile = useCallback(async (p: GuruProfile) => {
    setGuruProfileState(p);
    await AsyncStorage.setItem("guruProfile", JSON.stringify(p));
  }, []);

  const setLanguage = useCallback(async (l: Language) => {
    setLanguageState(l);
    await AsyncStorage.setItem("language", l);
  }, []);

  const setTextSize = useCallback(async (s: TextSize) => {
    setTextSizeState(s);
    await AsyncStorage.setItem("textSize", s);
  }, []);

  const addBooking = useCallback(async (b: BookedSession) => {
    setBookings((prev) => {
      const next = [b, ...prev];
      AsyncStorage.setItem("bookings", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeBooking = useCallback(async (id: string) => {
    setBookings((prev) => {
      const next = prev.filter((b) => b.id !== id);
      AsyncStorage.setItem("bookings", JSON.stringify(next));
      return next;
    });
  }, []);

  const addAppreciation = useCallback(async (a: Appreciation) => {
    setAppreciations((prev) => {
      const next = [a, ...prev];
      AsyncStorage.setItem("appreciations", JSON.stringify(next));
      return next;
    });
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] ?? translations["en"][key] ?? key;
  }, [language]);

  if (!loaded) return null;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isOnboarded,
        setIsOnboarded,
        studentProfile,
        setStudentProfile,
        guruProfile,
        setGuruProfile,
        language,
        setLanguage,
        textSize,
        setTextSize,
        bookings,
        addBooking,
        removeBooking,
        appreciations,
        addAppreciation,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
