import type { Metadata } from "next";
import { PageHead } from "@/components/sections";
import { DeleteAccount } from "./delete-account";

export const metadata: Metadata = {
  title: "Delete your GoSquare account",
  description: "How to delete your GoSquare account and everything linked to it.",
};

// Linked from Google Play's Data safety form ("a link users can use to request that their account and
// associated data is deleted"). Three ways: in the app, right here, or by email.
export default function Page() {
  return (
    <main>
      <PageHead eyebrow="GoSquare" title="Delete your account" />
      <section className="sec wrap">
        <div className="prose">
          <p>
            Your GoSquare account is the one you use in the GoSquare Music app and on squaredrum.com. Deleting it permanently removes, from
            our systems:
          </p>
          <ul>
            <li>your email address and sign-in</li>
            <li>your liked songs and your playlists</li>
            <li>the artists you follow</li>
            <li>your record of free downloads from squaredrum.com</li>
          </ul>
          <p>Nothing is kept afterwards, apart from routine backups that are overwritten within 30 days. Songs you have already downloaded stay on your device.</p>

          <h2>1. In the app</h2>
          <p>Open GoSquare Music, go to the Library tab, scroll down and tap Delete account.</p>

          <h2>2. Here</h2>
          <DeleteAccount />

          <h2>3. By email</h2>
          <p>
            Email privacy@squaredrum.com from the address you sign in with, asking us to delete your GoSquare account. We delete it within 30
            days and confirm by email.
          </p>
          <p>SQUAREDRUM LLC · privacy@squaredrum.com</p>
        </div>
      </section>
    </main>
  );
}
