import { cacheLife } from "next/cache";

/**
 * The current year for the footer. Reading the clock is cached so the page
 * can still be prerendered; the value refreshes on its own once a day.
 */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");

  return <>{new Date().getFullYear()}</>;
}
