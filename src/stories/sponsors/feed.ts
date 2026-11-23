/*
 * The sponsors feed every BetterTyped docs site reads: partners from partners.json and sponsors from GitHub Sponsors,
 * built in github.com/prc5/sponsors and served by jsDelivr with a long cache. This file has no React or Docusaurus in
 * it, so the build plugin and the components share it, and other docs sites can copy it as it is.
 */

export const SPONSORS_FEED_URL =
  "https://cdn.jsdelivr.net/gh/prc5/sponsors@main/feed/v1/sponsors.json";

/** The id partners.json uses for this site in a partner's `projects` list. */
export const SPONSORS_PROJECT = "react-zoom-pan-pinch";

/** The product this site documents, as the cards name it. */
export const SPONSORS_SITE_NAME = "React Zoom Pan Pinch";

export type PartnerTier = "platinum" | "gold" | "silver" | "house";

export type SponsorTier =
  | "platinum"
  | "gold"
  | "silver"
  | "backer"
  | "supporter"
  | "fan"
  | "donor";

export type FeedPartner = {
  id: string;
  name: string;
  tagline: string;
  url: string;
  logo: string;
  tier: PartnerTier;
  accent: string | null;
  projects: "all" | string[];
};

export type FeedSponsor = {
  login: string;
  name: string;
  kind: "user" | "organization";
  avatarUrl: string;
  url: string;
  github: string;
  /** Past sponsors keep a tier only when the feed remembers the one they held. */
  tier: SponsorTier | null;
};

export type SponsorsFeed = {
  version: 1;
  generatedAt: string;
  links: { sponsor: string; partner: string };
  partners: FeedPartner[];
  sponsors: FeedSponsor[];
  pastSponsors: FeedSponsor[];
  privateSponsors: { active: number; past: number };
};

/** Where a link sits, so referral traffic can be told apart per placement. */
export type Placement = "docs-rail" | "landing" | "storybook-sidebar";

/** True for a feed this code can render. Anything else falls back to the snapshot shipped with the site. */
export const isSponsorsFeed = (value: unknown): value is SponsorsFeed => {
  if (!value || typeof value !== "object") return false;
  const feed = value as Partial<SponsorsFeed>;
  return (
    feed.version === 1 &&
    Array.isArray(feed.partners) &&
    Array.isArray(feed.sponsors) &&
    Array.isArray(feed.pastSponsors) &&
    typeof feed.links?.sponsor === "string"
  );
};

/** Adds the referral params to a partner link, keeping any the partner set themselves. */
export const withReferral = (href: string, placement: Placement) => {
  try {
    const url = new URL(href);
    const params: Record<string, string> = {
      ref: SPONSORS_PROJECT,
      utm_source: SPONSORS_PROJECT,
      utm_medium: "referral",
      utm_campaign: placement,
    };
    Object.entries(params).forEach(([key, value]) => {
      if (!url.searchParams.has(key)) url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    return href;
  }
};

export type SponsorsView = {
  /** Platinum partners, or the house partner while no one holds a platinum slot. */
  featured: FeedPartner[];
  /** Gold and silver partners, shown as logo tiles. */
  tiles: FeedPartner[];
  /** Whether a platinum slot is still free to sell. */
  openSlot: boolean;
  /** Active sponsors when there are any, else the past ones, highest tier first. */
  backers: FeedSponsor[];
  backersArePast: boolean;
  privateCount: number;
};

const PLATINUM_SLOTS = 2;

/** Picks what this site shows from the feed. */
export const selectSponsors = (feed: SponsorsFeed): SponsorsView => {
  const partners = feed.partners.filter(
    (partner) =>
      partner.projects === "all" || partner.projects.includes(SPONSORS_PROJECT),
  );
  const platinum = partners.filter((partner) => partner.tier === "platinum");
  const house = partners.filter((partner) => partner.tier === "house");
  const backersArePast = feed.sponsors.length === 0;

  return {
    featured: platinum.length
      ? platinum.slice(0, PLATINUM_SLOTS)
      : house.slice(0, 1),
    tiles: partners.filter(
      (partner) => partner.tier === "gold" || partner.tier === "silver",
    ),
    openSlot: platinum.length < PLATINUM_SLOTS,
    backers: backersArePast ? feed.pastSponsors : feed.sponsors,
    backersArePast,
    privateCount: backersArePast
      ? feed.privateSponsors.past
      : feed.privateSponsors.active,
  };
};
