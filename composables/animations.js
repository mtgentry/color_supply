// src/composables/animations.js
import gsap from 'gsap';

/**
 * Not real function names below, just placeholder 
 */
export function useAnimations() {
  const openDropdown = (element) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
  };

  const closeDropdown = (element) => {
    return gsap.to(element, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: 'power2.in',
    });
  };

  const openModal = (element) => {
    return gsap.fromTo(
      element,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
    );
  };

  const closeModal = (element) => {
    return gsap.to(element, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in',
    });
  };

  return {
    openDropdown,
    closeDropdown,
    openModal,
    closeModal,
  };
}
