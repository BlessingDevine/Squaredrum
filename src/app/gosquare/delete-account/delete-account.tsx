"use client";

import { useState } from "react";
import { useAccount } from "@/components/account";
import { supabase } from "@/lib/supabase-browser";

/** Sign in, then delete the account in two clicks (the same delete_my_account function the app uses). */
export function DeleteAccount() {
  const { signedIn, email, askSignIn, signOut } = useAccount();
  const [confirming, setConfirming] = useState(false);
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");

  if (state === "done") return <p>Your GoSquare account has been deleted.</p>;
  if (!signedIn)
    return (
      <p>
        <button type="button" className="btn btn-ink" onClick={() => askSignIn("Sign in to delete your GoSquare account.")}>
          Sign in to delete your account
        </button>
      </p>
    );

  const remove = async () => {
    setState("working");
    const { error } = await supabase.rpc("delete_my_account");
    if (error) return setState("error");
    await signOut().catch(() => {});
    setState("done");
  };

  return (
    <>
      <p>
        Signed in as <b>{email}</b>.
      </p>
      {!confirming ? (
        <p>
          <button type="button" className="btn btn-ink" onClick={() => setConfirming(true)}>
            Delete my account
          </button>
        </p>
      ) : (
        <p>
          This can&apos;t be undone. Your likes, playlists, follows and download record go with it.{" "}
          <button type="button" className="btn btn-ink" disabled={state === "working"} onClick={remove}>
            {state === "working" ? "Deleting…" : "Yes, delete it"}
          </button>{" "}
          <button type="button" className="acct-link" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </p>
      )}
      {state === "error" && <p>Something went wrong and nothing was deleted. Try again, or email privacy@squaredrum.com.</p>}
    </>
  );
}
