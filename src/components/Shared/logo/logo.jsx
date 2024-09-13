import { useState, useEffect } from "react";
import s from "./logo.module.scss";

const Logo = () => {
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShift((prevShift) => (prevShift + 1) % 10);
    }, 130);

    return () => clearInterval(interval);
  }, []);

  const bars = [];

  for (let i = 0; i < 10; i++) {
    let height;
    const index = (i + shift) % 10;
    if (index <= 5) {
      height = (index + 1) * 3;
    } else {
      height = (10 - index) * 3;
    }

    bars.push(
      <div
        key={i}
        className={s.wave_bar}
        style={{
          height: `${height}px`,
          animationDelay: `${-i * 0.1}s`,
        }}
      ></div>
    );
  }

  return <div className={s.wave_container}>{bars}</div>;
};

export default Logo;
