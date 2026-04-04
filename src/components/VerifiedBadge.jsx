// Exact Facebook verified badge — blue jagged seal with bold white checkmark
export default function VerifiedBadge({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block flex-shrink-0"
    >
      {/* Jagged badge shape exactly like Facebook */}
      <path
        d="M20 2
           L23.5 5.2 L27.8 4 L30 7.8 L34.4 8.4 L34.8 12.8
           L38 15.5 L36.6 19.8 L38.8 23.8 L36 26.9
           L36.8 31.3 L32.6 33.2 L31.4 37.5 L27 37.6
           L24 40.4 L20 38.8 L16 40.4 L13 37.6
           L8.6 37.5 L7.4 33.2 L3.2 31.3 L4 26.9
           L1.2 23.8 L3.4 19.8 L2 15.5 L5.2 12.8
           L5.6 8.4 L10 7.8 L12.2 4 L16.5 5.2 Z"
        fill="#0866FF"
      />
      {/* White bold checkmark */}
      <path
        d="M12 21L17.5 27L28 14"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}