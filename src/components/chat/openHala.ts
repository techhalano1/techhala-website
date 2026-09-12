export const OPEN_HALA_EVENT = "hala:open";

export type OpenHalaDetail = { prompt?: string };

/** Opens the Hala chat widget from anywhere on the page, optionally prefilling the input. */
export function openHala(prompt?: string) {
  window.dispatchEvent(new CustomEvent<OpenHalaDetail>(OPEN_HALA_EVENT, { detail: { prompt } }));
}
