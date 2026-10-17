import type { Metadata } from "next";
import { AccountPage } from "./account-page";

export const metadata: Metadata = {
  title: "Your account",
  description: "Your GoSquare account on squaredrum.com: liked songs, playlists and the artists you follow.",
  robots: { index: false },
};

export default function Page() {
  return <AccountPage />;
}
