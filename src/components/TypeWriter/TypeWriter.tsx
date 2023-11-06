import React, { useEffect, useState } from "react";

interface TypeWriterProps {
  text: string;
  delay: number;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, delay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <>{currentText}</>;
};

export default TypeWriter;
