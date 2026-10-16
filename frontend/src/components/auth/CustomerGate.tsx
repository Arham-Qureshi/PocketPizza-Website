"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCustomerSession } from "@/lib/api/customerAuth";

/**
 * Route guard for account pages: while the session resolves show a neutral
 * skeleton; when it settles logged-out, bounce to login with a `redirectTo`
 * back to where the visitor was headed (getDestination validates it).
 */
export function CustomerGate({
  returnTo,
  children,
}: {
  returnTo: string;
  children: React.ReactNode;
}) {
  const session = useCustomerSession();
  const router = useRouter();
  const loaded = session.isFetched || session.isError;
  const loggedIn = session.data?.loggedIn === true;

  useEffect(() => {
    if (!loaded || loggedIn) return;
    router.replace(`/login?redirectTo=${encodeURIComponent(returnTo)}`);
  }, [loaded, loggedIn, returnTo, router]);

  if (!loaded || !loggedIn) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6" aria-busy="true">
        <div className="h-8 w-40 animate-pulse rounded-sm bg-neutralTint" />
        <div className="mt-6 space-y-4">
          <div className="h-28 animate-pulse rounded-md bg-neutralTint" />
          <div className="h-40 animate-pulse rounded-md bg-neutralTint" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
