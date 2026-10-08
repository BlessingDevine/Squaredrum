import type { Metadata } from "next";
import { Legal } from "@/components/legal";
import { PageHead } from "@/components/sections";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <main>
      <PageHead eyebrow="Legal" title="Privacy Policy" />
      <section className="sec wrap">
        <Legal blocks={PRIVACY} />
      </section>
    </main>
  );
}
