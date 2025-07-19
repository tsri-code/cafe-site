import { useState, useEffect, useCallback } from "react";

const useImageCarousel = (images, autoPlayInterval = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);

    setTimeout(() => setIsTransitioning(false), 500);
  }, [images.length, isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );

    setTimeout(() => setIsTransitioning(false), 500);
  }, [images.length, isTransitioning]);

  const goToSlide = useCallback(
    (index) => {
      if (index === currentIndex || isTransitioning) return;

      setIsTransitioning(true);
      setCurrentIndex(index);

      setTimeout(() => setIsTransitioning(false), 500);
    },
    [currentIndex, isTransitioning],
  );

  const pauseAutoPlay = () => setIsPlaying(false);
  const resumeAutoPlay = () => setIsPlaying(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, goToNext, autoPlayInterval, images.length]);

  // Pause on window blur, resume on focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAutoPlay();
      } else {
        resumeAutoPlay();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return {
    currentIndex,
    currentImage: images[currentIndex],
    isTransitioning,
    isPlaying,
    goToNext,
    goToPrevious,
    goToSlide,
    pauseAutoPlay,
    resumeAutoPlay,
    totalSlides: images.length,
  };
};

export default useImageCarousel;
