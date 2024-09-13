import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getConfirmation } from "../../../redux/technical/technical-selectors";
import { getLine } from "../../../redux/technical/technical-selectors";
import s from "./CountdownCircle.module.scss";

const CountdownCircle = () => {
  const isConfirmation = useSelector(getConfirmation);
  const line = useSelector(getLine);
  const [count, setCount] = useState(3);
  const [progress, setProgress] = useState(100);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    if (isConfirmation) {
      setCount(3);
      setIsCounting(true);
    }
  }, [isConfirmation]);

  useEffect(() => {
    if (!isCounting) return;
    const countInterval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 1) {
          clearInterval(countInterval);
          return line === "speaker" ? "RECORD" : "SPEAK";
        }
        if (prevCount === "SPEAK" || prevCount === "RECORD") {
          return line === "speaker" ? "RECORD" : "SPEAK";
        }
        return prevCount - 1;
      });
    }, 1000);

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress === 0) {
          return;
        }
        return prevProgress - 100 / 2;
      });
    }, 1000);

    return () => {
      clearInterval(countInterval);
      clearInterval(progressInterval);
    };
  }, [isCounting, line]);

  return (
    <div className={s.countdown_circle}>
      <svg viewBox="0 0 36 36" className={s.circular_chart}>
        <path
          className={s.circle_bg}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={`${s.circle}`}
          strokeDasharray={`${progress}, 100`}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text
          x="18"
          y={count === "SPEAK" || count === "RECORD" ? "21.05" : "22.35"}
          className={
            count === "SPEAK" || count === "RECORD" ? s.word : s.percentage
          }
        >
          {count}
        </text>
      </svg>
    </div>
  );
};

export default CountdownCircle;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getConfirmation } from "@/redux/technical/technical-selectors";
// import s from "./CountdownCircle.module.scss";

// const CountdownCircle = () => {
//   const dispatch = useDispatch();
//   const isConfirmation = useSelector(getConfirmation);
//   const [count, setCount] = useState(3);
//   const [progress, setProgress] = useState(33.33); // Початковий прогрес - 1/3 (33.33%)
//   const [isCounting, setIsCounting] = useState(false);

//   useEffect(() => {
//     if (isConfirmation) {
//       setCount(3);
//       setProgress(33.33); // Прогрес встановлюється на 1/3
//       setIsCounting(true);
//     }
//   }, [isConfirmation]);

//   useEffect(() => {
//     if (!isCounting) return;

//     const countInterval = setInterval(() => {
//       setCount((prevCount) => {
//         if (prevCount === 1) {
//           clearInterval(countInterval);
//           return "SPEAK";
//         }
//         return prevCount - 1;
//       });
//     }, 1000);

//     const progressInterval = setInterval(() => {
//       setProgress((prevProgress) => {
//         if (count === 1) {
//           clearInterval(progressInterval);
//           return 0; // Прогрес обнуляється, коли досягається "SPEAK"
//         }
//         return prevProgress + 33.33; // Прогрес збільшується на 1/3 кожну секунду
//       });
//     }, 1000);

//     return () => {
//       clearInterval(countInterval);
//       clearInterval(progressInterval);
//     };
//   }, [isCounting, count]);

//   return (
//     <div className={s.countdown_circle}>
//       <svg viewBox="0 0 36 36" className={s.circular_chart}>
//         <path
//           className={s.circle_bg}
//           d="M18 2.0845
//             a 15.9155 15.9155 0 0 1 0 31.831
//             a 15.9155 15.9155 0 0 1 0 -31.831"
//         />
//         {count !== "SPEAK" && (
//           <path
//             className={`${s.circle}`}
//             strokeDasharray={`${progress}, 100`}
//             d="M18 2.0845
//               a 15.9155 15.9155 0 0 1 0 31.831
//               a 15.9155 15.9155 0 0 1 0 -31.831"
//           />
//         )}
//         {count !== "SPEAK" ? (
//           <text x="18" y="22.35" className={s.percentage}>
//             {count}
//           </text>
//         ) : (
//           <text x="18" y="21.35" className={s.word}>
//             Говоріть
//           </text>
//         )}
//       </svg>
//     </div>
//   );
// };

// export default CountdownCircle;
