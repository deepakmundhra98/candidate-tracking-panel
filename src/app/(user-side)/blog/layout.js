import Domain from "@/app/Domain/Domain";

export const metadata = {
  title: "ATS & Recruitment Insights Blog | Latest Hiring Trends & Tips",
  description:
    "Stay ahead in recruitment with expert insights on ATS software, hiring trends, and recruiter tips. Explore best practices to streamline your hiring process today!",
  keywords:
    "applicant tracking system, ats software, applicant tracking software, best applicant tracking software, applicant tracking software for recruiters",
  alternates: {
    canonical: Domain+"/blog",
  },
  openGraph: {
    title: "ATS & Recruitment Insights Blog | Latest Hiring Trends & Tips",
    description:
      "Stay ahead in recruitment with expert insights on ATS software, hiring trends, and recruiter tips.",
    url: Domain+"/blog",
    type: "website",
    images: [
      {
        url: "https://atsway.com/Images/logo/Pasted%20image.png",
        width: 1200,
        height: 630,
        alt: "ATSWAY Blog",
      },
    ],
  },
};

export default function BlogLayout({ children }) {
  return <>{children}</>;
}
