export function isSafari() {
  const ua = navigator.userAgent
  // eslint-disable-next-line regexp/no-dupe-disjunctions
  return /Safari/.test(ua) && !/Chrome|CriOS|Edg|Edge|Chromium/.test(ua)
}
