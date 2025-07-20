import React from "react";
import Container from "./Container";
import Image from "next/image";
import { projectOne, projectThree, projectTwo } from "@/assets/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const data = [
  {
    title: "DoctorOnCall is a full-stack Doctor Appointment Booking System developed using the MERN stack (MongoDB, Express.js, React, Node.js) It allows patients to book appointments, doctors to manage schedules, and admins to control user access all within a role-based, secure, and responsive platform This application offers real-time availability, appointment confirmations, and a clean UI for both patients and doctors, optimized for mobile and desktop.",
    href: "https://buymeacoffee.com/reactbd",
    image: projectOne,
    publishedAt: "April 21, 2024",
    category: "Ecommerce",
  },
  {
    title: "Tomato is a full-featured, responsive food delivery application built using the MERN stack (MongoDB, Express.js, React, Node.js) It supports Stripe payment integration, real-time order tracking, and includes a dedicated admin panel to manage restaurants, menus, users, and analytics.",
    href: "https://buymeacoffee.com/reactbd",
    image: projectTwo,
    publishedAt: "April 21, 2024",
    category: "Design",
  },
  {
    title: "The Shoptech Ecommerce Application is a fully functional, scalable ecommerce platform built with Next.js and powered by Sanity CMS It supports dynamic product content, user authentication via Clerk, secure payments via Stripe, and optional real-time chat features using Sendbird.",
    href: "https://buymeacoffee.com/reactbd",
    image: projectThree,
    publishedAt: "April 21, 2024",
    category: "Blogs",
  },
];

const Projects = ({ className }: { className?: string }) => {
  return (
    <div className={cn("py-20 md:py-24", className)}>
      <Container className="">
        <div className="flex flex-col items-center justify-center gap-3">
          <h1 className="text-4xl font-bold tracking-wide">My Projects</h1>
          <p className="max-w-3xl text-center">
          Crafted using the MERN stack (MongoDB, Express.js, React.js, Node.js) with full attention to scalability, security, and performance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
          {data?.map((item, index) => (
            <div key={index}>
              <div className="overflow-hidden relative w-full h-64 group">
                <Image
                  src={item?.image}
                  alt="projectOne"
                  className="w-full h-full z-10"
                />
                <div className="absolute w-full h-full bg-primary left-0 top-0 opacity-10 scale-100 hover:scale-95 hoverEffect" />
              </div>
              <div className="space-y-5 mt-2">
                <p className="font-semibold text-primary/70 text-sm">
                  {item?.publishedAt} / {item?.category}
                </p>
                <h2 className="text-xl font-bold">{item?.title}</h2>
                <button className="pr-4 text-sm font-bold border-r-primary hover:text-darkOrange hoverEffect after:w-[2px] after:h-[60%] after:bg-primary  after:absolute relative after:-right-1.5 after:top-0 hover:after:-rotate-45 before:w-[2px] before:h-[60%] before:bg-primary before:absolute before:-right-1.5 before:bottom-0 hover:before:rotate-45 hover:after:inline-block after:transition-all before:transition-all transform-rotate duration-500">
                  
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Projects;
