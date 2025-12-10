import Domain from "@/app/Domain/Domain";
import "../../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Contact Atsway | Get in Touch for ATS Solutions & Support",
  description:
    "Have questions about our ATS software? Contact Atsway for expert support, demo requests, and recruitment solutions. We're here to make your hiring process easier!",
  keywords:
    "applicant tracking system, ats software, applicant tracking software, best applicant tracking software, applicant tracking software for recruiters, HR Management Software",

  alternates: {
    canonical: Domain + "/contact-us",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
