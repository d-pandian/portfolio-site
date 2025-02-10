import { twMerge } from "tailwind-merge";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={twMerge(
          "w-full bg-primary/5 text-base px-4 py-2 outline-none border rounded-md focus-within:border-primary focus-within:bg-transparent disabled:bg-primary/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Label = ({
  htmlFor,
  children,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge("font-semibold text-sm mb-1", className)}
    >
      {children}
    </label>
  );
};

export default Input;
