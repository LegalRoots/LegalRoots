import { useEffect, useRef, useState } from "react";
import "./BubbleChart.css";

const Bubble = () => {
  return <div className="bubble"></div>;
};

const BubbleChart = ({ ratios }) => {
  const TOTAL_BUBBLES = 50;

  const redsRef = useRef([]);
  const blacksRef = useRef([]);
  const whitesRef = useRef([]);

  const [blackBubbles, setBlackBubbles] = useState(0);
  const [whiteBubbles, setWhiteBubbles] = useState(0);
  const [redBubbles, setRedBubbles] = useState(0);

  useEffect(() => {
    if (ratios) {
      const TOTAL_COUNT = ratios.black + ratios.white + ratios.red;
      setTimeout(() => {
        setBlackBubbles(TOTAL_BUBBLES * (ratios.black / TOTAL_COUNT));
        setWhiteBubbles(TOTAL_BUBBLES * (ratios.white / TOTAL_COUNT));
        setRedBubbles(TOTAL_BUBBLES * (ratios.red / TOTAL_COUNT));
      }, 200);
    }
  }, [ratios]);

  const animateBubbles = (i) => {
    let array = [];
    if (i === 1) {
      array = redsRef;
    } else if (i === 2) {
      array = whitesRef;
    } else {
      array = blacksRef;
    }
    let picked = [];
    for (let i = 0; i < array.current.length; i++) {
      const bubble = array.current[i];
      if (bubble) {
        let xPos = Math.floor(Math.random() * 80 + 10);
        while (picked.includes(xPos)) {
          xPos = Math.floor(Math.random() * 80 + 10); //number between 10 and 90
        }
        picked.push(xPos);

        let yPos =
          Math.floor(Math.random() * 3) === 1
            ? (xPos + 5 * i) % 90
            : (xPos - 5 * i) % 90;
        yPos = Math.abs(yPos);
        yPos = yPos < 7 ? yPos + 7 : yPos;
        bubble.style.left = `${xPos}%`;
        bubble.style.top = `${yPos}%`;
      }
    }
  };
  useEffect(() => {
    if (ratios) {
      setTimeout(() => {
        animateBubbles(1);
        animateBubbles(2);
        animateBubbles(3);
      }, 300);
    }
  }, [ratios]);

  return (
    <div className="casesItems-container-bubblechart">
      {Array.from({ length: blackBubbles }).map((_, i) => (
        <div
          key={i}
          ref={(e) => (blacksRef.current[i] = e)}
          className="bubble bubble-black"
        ></div>
      ))}
      {Array.from({ length: whiteBubbles }).map((_, i) => (
        <div
          key={i}
          ref={(e) => (whitesRef.current[i] = e)}
          className="bubble bubble-white"
        ></div>
      ))}
      {Array.from({ length: redBubbles }).map((_, i) => (
        <div
          key={i}
          ref={(e) => (redsRef.current[i] = e)}
          className="bubble bubble-red"
        ></div>
      ))}
    </div>
  );
};

export default BubbleChart;
