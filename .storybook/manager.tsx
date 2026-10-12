import React, { useEffect, useState } from "react";
import { addons, types } from "@storybook/manager-api";
import { useTheme } from "@storybook/theming";

/*
 * The card at the bottom of the sidebar that sends a reader on to Hype Stack, the full stack template made by the
 * same people. Its picture is three apps built on Hype Stack. Under it: a small lit label, a headline that ends
 * on the name in its colour, the price, and a button the full width of the card.
 */

const LINK =
  "https://www.hype-stack.dev/?ref=react-zoom-pan-pinch&utm_source=react-zoom-pan-pinch&utm_medium=referral&utm_campaign=storybook-sidebar";

const CSS = `
.hs-ad {
  --hs: oklch(0.68 0.2 50);
  --hs-bg: #ffffff;
  --hs-ink: #0a0a0a;
  --hs-dim: #5e5e66;
  --hs-line: rgb(0 0 0 / 0.14);
  display: grid;
  padding: 8px 8px 14px;
  border: 1px solid var(--hs-line);
  border-radius: 18px;
  background: var(--hs-bg);
  box-shadow: 0 26px 60px -34px color-mix(in oklch, var(--hs) 75%, transparent);
  color: var(--hs-ink);
  line-height: 1.4;
  text-align: left;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.hs-ad[data-base="dark"] {
  --hs-bg: #0d0d10;
  --hs-ink: #ffffff;
  --hs-dim: #a3a3ad;
  --hs-line: rgb(255 255 255 / 0.14);
}
.hs-ad:hover {
  border-color: color-mix(in oklch, var(--hs) 60%, var(--hs-line));
  box-shadow: 0 30px 64px -30px color-mix(in oklch, var(--hs) 90%, transparent);
  transform: translateY(-2px);
}
.hs-ad > :not(.hs-ad-art) { margin-inline: 10px; }
.hs-ad-art {
  position: relative;
  display: block;
  aspect-ratio: 9 / 5;
  margin-bottom: 14px;
  overflow: hidden;
  border-radius: 11px;
  background: #0a0c13;
}
.hs-ad-art::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.1);
}
.hs-ad-art img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.hs-ad:hover .hs-ad-art img { transform: scale(1.07); }
.hs-ad-label {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--hs);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hs-ad-label svg { flex: none; width: 13px; height: 13px; fill: var(--hs); stroke: none; }
.hs-ad strong {
  margin-top: 8px;
  color: var(--hs-ink);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
}
.hs-ad strong b { display: block; color: var(--hs); font-weight: inherit; }
.hs-ad-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 12px;
  color: var(--hs-dim);
  font-size: 13px;
}
.hs-ad-price b { color: var(--hs-ink); font-size: 22px; font-weight: 700; letter-spacing: -0.03em; }
.hs-ad-go {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  margin-top: 10px;
  border-radius: 10px;
  background: linear-gradient(180deg, color-mix(in oklch, var(--hs) 88%, #fff), var(--hs));
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.28), 0 10px 22px -10px var(--hs);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 1px 0 rgb(0 0 0 / 0.14);
  transition: filter 0.2s;
}
.hs-ad:hover .hs-ad-go { filter: brightness(1.07); }
.hs-ad-go svg {
  flex: none;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s;
}
.hs-ad:hover .hs-ad-go svg { transform: translateX(3px); }
.hs-ad-box { position: relative; margin-top: 12px; }
.hs-ad-box .hs-ad { margin-top: 0; }
.hs-ad-close {
  position: absolute;
  top: -8px;
  right: -4px;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: #0a0a0a;
  box-shadow: 0 0 0 1px rgb(255 255 255 / 0.2);
  color: #fff;
  cursor: pointer;
}
.hs-ad-close svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2.6; stroke-linecap: round; }
/* Shrunk: the label, the headline and an orange arrow to go there. The cross turns the card into this. */
.hs-ad[data-small] {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 2px 10px;
  padding: 9px 9px 9px 4px;
  border-radius: 14px;
}
.hs-ad[data-small] .hs-ad-art,
.hs-ad[data-small] .hs-ad-price { display: none; }
.hs-ad[data-small] .hs-ad-label { font-size: 10px; letter-spacing: 0.06em; white-space: nowrap; }
.hs-ad[data-small] strong { grid-column: 1; margin-top: 0; font-size: 14px; }
.hs-ad[data-small] strong b { display: inline; }
.hs-ad[data-small] .hs-ad-go { grid-column: 2; grid-row: 1 / span 2; width: 40px; height: 40px; margin: 0; }
.hs-ad[data-small] .hs-ad-go span { display: none; }
.hs-ad[data-small] .hs-ad-go svg { width: 17px; height: 17px; }
@media (max-height: 760px) {
  .hs-ad:not([data-small]) .hs-ad-art { display: none; }
  .hs-ad:not([data-small]) { padding-top: 14px; }
}
`;

/** Shrunk for this visit: the card stays small until the tab is closed, and comes back whole the next time. */
const SMALL = "react-zoom-pan-pinch:storybook:hype-card";

function wasShrunk() {
  try {
    return window.sessionStorage.getItem(SMALL) !== null;
  } catch {
    // Blocked storage: the card shows whole.
    return false;
  }
}

function HypeStackCard() {
  const theme = useTheme();
  const [small, setSmall] = useState(wasShrunk);
  useEffect(() => {
    if (!small) return;
    try {
      window.sessionStorage.setItem(SMALL, "1");
    } catch {
      // Blocked storage: small for this page only.
    }
  }, [small]);
  return (
    <div className="hs-ad-box">
      <style>{CSS}</style>
      <a
        className="hs-ad"
        data-base={theme.base}
        data-small={small ? "" : undefined}
        href={LINK}
        target="_blank"
        rel="noopener"
        aria-label="Build your SaaS on Hype Stack"
      >
        <span className="hs-ad-art" aria-hidden>
          <img src="./hype-stack-apps.jpg" alt="" width={720} height={400} />
        </span>
        <span className="hs-ad-label">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
          </svg>
          From Hype Stack
        </span>
        <strong>
          Build your SaaS on <b>Hype Stack</b>
        </strong>
        <span className="hs-ad-price">
          <b>Free</b> MIT template
        </span>
        <span className="hs-ad-go">
          <span>Explore the stack</span>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </a>
      {small ? null : (
        <button
          type="button"
          className="hs-ad-close"
          onClick={() => setSmall(true)}
          aria-label="Shrink the Hype Stack card"
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}

addons.register("hype-stack/card", () => {
  addons.add("hype-stack/card/sidebar", {
    type: types.experimental_SIDEBAR_BOTTOM,
    render: () => <HypeStackCard />,
  });
});
