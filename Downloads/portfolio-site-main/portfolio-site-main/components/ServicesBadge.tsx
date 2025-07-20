import React from "react";
import Container from "./Container";
import { cn } from "@/lib/utils";

const badgeArray = [
  {
    title: "Digital creativity",
    label:
    " in the modern era, digital creativity drives innovation and transforms ideas into impactful experiences. It blends technology with imagination, enabling creators to design stunning visuals, compelling stories, and immersive digital environments. Whether it's graphic design, video production, animation, or interactive media, digital creativity unlocks limitless possibilities to connect, inspire, and engage audiences worldwide.",
    href: "/",
  },
  {
    title: "No coding needed",
    label:
      "Empower your creativity without writing a single line of code. Our intuitive tools and platforms allow anyone—from beginners to experts—to build stunning digital projects easily. Focus on your ideas while we handle the technical complexities, making innovation accessible to all. Say goodbye to barriers and hello to seamless, code-free creation.",
    href: "/",
  },
  {
    title: "Finish quality",
    label:
      "Delivering excellence down to the finest detail. Our commitment ensures every project is completed with precision, durability, and a flawless finish. Experience superior craftsmanship that not only looks great but stands the test of time, giving your work a professional and polished edge",
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
            
          </div>
        ))}
      </Container>
    </div>
  );
};

export default ServicesBadge;
