//core/src/components/SpinnerWheel.tsx
import React, { useRef, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { WordSpinner } from "./WordSpinner";
import { RoundButton } from "./RoundButton";
import toast, { Toaster } from 'react-hot-toast';

interface SpinnerWheelProps {
  combinations: string[];
  onSpin: (selectedCombination: string) => void;
}

export const SpinnerWheel: React.FC<SpinnerWheelProps> = ({
  combinations = [],
  onSpin,
}) => {
  const wheelRef = useRef<SVGGElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const wordSpinnerRef = useRef(new WordSpinner());

  useEffect(() => {
    try {
      createWheel();
      wordSpinnerRef.current.setCombinations(
        combinations.length > 0 ? combinations : ["Spin", "the", "Wheel"]
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }

    if (wheelRef.current) {
      wheelRef.current.style.transformOrigin = "center";
    }
  }, [combinations]);

  const createWheel = () => {
    if (!wheelRef.current) return;
    const effectiveCombinations =
      combinations.length > 0 ? combinations : ["Spin", "the", "Wheel"];
    const segmentAngle = 360 / effectiveCombinations.length;

    wheelRef.current.innerHTML = "";
    effectiveCombinations.forEach((combination, i) => {
      const segment = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      const startAngle = i * segmentAngle;
      const endAngle = (i + 1) * segmentAngle;
      const x1 = 200 + 180 * Math.cos((Math.PI * startAngle) / 180);
      const y1 = 200 + 180 * Math.sin((Math.PI * startAngle) / 180);
      const x2 = 200 + 180 * Math.cos((Math.PI * endAngle) / 180);
      const y2 = 200 + 180 * Math.sin((Math.PI * endAngle) / 180);

      segment.setAttribute(
        "d",
        `M200,200 L${x1},${y1} A180,180 0 0,1 ${x2},${y2} Z`
      );
      segment.setAttribute("fill", getRandomColor());
      wheelRef.current?.appendChild(segment);

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      const textAngle = startAngle + segmentAngle / 2;
      const textX = 200 + 120 * Math.cos((Math.PI * textAngle) / 180);
      const textY = 200 + 120 * Math.sin((Math.PI * textAngle) / 180);
      text.setAttribute("x", textX.toString());
      text.setAttribute("y", textY.toString());
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "white");
      text.setAttribute("font-size", "12");
      text.setAttribute(
        "transform",
        `rotate(${textAngle + 180}, ${textX}, ${textY})`
      );
      text.textContent = combination;
      wheelRef.current?.appendChild(text);
    });
  };

  const getRandomColor = () => {
    return `hsl(${Math.random() * 360}, 70%, 50%)`;
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const spin = () => {
    if (isSpinning || !wheelRef.current) return;
    setIsSpinning(true);

    const spinPromise = wordSpinnerRef.current.spin();

    const animate = () => {
      const currentAngle = wordSpinnerRef.current.getCurrentRotation();

      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${-currentAngle}deg)`;
      }

      if (wordSpinnerRef.current.isSpinning()) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
      }
    };

    requestAnimationFrame(animate);

    spinPromise.then((selectedCombination) => {
      onSpin(selectedCombination);
      triggerConfetti();
      toast.success(`Winner: ${selectedCombination}`);
    }).catch((error) => {
      toast.error(error.message);
    });
  };
//the svg is messing with the padding/centering of the button
  return (
    <div className="relative w-full max-w-[400px] h-[400px] mx-auto my-8">
      <Toaster position="top-center" reverseOrder={false} />
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <g ref={wheelRef} />
        <path
          d="M390,200 L350,190 L350,210 Z"
          fill="black"
          transform="rotate(0, 200, 200)"
        />
      </svg>

      <div className="text-center">
        <RoundButton 
          onClick={spin} 
          disabled={isSpinning}
        >
          {isSpinning ? "Spinning..." : "Spin the Wheel"}
        </RoundButton>
      </div>
    </div>
  );
};
