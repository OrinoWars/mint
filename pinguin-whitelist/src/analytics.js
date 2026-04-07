import ReactGA from 'react-ga4'

/** GA4 Measurement ID */
const MEASUREMENT_ID = 'G-2R8SFHB9LX'

export function initAnalytics() {
  if (!MEASUREMENT_ID) return

  ReactGA.initialize(MEASUREMENT_ID)
  ReactGA.send({
    hitType: 'pageview',
    page: window.location.pathname + window.location.search,
    title: document.title,
  })
}
