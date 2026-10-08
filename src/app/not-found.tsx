import Link from "next/link";
import { PageHead } from "@/components/sections";

export default function NotFound() {
  return (
    <main>
      <PageHead eyebrow="404" title="Off the record." lede="That page isn't here — it may have moved when the site was rebuilt.">
        <Link className="btn btn-ink" href="/">
          Home
        </Link>
        <Link className="chip" href="/artists">
          Artists
        </Link>
        <Link className="chip" href="/releases">
          Releases
        </Link>
      </PageHead>
    </main>
  );
}
