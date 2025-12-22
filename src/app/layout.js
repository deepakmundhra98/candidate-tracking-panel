import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientWrapper from "./QueryClientWrapper";
import Domain from "@/app/BaseAPI/Domain";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Best Applicant Tracking System and ATS Software for Candidates",
  description:
    "Simplify your job search with ATS software. Create standout profiles, track applications, get interview updates, and plan your career - all in one easy platform.",
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
    description:
      "Simplify hiring with the best ATS software. Get top applicant tracking software with optional payroll and attendance integrations for complete HR efficiency.",
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
          text: "An ATS (Applicant Tracking System) is a tool that helps organize the hiring process. It automatically collects, sorts, and manages job applications. It makes it easier for hiring teams to keep track of candidates, communicate with them, and find the best fit for the job.",
        },
      },
      {
        "@type": "Question",
        name: "What are the best ATS systems for small businesses?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best ATS for small businesses should be easy to use, affordable, and able to grow with your company. ATSWAY is a good choice because it has simple features, is cost-effective, and offers great support. It helps small businesses save time while keeping things organized as they hire.",
        },
      },
      {
        "@type": "Question",
        name: "What are the main benefits of using an ATS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Using an ATS helps speed up the hiring process. It automatically sorts resumes, making it quicker to find the right candidates. It also keeps all candidate information in one place, making it easier for the hiring team to work together.",
        },
      },
      {
        "@type": "Question",
        name: "How do applicant tracking systems work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "When a candidate applies for a job, the ATS scans their resume to get important details like their contact info, work experience, and skills. This information is stored in a system where the hiring team can easily find and review it. The ATS also helps communicate with applicants and keeps track of where they are in the hiring process.",
        },
      },
      {
        "@type": "Question",
        name: "What other features does an ATS have?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An ATS has many useful features to help with hiring:Resume Parsing and Candidate Database: It reads resumes and stores candidate details for future use.Job Posting and Application Management: Post jobs on different platforms and track applicants in one place. Workflow and Pipeline Management: See where each candidate is in the hiring process and adjust workflows as needed. Analytics and Reporting: Get simple reports on things like how long it takes to hire and how candidates feel about the process. Integration and Automation: It works with other tools like payroll or onboarding and can automate tasks like sending emails or scheduling interviews.",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
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
        <Providers>
          <QueryClientWrapper>{children}</QueryClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
