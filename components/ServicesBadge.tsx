import React from "react";
import Container from "./Container";
import { cn } from "@/lib/utils";

const badgeArray = [
  {
    title: "Digital creativity",
    label:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut sapiente ab, rem assumenda vel possimus doloremque distinctio aliquam eaque sint.",
    href: "/",
  },
  {
    title: "No coding needed",
    label:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut sapiente ab, rem assumenda vel possimus doloremque distinctio aliquam eaque sint.",
    href: "/",
  },
  {
    title: "Finish quality",
    label:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut sapiente ab, rem assumenda vel possimus doloremque distinctio aliquam eaque sint.",
    href: "/",
  },
];
const ServicesBadge = ({ className }: { className?: string }) => {
  return (
    <div className={cn("py-20 md:py-24", className)}>
      <Container className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {badgeArray?.map(({ title, label }) => (
          <div key={title}>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-base font-normal text-primary/80 my-5 md:my-8">
              {label}
            </p>
            <button className="pr-4 text-sm font-bold border-r-primary hover:text-darkOrange hoverEffect after:w-[2px] after:h-[60%] after:bg-primary  after:absolute relative after:-right-1.5 after:top-0 hover:after:-rotate-45 before:w-[2px] before:h-[60%] before:bg-primary before:absolute before:-right-1.5 before:bottom-0 hover:before:rotate-45 hover:after:inline-block after:transition-all before:transition-all transform-rotate duration-500">
              Read More
            </button>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default ServicesBadge;
