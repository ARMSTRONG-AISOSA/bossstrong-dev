// Certifications aren't database-backed (no admin CRUD, no schema table) —
// hand-authored here, like lib/data/projects.ts. Shown on the About page per
// about-specification.md §4.7. Content-authenticity rule
// (homepage-specification.md §9): every entry comes from the owner's real CV
// (ArmstrongOmoregie-CV-15-09-2026) or a certificate they supplied directly,
// credential links included — nothing invented. Newest first.

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  // Omitted (not faked) when there's no verifiable credential page.
  url?: string;
};

export const certifications: Certification[] = [
  {
    name: "CS302: Software Engineering",
    issuer: "Saylor University",
    date: "2026",
    // Saylor's verify form, pre-filled with the certificate code.
    url: "https://learn.saylor.org/admin/tool/certificate/index.php?code=1341921559AO",
  },
  {
    name: "Introduction to SQL",
    issuer: "Sololearn",
    date: "2025",
    // Sololearn's /certificates/<code> page doesn't show the holder's name —
    // this is the certificate image itself, served by Sololearn.
    url: "https://api2.sololearn.com/v2/certificates/CC-NECXN0PJ/image/png?t=638746407215266290",
  },
  {
    name: "Agile Project Management",
    issuer: "HP LIFE",
    date: "2025",
    url: "https://www.life-global.org/certificate/5e7e6d94-3878-431d-961b-020e7e3b138d",
  },
  {
    name: "Introduction to Cybersecurity Awareness",
    issuer: "HP LIFE",
    date: "2025",
    url: "https://www.life-global.org/certificate/df4d5f6f-58a4-42cd-aaf6-3b2046409ea2",
  },
  {
    name: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "2025",
    url: "https://www.credly.com/badges/acdf48c1-3a3a-4c57-9443-55fcdec1aca2/public_url",
  },
  {
    name: "Artificial Intelligence for Beginners",
    issuer: "HP LIFE",
    date: "2025",
    url: "https://www.life-global.org/certificate/44c305d0-5099-4a18-96b7-1d8450e2129f",
  },
  {
    name: "Introduction to Front-End Development",
    issuer: "Meta · Coursera · NITDA",
    date: "2024",
    url: "https://www.coursera.org/account/accomplishments/verify/U2RR5L78JD2Q",
  },
  {
    name: "Bootstrap for Beginners",
    issuer: "YouAccel Training",
    date: "2023",
    url: "https://youaccel.com/admin/certificate_gen/tcpdf/ya/certificate_ya2.php?certid=82834550",
  },
  {
    name: "Responsive Web Design",
    issuer: "freeCodeCamp",
    date: "2022",
    url: "https://www.freecodecamp.org/certification/OMOREGIE_ARMSTRONG/responsive-web-design",
  },
];
