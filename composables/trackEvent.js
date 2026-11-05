// Sends a product event to Amplitude, alongside its automatic page views and
// clicks. Amplitude only loads in production (nuxt.config.ts), so in
// development the event is logged to the console instead.
// Keep personal data (emails, names) out of the properties.
export const trackEvent = (event, properties = {}) => {
  const props = { page: window.location.pathname, ...properties }
  if (window.amplitude?.track) {
    window.amplitude.track(event, props)
  } else if (import.meta.dev) {
    console.debug('[trackEvent]', event, props)
  }
}

// Ties this browser's events to an account: the database user id (look it up in
// the DB or Django admin to see who it is), never the email. null on logout, so the
// next person on this browser isn't counted as them.
export const setAnalyticsUser = (userId) => {
  const amplitude = window.amplitude
  if (amplitude?.setUserId) {
    // Amplitude needs user ids of 5+ characters, so the number is prefixed
    amplitude.setUserId(userId ? `user-${userId}` : undefined)
    if (!userId) amplitude.reset?.()
  } else if (import.meta.dev) {
    console.debug('[setAnalyticsUser]', userId)
  }
}

// Sets properties on the current Amplitude user, so every event can be broken
// down by them, e.g. free vs paid. Keep emails and names out. A null value
// removes the property.
export const setUserProperties = (properties) => {
  const amplitude = window.amplitude
  if (amplitude?.identify && amplitude.Identify) {
    const identify = new amplitude.Identify()
    for (const [key, value] of Object.entries(properties)) {
      if (value === null || value === undefined) identify.unset(key)
      else identify.set(key, value)
    }
    amplitude.identify(identify)
  } else if (import.meta.dev) {
    console.debug('[setUserProperties]', properties)
  }
}
