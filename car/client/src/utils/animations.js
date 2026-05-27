export const viewportOnce = { once: true, amount: 0.1 };
export const viewportMobile = { once: true, amount: 0.05 };
export const smoothEase = [0.22, 1, 0.36, 1];
export const smoothTransition = { duration: 0.7, ease: smoothEase };

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.65, ease: smoothEase },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};
