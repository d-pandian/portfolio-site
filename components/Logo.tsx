import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Logo = ({ children, className }: Props) => {
  return (
    <Link
      href={"/"}
      className={cn(
        "text-xl font-bold hover:text-darkOrange hoverEffect group",
        className
      )}
    >
      <p className="flex items-end relative">
        {children}
        <span className="absolute -right-5 -bottom-1 text-darkOrange group-hover:text-darkColor">
          <Dot className="w-7 h-7" />
        </span>
      </p>
    </Link>
  );
};

export default Logo;
