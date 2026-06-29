import { useCountUp } from '../useCountUp';

interface Props {
  to: number;
  dur?: number;
  dec?: boolean;
  active?: boolean;
  className?: string;
}

/** Renders an animated count-up number as a <span>. */
export default function CountUp({ to, dur = 800, dec = false, active = true, className }: Props) {
  const text = useCountUp(to, dur, dec, active);
  return <span className={className}>{text}</span>;
}
