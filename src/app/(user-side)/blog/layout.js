import Domain from "@/app/Domain/Domain";

export const metadata = {
  title: "ATS & Recruitment Insights Blog | Latest Hiring Trends & Tips",
  description:
    "Stay ahead in recruitment with expert insights on ATS software, hiring trends, and recruiter tips. Explore best practices to streamline your hiring process today!",
  keywords:
    "applicant tracking system, ats software, applicant tracking software, best applicant tracking software, applicant tracking software for recruiters",
  alternates: {
    canonical: Domain + "/blog",
  },
  openGraph: {
    title: "ATS & Recruitment Insights Blog | Latest Hiring Trends & Tips",
    description:
      "Stay ahead in recruitment with expert insights on ATS software, hiring trends, and recruiter tips.",
    url: Domain + "/blog",
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
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({ children }) {
  return (
    <>
      {/* JSON-LD SCHEMA ADDED HERE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "ATS & Recruitment Insights Blog | Latest Hiring Trends & Tips",
            description:
              "Stay ahead in recruitment with expert insights on ATS software, hiring trends, and recruiter tips. Explore best practices to streamline your hiring process today!",
            url: "https://atsway.com/blog",
            author: {
              "@type": "Organization",
              name: "ATSWAY",
              url: "https://atsway.com/",
            },
            publisher: {
              "@type": "Organization",
              name: "ATSWAY",
              logo: {
                "@type": "ImageObject",
                url: "https://atsway.com/_next/image?url=%2FImages%2Flogo%2FPasted%20image.png&w=256&q=75",
              },
            },
            datePublished: "2025-11-18",
            dateModified: "2025-12-11",
          }),
        }}
      />

      {children}
    </>
  );
}
