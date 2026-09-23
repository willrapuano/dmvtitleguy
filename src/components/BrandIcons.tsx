/* Brand glyphs for the social links.
 *
 * lucide-react removed every brand/logo icon in v1 for trademark reasons, so
 * `Facebook`, `Instagram`, `Linkedin` and `Youtube` no longer exist in the
 * package and the Dependabot bump to 1.x fails typecheck on this import. These
 * are plain inline SVGs with the same call signature the footer already uses
 * (`<Icon className="w-5 h-5" />`), so they work on either lucide version and
 * remove this file from the upgrade's path entirely.
 *
 * `currentColor` and no explicit size, so the caller's className keeps control.
 */

type BrandIconProps = {
  className?: string;
};

function iconProps(className?: string) {
  return {
    "aria-hidden": true as const,
    className,
    fill: "currentColor",
    focusable: "false" as const,
    role: "presentation" as const,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
  };
}

export function FacebookIcon({ className }: BrandIconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073C0 18.063 4.388 23.027 10.125 23.927v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.063 24 12.073Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: BrandIconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.053 1.805.249 2.227.415.56.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.013 3.584-.07 4.85c-.053 1.17-.249 1.805-.413 2.227a3.72 3.72 0 0 1-.896 1.382 3.72 3.72 0 0 1-1.382.896c-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.584-.013-4.85-.07c-1.17-.053-1.805-.249-2.227-.413a3.72 3.72 0 0 1-1.382-.896 3.72 3.72 0 0 1-.896-1.382c-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.013-3.584.07-4.85c.053-1.17.249-1.805.413-2.227a3.72 3.72 0 0 1 .896-1.381 3.72 3.72 0 0 1 1.382-.896c.422-.166 1.057-.362 2.227-.415 1.266-.058 1.646-.07 4.85-.07Zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.904.333 4.14.63a5.88 5.88 0 0 0-2.126 1.384A5.88 5.88 0 0 0 .63 4.14C.333 4.904.13 5.775.072 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.058 1.277.261 2.148.558 2.912a5.88 5.88 0 0 0 1.384 2.126 5.88 5.88 0 0 0 2.126 1.384c.764.297 1.635.5 2.912.558C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.058 2.148-.261 2.912-.558a5.88 5.88 0 0 0 2.126-1.384 5.88 5.88 0 0 0 1.384-2.126c.297-.764.5-1.635.558-2.912.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.058-1.277-.261-2.148-.558-2.912a5.88 5.88 0 0 0-1.384-2.126A5.88 5.88 0 0 0 19.86.63c-.764-.297-1.635-.5-2.912-.558C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: BrandIconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

export function YouTubeIcon({ className }: BrandIconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
    </svg>
  );
}
