// Keeps Amplitude in step with the session: which account this browser is
// (the database user id, never the email) and user properties for logged in
// or not and the plan (so events can be split by free vs paid). Runs on load
// and on every session change (log in, log out, a new plan after checkout).
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const { status, data } = useAuth()
    let lastUserId = null
    let lastProperties = null
    watch([status, data], () => {
      if (status.value === 'loading') return
      const user = status.value === 'authenticated' ? data.value : null
      const userId = user?.id ?? null

      if (userId !== lastUserId) {
        // Log in: from now on (and Amplitude links this browser's earlier anonymous
        // visits) events belong to the account. Log out: clear it, so whoever uses
        // the browser next isn't counted as them. Nothing on a logged-out page load.
        if (userId || lastUserId) setAnalyticsUser(userId)
        lastUserId = userId
        lastProperties = null // A logout resets Amplitude's user, so send the properties again
      }

      const plan = user?.plan
      const properties = {
        logged_in: !!user,
        plan: plan?.name ?? null,
        plan_interval: plan?.name && plan.name !== 'Basic' ? plan.interval : null,
        // Influencers get Professional for free: on the plan, but not paying
        paid: !!plan?.amount && parseFloat(plan.amount) > 0 && !user?.influencer,
        influencer: user ? !!user.influencer : null,
      }
      const key = JSON.stringify(properties)
      if (key === lastProperties) return // Only send changes
      lastProperties = key
      setUserProperties(properties)
    }, { immediate: true, deep: true })
  })
})
