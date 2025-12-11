import Domain from "@/app/Domain/Domain";
import "../../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "All-in-One HRMS Solution | HR Automation, Payroll & Time Tracking",
  description:
    "Manage payroll, attendance, and workforce operations in one HRMS! ATSWAY’s HR management software automates HR workflows for maximum efficiency. Contact today.",
  keywords:
    "HRMS Software, Best HRMS Software, HR Management Software, HRMS Solution, HRMS Solutions, applicant tracking system, applicant tracking software",

  alternates: {
    canonical: Domain + "/hrms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
