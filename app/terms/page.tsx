import type { Metadata } from "next"
import TermsClientPage from "./TermsClientPage"

export const metadata: Metadata = {
  title: "Terms of Service | Squaredrum",
  description:
    "Terms of Service for Squaredrum.com - Read our terms and conditions for using our website and services.",
}

export default function TermsPage() {
  return <TermsClientPage />
}
