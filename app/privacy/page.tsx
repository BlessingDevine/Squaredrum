import type { Metadata } from "next"
import PrivacyClientPage from "./PrivacyClientPage"

export const metadata: Metadata = {
  title: "Privacy Policy | Squaredrum",
  description: "Privacy Policy for Squaredrum.com - Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return <PrivacyClientPage />
}
