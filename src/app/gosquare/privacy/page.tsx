import type { Metadata } from "next";
import { Legal } from "@/components/legal";
import { PageHead } from "@/components/sections";
import { GOSQUARE_PRIVACY } from "@/lib/legal";

export const metadata: Metadata = { title: "GoSquare Privacy Policy" };

export default function Page() {
  return (
    <main>
      <PageHead eyebrow="GoSquare" title="Privacy Policy" />
      <section className="sec wrap">
        <Legal blocks={GOSQUARE_PRIVACY} />
      </section>
    </main>
  );
}
