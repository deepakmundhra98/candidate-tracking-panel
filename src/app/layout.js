import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientWrapper from "./QueryClientWrapper";
import Domain from "./Domain/Domain";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Best Applicant Tracking System & ATS Software for Recruiters",
  description:
    "Simplify hiring with the best ATS software. Get top applicant tracking software with optional payroll and attendance integrations for complete HR efficiency.",
  keywords:
    "applicant tracking system, ats software, applicant tracking software, best applicant tracking software, applicant tracking software for recruiters, ats tracking system, applicant tracking software for small business, ats applicant tracking systems, application tracking systems, applicant tracking systems, ats applicant tracking system, applicant tracking system software, job application tracker, job application softwares, job application software.",
  icons: {
    icon: ["/Images/favicon.ico"],
    sizes: "192x192",
    type: "image/png",
  },
  alternates: {
    canonical: Domain,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ATSWAY HR Software",
    alternateName:
      "Best Applicant Tracking System & ATS Software for Recruiters",
    description:
      "Simplify hiring with the best ATS software. Get top applicant tracking software with optional payroll and attendance integrations for complete HR efficiency.",
    url: "https://atsway.com/",
    logo: "https://atsway.com/Images/logo/Pasted%20image.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+919829559922",
      contactType: "technical support",
      areaServed: "IN",
      availableLanguage: "en",
    },
    sameAs: [
      "https://x.com/atswaysolutions",
      "https://www.instagram.com/atswayhrsoftware/",
      "https://www.linkedin.com/company/atsway-hr-software/",
      "https://pinterest.com/atswayhrsoftware/",
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ATSWAY - Applicant Tracking System Software",
    operatingSystem: "Web-based",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "45",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: "https://atsway.com/pricing",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "120",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an ATS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An ATS (Applicant Tracking System) is a tool that helps organize the hiring process. It automatically collects, sorts, and manages job applications.",
        },
      },
      {
        "@type": "Question",
        name: "What are the best ATS systems for small businesses?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ATSWAY is a good choice because it has simple features, is cost-effective, and offers great support.",
        },
      },
      {
        "@type": "Question",
        name: "What are the main benefits of using an ATS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Using an ATS helps speed up the hiring process by automating resume sorting and keeping candidate information organized.",
        },
      },
      {
        "@type": "Question",
        name: "How do applicant tracking systems work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The ATS scans resumes to extract details like experience and skills, stores the data, and helps manage communication and workflow.",
        },
      },
      {
        "@type": "Question",
        name: "What other features does an ATS have?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Features include resume parsing, application management, workflow tracking, analytics, reporting, and automation.",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>

      <body className={inter.className}>
        <QueryClientWrapper>{children}</QueryClientWrapper>
      </body>
    </html>
  );
}
