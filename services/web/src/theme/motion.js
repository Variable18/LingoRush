export const easing = {
  soft: [0.22, 1, 0.36, 1],
  standard: [0.2, 0, 0, 1],
};

export const durations = {
  quick: 0.18,
  base: 0.32,
  slow: 0.6,
};

export const variants = {
  page: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: durations.base, ease: easing.soft } },
    exit: { opacity: 0, y: -6, transition: { duration: durations.quick, ease: easing.standard } },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: durations.base, ease: easing.soft } },
  },
  reveal: {
    hidden: { opacity: 0, y: 8, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0)', transition: { duration: durations.base, ease: easing.soft } },
  },
  stagger: {
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
  },
};
