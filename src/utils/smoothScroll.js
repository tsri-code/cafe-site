export const smoothScrollTo = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const getScrollProgress = () => {
  const currentProgress = window.pageYOffset;
  const scrollHeight = document.body.scrollHeight - window.innerHeight;

  if (scrollHeight <= 0) return 0;
  return (currentProgress / scrollHeight) * 100;
};
