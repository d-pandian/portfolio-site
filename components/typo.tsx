import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  className?: string;
}
export const Title = ({ children, className }: Props) => {
  return (
    <h2
      className={twMerge(
        "text-xl font-bold font-mono tracking-wide flex items-center gap-2 group",
        className
      )}
    >
      <span className="w-2.5 h-2.5 bg-transparent rounded-full border group-hover:bg-darkOrange hoverEffect group-hover:border-darkOrange" />
      {children}
    </h2>
  );
};
