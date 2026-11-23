import { useEffect, useMemo, useState } from "react";

import type { SponsorsFeed } from "./feed";
import { isSponsorsFeed, selectSponsors, SPONSORS_FEED_URL } from "./feed";
import snapshot from "./sponsors.snapshot.json";

/*
 * Storybook has no build step to read the feed in, so the snapshot in the repo renders first and the CDN's copy
 * replaces it as soon as it arrives.
 */
if (!isSponsorsFeed(snapshot))
  throw new Error("sponsors.snapshot.json is not a v1 sponsors feed");
const initial: SponsorsFeed = snapshot;

/* One request per visit, shared by every component that shows sponsors. */
let latest: Promise<SponsorsFeed | null> | null = null;

const loadLatest = () => {
  // The CDN tells browsers to keep the file for a week; revalidating costs a 304 and shows a new partner at once.
  latest ??= fetch(SPONSORS_FEED_URL, { cache: "no-cache" })
    .then((response) => (response.ok ? response.json() : null))
    .then((body: unknown) => (isSponsorsFeed(body) ? body : null))
    .catch(() => null);
  return latest;
};

/** The feed as it arrives: the snapshot first, then the CDN's copy when it is newer. */
export const useSponsorsFeed = () => {
  const [feed, setFeed] = useState(initial);

  useEffect(() => {
    let alive = true;
    loadLatest().then((fresh) => {
      if (alive && fresh && fresh.generatedAt > initial.generatedAt)
        setFeed(fresh);
    });
    return () => {
      alive = false;
    };
  }, []);

  return feed;
};

/** The partners and sponsors this site shows. */
export const useSponsors = () => {
  const feed = useSponsorsFeed();
  return useMemo(() => ({ feed, ...selectSponsors(feed) }), [feed]);
};
