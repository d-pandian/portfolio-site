import React from "react";
import Container from "./Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const data = [
  {
    title: "Testimonials",
    description:
      "Pandian transformed our vision into a fully functional web app using the MERN stack. His attention to detail and dedication to clean, scalable code truly impressed our team.",
    author: "Ravi K",
    author_title: "Product Manager at HealthTech Startup",
  },
  {
    title: "Testimonials",
    description:
      "We hired Pandian for a freelance eCommerce platform. His ability to handle frontend, backend, and database integration was exceptional. He even added AI-based suggestions",
    author: "Sowmya N",
    author_title: "Founder of DecorCart",
  },
  {
    title: "Testimonials",
    description:
      "As a teammate, Pandian was collaborative and highly resourceful. He contributed to solving major React bugs during our project deadline rush. A true team player",
    author: "Jyothi M",
    author_title: "React Developer at Our Company",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-darkOrange/10 py-20 md:py-24">
      <Container>
        <Carousel>
          <CarouselContent>
            {data?.map((item, index) => (
              <CarouselItem
                key={index}
                className="flex flex-col items-center justify-center gap-5 md:gap-7"
              >
                <h2 className="text-5xl font-bold tracking-wide">
                  {item?.title}
                </h2>
                <p className="tracking-wide text-center leading-7 max-w-6xl">
                  {item?.description}
                </p>
                <p className="font-semibold text-primary">
                  {item?.author} /{" "}
                  <span className="font-normal">{item?.author_title}</span>
                </p>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Container>
    </div>
  );
};

export default Testimonials;
