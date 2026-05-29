/** Сбрасывает зум/сдвиг после фокуса на input (iOS Safari). */
export function resetMobileViewport() {
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    active.blur();
  }

  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
}
