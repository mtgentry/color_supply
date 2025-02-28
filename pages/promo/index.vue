<template lang="pug">
  // Countdown Bar at the very top
  .countdown-bar
    | Promotion has Ended:
    .time-section
      span.countdown-time {{ daysLeft }}
      span.HRS DAY
      |
      span.countdown-time {{ hoursLeft }}
      span.HRS HRS
      |
      span.countdown-time {{ minutesLeft }}
      span.MIN MIN
      |
      span.countdown-time {{ secondsLeft }}
      span.SEC SEC

  #invite.d-flex.flex-column
    h1 The easiest way to pick the perfect colors—at the lowest price you'll ever pay

    p Picking colors shouldn't be this hard. But between complicated color theory rules, endless choices, 
      | and the nagging feeling that you might not have picked the right one, 
      | it often feels like guesswork. You're stuck second-guessing every shade, 
      | tweaking endlessly, and hoping it just works.

    p Imagine knowing exactly which colors work together—with zero stress. No overthinking, no struggling 
      | with color wheels, and no more wondering if your palette is clashing.

    p That's why I built Color Supply—to take the guesswork out of color. It helps you instantly create 
      | harmonious, professional-looking color palettes, without needing a degree in design.

    p Stop second-guessing and start feeling confident about your color choices.

    v-btn#button(color="primary" width="226" flat @click="signUp") Get VIP Access
  DialogsSignUp
  DialogsLogin
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ----------------------------------------------------------------------
// 1. Set the countdown END_DATE to Fri, Feb 28, 2025, 02:00:00 UTC
// ----------------------------------------------------------------------
const END_DATE = new Date('2025-02-28T02:00:00Z')

// ----------------------------------------------------------------------
// 2. Create reactive values to display the time left
// ----------------------------------------------------------------------
const daysLeft = ref(0)
const hoursLeft = ref(0)
const minutesLeft = ref(0)
const secondsLeft = ref(0)

// We'll store the offset between local time and real (server) time
let serverTimeOffset = 0
let countdownInterval

// ----------------------------------------------------------------------
// 3. Calculates how much time remains until END_DATE
// ----------------------------------------------------------------------
function calculateTimeLeft() {
  const now = new Date(Date.now() + serverTimeOffset)
  const difference = END_DATE - now

  if (difference <= 0) {
    daysLeft.value = 0
    hoursLeft.value = 0
    minutesLeft.value = 0
    secondsLeft.value = 0
    clearInterval(countdownInterval)
    return
  }

  const totalSeconds = Math.floor(difference / 1000)

  daysLeft.value = Math.floor(totalSeconds / 86400) // 86400 = 24 * 60 * 60
  const remainderAfterDays = totalSeconds % 86400

  hoursLeft.value = Math.floor(remainderAfterDays / 3600)
  const remainderAfterHours = remainderAfterDays % 3600

  minutesLeft.value = Math.floor(remainderAfterHours / 60)
  secondsLeft.value = remainderAfterHours % 60
}

// ----------------------------------------------------------------------
// 4. onMounted: fetch current UTC time from TimeAPI.io, then start countdown
// ----------------------------------------------------------------------
onMounted(async () => {
  try {
    const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC')
    const data = await response.json()
    const serverCurrentTime = new Date(data.dateTime).getTime()
    const localCurrentTime = Date.now()

    // Calculate offset (server - local)
    serverTimeOffset = serverCurrentTime - localCurrentTime
  } catch (error) {
    console.error('Error fetching server time:', error)
    // Fallback to local time
    serverTimeOffset = 0
  }

  calculateTimeLeft()
  countdownInterval = setInterval(calculateTimeLeft, 1000)
})

// ----------------------------------------------------------------------
// 5. onUnmounted: clear the interval
// ----------------------------------------------------------------------
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

// ----------------------------------------------------------------------
// Additional code from your existing setup (auth, dialogs, etc.)
// ----------------------------------------------------------------------
definePageMeta({
  layout: 'auth',
})

useHead({
  title: 'Private Invite',
})
const { data } = useAuth()
const router = useRouter()
const dialogStore = useDialogStore()
dialogStore.changeSource('promo')
const { changeSignUpForm } = dialogStore
const signUp = () => {
  if (data.value) {
    window.location.href = '/promo/billing'
    return
  }
  changeSignUpForm(true, false, false, true)
}
</script>

<style lang="sass" scoped>
.countdown-bar
  position: fixed
  top: 0
  padding-top: 2px
  left: 0
  width: 100%
  height: 40px
  background-color: #000
  color: #fff
  display: flex
  align-items: center
  justify-content: center
  font-weight: 700
  text-transform: uppercase
  letter-spacing: 1px
  z-index: 9999
  line-height: 1

  .time-section
    margin-left: 8px

  span.countdown-time,
  span.HRS,
  span.MIN,
  span.SEC
    display: inline-block
    vertical-align: baseline

  .countdown-time
    margin: 0 2px

  .HRS, .MIN, .SEC
    font-size: 0.7em
    margin-left: 1px
    margin-right: 6px

#invite
  margin-top: 70px
  max-width: 438px
  margin-left: auto
  margin-right: auto

  h1
    font-size: 30px
    font-style: normal
    font-weight: 700
    line-height: normal
    margin-top: 30px
    margin-bottom: 15px

  p
    padding-bottom: 20px
    font-size: 17px
    font-style: normal
    font-weight: 400
    line-height: 130%
    letter-spacing: 0.28px

  // MEDIA QUERY: On screens <= 768px, move the content up by 50px
  @media (max-width: 768px)
    margin-top: 20px   // 70px - 50px = 20px
</style>
