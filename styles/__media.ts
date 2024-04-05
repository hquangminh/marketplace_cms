export const maxMediaQuery = (px: number) => `@media (max-width: ${px}px)`;
export const maxMedia = {
  /** @media (max-width: 991px) */
  medium: maxMediaQuery(991),

  /** @media (max-width: 640px) */
  small: maxMediaQuery(640),

  /** @media (max-width: 480px) */
  xsmall: maxMediaQuery(480),

  /** @media (max-width: 360px) */
  tiny: maxMediaQuery(360),

  /** @media (max-width: ${param}px) */
  custom: maxMediaQuery,
};

// export const minMediaQuery = (px: number) => `@media (min-width: ${px}px)`;
// export const minMedia = {
//   medium: minMediaQuery(992),
//   small: minMediaQuery(641),
// };
