// Facebook-style verified badge — blue jagged circle with white checkmark
export default function VerifiedBadge({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block flex-shrink-0">
      <path
        d="M12 2L13.9 3.8L16.5 3.2L17.8 5.5L20.4 6.2L20.5 8.9L22.5 10.7L21.5 13.2L22.5 15.7L20.5 17.5L20.4 20.2L17.8 20.9L16.5 23.2L13.9 22.6L12 24.4L10.1 22.6L7.5 23.2L6.2 20.9L3.6 20.2L3.5 17.5L1.5 15.7L2.5 13.2L1.5 10.7L3.5 8.9L3.6 6.2L6.2 5.5L7.5 3.2L10.1 3.8L12 2Z"
        fill="#0866FF"
      />
      <path
        d="M8 12.5L10.5 15L16 9"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}