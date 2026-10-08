import type { Block } from "@/lib/legal";

export function Legal({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose">
      {blocks.map((b, i) =>
        b[0] === "ul" ? (
          <ul key={i}>
            {b[1].map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
        ) : b[0] === "h2" ? (
          <h2 key={i}>{b[1]}</h2>
        ) : b[0] === "h3" ? (
          <h3 key={i}>{b[1]}</h3>
        ) : (
          <p key={i}>{b[1]}</p>
        ),
      )}
    </div>
  );
}
