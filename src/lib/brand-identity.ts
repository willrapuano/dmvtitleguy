export const SITE_URL = "https://dmvtitleguy.io";
export const SITE_NAME = "DMV Title Guy";

export const WILL = {
  name: "Will Rapuano",
  jobTitle: "Marketing and Business Development Officer",
  email: "wrapuano@pruitt-title.com",
  phoneDisplay: "(703) 859-1467",
  phoneHref: "tel:+17038591467",
  image: `${SITE_URL}/will-rapuano-headshot.jpg`,
  url: `${SITE_URL}/about-will-rapuano`,
  sameAs: [
    "https://www.facebook.com/profile.php?id=61556322698901",
    "https://www.instagram.com/dmvtitleguy",
    "https://www.linkedin.com/in/will-rapuano-86914b130",
    "https://www.youtube.com/@dmvtitleguy",
  ],
} as const;

export const PRUITT_TITLE = {
  name: "Pruitt Title LLC",
  url: "https://pruitt-title.com/",
  id: "https://pruitt-title.com/#organization",
  address: {
    streetAddress: "1900 Gallows Rd Ste 230",
    addressLocality: "Vienna",
    addressRegion: "VA",
    postalCode: "22182",
    addressCountry: "US",
  },
} as const;

export const RELATIONSHIP_DISCLOSURE =
  "DMV Title Guy is a personal educational and business-development website operated by Will Rapuano. It is separate from Pruitt Title LLC’s corporate website and is not a title insurer, title agency, escrow company, or settlement provider. Will is Marketing and Business Development Officer at Pruitt Title. If you request transaction services, your information may be referred to Pruitt Title for its independent review. If Pruitt accepts the request, it confirms scope, pricing, terms, and required disclosures directly.";

export function pruittOrganizationReference() {
  return {
    "@type": "Organization",
    "@id": PRUITT_TITLE.id,
    name: PRUITT_TITLE.name,
    url: PRUITT_TITLE.url,
  };
}

export function willPersonReference() {
  return {
    "@type": "Person",
    "@id": `${WILL.url}#person`,
    name: WILL.name,
    url: WILL.url,
  };
}
