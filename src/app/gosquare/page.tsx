import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/sections";

export const metadata: Metadata = {
  title: "GoSquare Support",
  description: "Help with GoSquare, the music app from SQUAREDRUM: sign-in, your library, playback and deleting your account.",
};

// The App Store's Support URL for GoSquare Music.
export default function Page() {
  return (
    <main>
      <PageHead eyebrow="GoSquare" title="Support" />
      <section className="sec wrap">
        <div className="prose">
          <p>GoSquare is the free music app from SQUAREDRUM: every song from our labels, live radio channels, lyrics and Canvas loops.</p>
          <h2>Signing in</h2>
          <p>You don&apos;t need an account to listen. To save likes and playlists, open Library, enter your email and type in the 6-digit code we send you. No code? Check your spam folder, wait a minute and ask for a new one.</p>
          <h2>Music stops or won&apos;t play</h2>
          <p>Check your connection, then close GoSquare fully and open it again. GoSquare keeps playing when you lock your phone or switch apps; if it doesn&apos;t, tell us your iPhone model and iOS version.</p>
          <h2>Deleting your account</h2>
          <p>In the app, go to Library → Delete account. This permanently removes your email, likes and playlists. See the <Link href="/gosquare/privacy">GoSquare Privacy Policy</Link> for details.</p>
          <h2>Contact us</h2>
          <p>Email <a href="mailto:info@squaredrum.com">info@squaredrum.com</a> and we&apos;ll get back to you within two business days.</p>
        </div>
      </section>
    </main>
  );
}
