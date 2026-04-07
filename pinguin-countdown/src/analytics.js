import ReactGA from 'react-ga4'

/** GA4 Measurement ID */
const MEASUREMENT_ID = 'G-L9PXVE5P5L'

export function initAnalytics() {
  if (!MEASUREMENT_ID) return

  ReactGA.initialize(MEASUREMENT_ID)
  ReactGA.send({
    hitType: 'pageview',
    page: window.location.pathname + window.location.search,
    title: document.title,
  })
}
