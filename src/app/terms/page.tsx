import type { Metadata } from "next";
import { Legal } from "@/components/legal";
import { PageHead } from "@/components/sections";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms of Service" };

export default function Page() {
  return (
    <main>
      <PageHead eyebrow="Legal" title="Terms of Service" />
      <section className="sec wrap">
        <Legal blocks={TERMS} />
      </section>
    </main>
  );
}
