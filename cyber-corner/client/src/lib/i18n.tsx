import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "bn";

const translations = {
  en: {
    home: "Home",
    request: "Request Service",
    track: "Track Request",
    adminLogin: "Admin Login",
    heroTitle: "CYBER CORNER",
    heroSubtitle: "Your Digital Service Center",
    heroDesc: "Professional computer services, document printing, internet access, and more.",
    getStarted: "Request a Service",
    trackRequest: "Track Your Request",
    servicesTitle: "Our Services",
    noticesTitle: "Notices",
    noNotices: "No notices at this time.",
    footerAddress: "Gopiballavpur (In front of Yatra Maydan), Jhargram – 721506",
    footerRights: "All rights reserved.",
    name: "Name",
    phone: "Phone",
    serviceType: "Service Type",
    message: "Message",
    document: "Upload Document",
    submit: "Submit Request",
    submitting: "Submitting...",
    submitted: "Request submitted successfully!",
    trackPhone: "Enter your phone number to track your request",
    search: "Search",
    status: "Status",
    pending: "Pending",
    completed: "Completed",
    noRecords: "No records found for this phone number.",
    adminNotes: "Admin Notes",
    owner: "Prop. – Prabir & Subham",
    whatsapp: "Chat on WhatsApp",
    services: {
      formFillup: "Online Form Fill-up",
      aadhaarDownload: "Aadhaar Card Download",
      panCard: "PAN Card",
      passport: "Passport",
      mobileRecharge: "Mobile Recharge",
      railwayTicket: "Railway Ticket Booking",
      dataRecharge: "Data Recharge",
      electricityBill: "Electricity Bill Payment",
      xerox: "Xerox / Photocopy",
      cashWithdrawal: "Cash Withdrawal (ATM & Aadhaar)",
      printing: "Printing Services",
      lamination: "Lamination",
      photoPrint: "Photo Print",
      tradeLicence: "Trade Licence",
      udyamReg: "Udyam Registration",
      vehicleTax: "Vehicle Tax Payment",
      cmcVellore: "CMC Vellore Appointment",
      driverAuth: "Driver Authorization",
      onlineApps: "All Online Applications",
    },
  },
  bn: {
    home: "হোম",
    request: "সেবার অনুরোধ",
    track: "অনুরোধ ট্র্যাক",
    adminLogin: "অ্যাডমিন লগইন",
    heroTitle: "সাইবার কর্নার",
    heroSubtitle: "আপনার ডিজিটাল সেবা কেন্দ্র",
    heroDesc: "পেশাদার কম্পিউটার সেবা, ডকুমেন্ট প্রিন্টিং, ইন্টারনেট অ্যাক্সেস এবং আরও অনেক কিছু।",
    getStarted: "সেবার অনুরোধ করুন",
    trackRequest: "আপনার অনুরোধ ট্র্যাক করুন",
    servicesTitle: "আমাদের সেবাসমূহ",
    noticesTitle: "বিজ্ঞপ্তি",
    noNotices: "এই মুহূর্তে কোনো বিজ্ঞপ্তি নেই।",
    footerAddress: "গোপীবল্লভপুর (যাত্রা ময়দানের সামনে), ঝাড়গ্রাম – ৭২১৫০৬",
    footerRights: "সমস্ত অধিকার সংরক্ষিত।",
    name: "নাম",
    phone: "ফোন",
    serviceType: "সেবার ধরন",
    message: "বার্তা",
    document: "ডকুমেন্ট আপলোড",
    submit: "অনুরোধ জমা দিন",
    submitting: "জমা হচ্ছে...",
    submitted: "অনুরোধ সফলভাবে জমা হয়েছে!",
    trackPhone: "আপনার অনুরোধ ট্র্যাক করতে ফোন নম্বর দিন",
    search: "খুঁজুন",
    status: "অবস্থা",
    pending: "অপেক্ষারত",
    completed: "সম্পন্ন",
    noRecords: "এই ফোন নম্বরে কোনো রেকর্ড পাওয়া যায়নি।",
    adminNotes: "অ্যাডমিন নোট",
    owner: "মালিক – প্রবীর ও শুভম",
    whatsapp: "হোয়াটসঅ্যাপে চ্যাট করুন",
    services: {
      formFillup: "অনলাইন ফর্ম ফিলাপ",
      aadhaarDownload: "আধার কার্ড ডাউনলোড",
      panCard: "প্যান কার্ড",
      passport: "পাসপোর্ট",
      mobileRecharge: "মোবাইল রিচার্জ",
      railwayTicket: "রেলওয়ে টিকিট বুকিং",
      dataRecharge: "ডেটা রিচার্জ",
      electricityBill: "বিদ্যুৎ বিল পেমেন্ট",
      xerox: "জেরক্স / ফটোকপি",
      cashWithdrawal: "নগদ টাকা তোলা (ATM এবং আধার)",
      printing: "প্রিন্টিং সার্ভিসেস",
      lamination: "ল্যামিনেশন",
      photoPrint: "ফটো প্রিন্ট",
      tradeLicence: "ট্রেড লাইসেন্স",
      udyamReg: "উদ্যম রেজিস্ট্রেশন",
      vehicleTax: "যানবাহন ট্যাক্স পেমেন্ট",
      cmcVellore: "সিএমসি ভেলোর অ্যাপয়েন্টমেন্ট",
      driverAuth: "ড্রাইভার অথরাইজেশন",
      onlineApps: "সব ধরনের অনলাইন আবেদন",
    },
  },
};

type Translations = typeof translations.en;
type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
};

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
