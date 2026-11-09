// GSAP replacements for Vuetify's open/close animations, so menus and dialogs
// move the same way across the app (and faster than Vuetify's defaults, which
// have no speed setting). Pass one to a Vuetify overlay's `transition` prop:
//   v-menu(:transition="menuTransition")
//   v-dialog(:transition="dialogTransition")
// Vuetify renders `{ component }` in place of its own transition.
import { defineComponent, h, Transition } from 'vue'
import gsap from 'gsap'

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A fade with a slight drop and grow. Reduced motion: the fade only.
const fade = ({ name, enter, leave, y, scale }) => defineComponent({
  name,
  // Vuetify passes the activator as `target`; declared so it isn't set on the element as an attribute
  props: { target: null },
  setup(_, { slots }) {
    const onEnter = (el, done) => {
      const still = prefersReducedMotion()
      gsap.fromTo(el,
        { opacity: 0, y: still ? 0 : y, scale: still ? 1 : scale },
        { opacity: 1, y: 0, scale: 1, duration: enter, ease: 'power2.out', overwrite: true, clearProps: 'transform,opacity', onComplete: done })
    }
    const onLeave = (el, done) =>
      gsap.to(el, { opacity: 0, duration: leave, ease: 'power2.in', overwrite: true, onComplete: done })
    return () => h(Transition, { css: false, onEnter, onLeave }, slots)
  },
})

// Menus (account, Position): twice as fast as Vuetify's, whose contents took ~450ms to fade in
export const menuTransition = {
  component: fade({ name: 'GsapMenuTransition', enter: 0.225, leave: 0.125, y: -4, scale: 0.98 }),
}

// Dialogs (Sign Up, Login): a quick rise in place of Vuetify's zoom out of the clicked button
export const dialogTransition = {
  component: fade({ name: 'GsapDialogTransition', enter: 0.25, leave: 0.15, y: 12, scale: 0.98 }),
}
