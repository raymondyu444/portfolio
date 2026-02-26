/**
 * Right-pointing arrow for hover CTAs.
 * Replace the path below with your Figma export (node 554-91) if needed.
 * Uses currentColor so it inherits text color (black on Case Study, white on Lore).
 */
export default function ArrowIcon({ className }) {
  return (
    <svg
      viewBox="0 0 21 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 5l11 8.5L5 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
