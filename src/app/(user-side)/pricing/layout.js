import Domain from "@/app/Domain/Domain";
import "../../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ATS Software Pricing | Best Plan for Your Hiring Needs",
  description:
    "Find the right ATS software plan for your business. Atsway offers affordable, scalable applicant tracking solutions to simplify your hiring process.",
  keywords:
    "applicant tracking system, ats software, applicant tracking software, ATS plan, best applicant tracking software, applicant tracking software for recruiters",

  alternates: {
    canonical: Domain + "/pricing",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
