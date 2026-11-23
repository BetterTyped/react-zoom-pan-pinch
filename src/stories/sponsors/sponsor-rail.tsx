/* eslint-disable react/require-default-props -- optional props take their defaults in the parameter list */
import React from "react";

import type { FeedPartner, FeedSponsor } from "./feed";
import { SPONSORS_SITE_NAME, withReferral } from "./feed";
import { useSponsors } from "./use-sponsors";

import "./sponsors.css";

/*
 * The partners and sponsors in the right column of every docs page, under "On this page". Featured partners get a
 * card with their tagline, gold and silver a logo tile, a free platinum slot an invitation, and sponsors a row of
 * avatars. Everything comes from the shared sponsors feed, so a new partner shows up without a docs change.
 */

export const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const PlusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/** The partner's logo, or their initial when the image does not load. */
export const PartnerLogo = ({
  partner,
  size,
  className,
}: {
  partner: FeedPartner;
  size: number;
  className?: string;
}) => {
  const [failed, setFailed] = React.useState(false);
  if (failed) {
    return (
      <span className="bt-sp-initial" aria-hidden="true">
        {partner.name.charAt(0)}
      </span>
    );
  }
  return (
    <img
      src={partner.logo}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

/** Two rows of logo tiles fit the column without pushing the table of contents off a laptop screen. */
const RAIL_TILES = 4;

const accentStyle = (partner: FeedPartner) =>
  (partner.accent
    ? { "--bt-sp-accent": partner.accent }
    : {}) as React.CSSProperties;

const PartnerCard = ({ partner }: { partner: FeedPartner }) => (
  <a
    className="bt-sp-card"
    href={withReferral(partner.url, "docs-rail")}
    target="_blank"
    rel="noopener noreferrer"
    style={accentStyle(partner)}
    data-tier={partner.tier}
  >
    <span className="bt-sp-logo">
      <PartnerLogo partner={partner} size={40} />
    </span>
    <span className="bt-sp-copy">
      <strong>{partner.name}</strong>
      <span>{partner.tagline}</span>
    </span>
    <span className="bt-sp-go">
      <ArrowIcon />
    </span>
  </a>
);

const PartnerTile = ({ partner }: { partner: FeedPartner }) => (
  <a
    className="bt-sp-tile"
    href={withReferral(partner.url, "docs-rail")}
    target="_blank"
    rel="noopener noreferrer"
    title={`${partner.name} - ${partner.tagline}`}
    style={accentStyle(partner)}
  >
    <PartnerLogo partner={partner} size={20} />
    <span>{partner.name}</span>
  </a>
);

const OpenSlot = ({ href }: { href: string }) => (
  <a
    className="bt-sp-slot"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="bt-sp-slot-plus">
      <PlusIcon />
    </span>
    <span className="bt-sp-copy">
      <strong>Your logo here</strong>
      <span>Shown on every {SPONSORS_SITE_NAME} docs page</span>
    </span>
  </a>
);

/** Organisations that held a top tier get their name next to the avatar. Everyone else is a face in the row. */
const isHighlighted = (sponsor: FeedSponsor) =>
  sponsor.kind === "organization" &&
  (sponsor.tier === "platinum" || sponsor.tier === "gold");

export const Backers = ({
  backers,
  privateCount,
  max = 8,
}: {
  backers: FeedSponsor[];
  privateCount: number;
  max?: number;
}) => {
  const named = backers.filter(isHighlighted);
  const faces = backers.filter((sponsor) => !isHighlighted(sponsor));
  const shown = faces.slice(0, max);
  const more = faces.length - shown.length + privateCount;

  return (
    <div className="bt-sp-backers">
      {named.map((sponsor) => (
        <a
          key={sponsor.login}
          className="bt-sp-named"
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          title={sponsor.name}
        >
          <img
            src={sponsor.avatarUrl}
            alt=""
            width={22}
            height={22}
            loading="lazy"
          />
          <span>{sponsor.name}</span>
        </a>
      ))}
      {(shown.length > 0 || more > 0) && (
        <div className="bt-sp-faces">
          {shown.map((sponsor) => (
            <a
              key={sponsor.login}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              title={sponsor.name}
              aria-label={sponsor.name}
            >
              <img
                src={sponsor.avatarUrl}
                alt=""
                width={28}
                height={28}
                loading="lazy"
              />
            </a>
          ))}
          {more > 0 && (
            <span
              className="bt-sp-more"
              title={`${more} more, some of them private`}
            >
              +{more}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const SponsorRail = ({
  variant = "rail",
  theme,
}: {
  /** `rail` stacks everything for a narrow column, `wide` lays the partners out side by side. */
  variant?: "rail" | "wide";
  /** Forces a colour scheme where the page does not set `data-theme` on `html`. */
  theme?: "light" | "dark";
}) => {
  const {
    feed,
    featured,
    tiles,
    openSlot,
    backers,
    backersArePast,
    privateCount,
  } = useSponsors();

  return (
    <section
      className="bt-sp-rail"
      data-variant={variant}
      data-bt-sp-theme={theme}
      aria-label="Partners and sponsors"
    >
      <div className="bt-sp-head">
        <span>Partners</span>
        <a href={feed.links.partner} target="_blank" rel="noopener noreferrer">
          Become one
        </a>
      </div>
      <div className="bt-sp-stack">
        {featured.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
        {tiles.length > 0 && (
          <div className="bt-sp-tiles">
            {tiles
              .slice(0, variant === "rail" ? RAIL_TILES : undefined)
              .map((partner) => (
                <PartnerTile key={partner.id} partner={partner} />
              ))}
          </div>
        )}
        {openSlot && <OpenSlot href={feed.links.partner} />}
      </div>

      {(backers.length > 0 || privateCount > 0) && (
        <>
          <div className="bt-sp-head">
            <span>{backersArePast ? "Past sponsors" : "Sponsors"}</span>
            <a
              href={feed.links.sponsor}
              target="_blank"
              rel="noopener noreferrer"
            >
              Sponsor
            </a>
          </div>
          <Backers backers={backers} privateCount={privateCount} max={6} />
        </>
      )}
    </section>
  );
};
