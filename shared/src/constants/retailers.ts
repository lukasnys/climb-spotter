export const RETAILERS = {
  "9C_CLIMBING": {
    name: "9C Climbing",
    url: "https://www.9cclimbing.com/",
    currency: "EUR",
  },
  BERGFREUNDE: {
    name: "Bergfreunde",
    url: "https://www.bergfreunde.eu/",
    currency: "EUR",
  },
  OLIUNID: {
    name: "Oliunid",
    url: "https://www.oliunid.com/",
    currency: "EUR",
  },
} as const;

export type RetailerKey = keyof typeof RETAILERS;
