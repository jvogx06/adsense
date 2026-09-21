/**
 * AdReadySpace — a purely presentational vertical spacer that opens clean,
 * natural whitespace at safe points in the layout so Google Auto Ads has room
 * to place an in-page unit if it chooses (spec §7/§18/§56).
 *
 * It is NOT an ad slot: it never renders `<ins adsbygoogle>`, never requests or
 * pushes an ad, and shows no "Advertisement" label, background or border. It is
 * static, so it introduces no layout shift of its own (any reflow comes from
 * Auto Ads itself, never from this element).
 *
 * Kept deliberately small on mobile to avoid inflating scroll: ~48px phone,
 * 64px tablet, 80px desktop. Never place it between a form's inputs and its
 * button, pinned to a calculator result, or adjacent to navigation/controls.
 */
export function AdReadySpace({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`w-full h-12 sm:h-16 lg:h-20 ${className}`} />;
}
