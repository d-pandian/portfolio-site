"use client";
import CountUp from "react-countup";

interface Props {
  end: number;
  delay?: number;
  duration?: number;
}

const Counter = ({ end, delay = 0, duration = 5 }: Props) => {
  return <CountUp end={end} delay={delay} duration={duration} />;
};

export default Counter;
