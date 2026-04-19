export const contentType = "image/svg+xml";

export default function AppleIcon() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" rx="38" fill="#0d1117"/>
  <rect x="20" y="18" width="140" height="5" rx="2.5" fill="#00ff88"/>
  <text x="20" y="135" font-family="system-ui,sans-serif" font-size="110" font-weight="900" fill="#00ff88" letter-spacing="-4">VS</text>
</svg>`,
    { headers: { "Content-Type": "image/svg+xml" } }
  );
}
