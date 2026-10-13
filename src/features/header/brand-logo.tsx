/** The app icon's calendar mark, drawn in the active color scheme */
const BrandLogo = () => (
    <svg className="brand-logo" viewBox="0 0 32 32" aria-hidden="true">
        <rect className="brand-logo__body" x="2" y="4" width="28" height="26" rx="6" />
        <rect className="brand-logo__ring" x="8" y="1" width="2.6" height="6" rx="1.3" />
        <rect className="brand-logo__ring" x="21.4" y="1" width="2.6" height="6" rx="1.3" />
        <line className="brand-logo__rule" x1="2" y1="12" x2="30" y2="12" />
        <text className="brand-logo__letter" x="16" y="26" textAnchor="middle">
            A
        </text>
    </svg>
);

export { BrandLogo };
