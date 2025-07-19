import { useState, useEffect } from "react";

const useTypewriter = (text, speed = 100, delay = 0, loop = false) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!text) return;

    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  useEffect(() => {
    if (!isStarted || !text) return;

    let index = 0;
    setDisplayText("");
    setIsComplete(false);

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(typeInterval);

        if (loop) {
          setTimeout(() => {
            setDisplayText("");
            setIsComplete(false);
            setIsStarted(false);

            setTimeout(() => setIsStarted(true), 500);
          }, 2000);
        }
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [text, speed, loop, isStarted]);

  return { displayText, isComplete, isStarted };
};

export default useTypewriter;
