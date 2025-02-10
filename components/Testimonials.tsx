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
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur reprehenderit aperiam ad fugiat quia, commodi quo culpa explicabo nisi unde optio quam saepe eligendi inventore ab, voluptatem nam natus odio tempore corrupti similique expedita dolores? Molestias natus accusantium odio repellendus qui dolorem, libero autem, beatae debitis odit pariatur ab placeat",
    author: "John Doe",
    author_title: "Photographer",
  },
  {
    title: "Testimonials",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur reprehenderit aperiam ad fugiat quia, commodi quo culpa explicabo nisi unde optio quam saepe eligendi inventore ab, voluptatem nam natus odio tempore corrupti similique expedita dolores? Molestias natus accusantium odio repellendus qui dolorem, libero autem, beatae debitis odit pariatur ab placeat",
    author: "Christopher Neil",
    author_title: "Web Developer",
  },
  {
    title: "Testimonials",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur reprehenderit aperiam ad fugiat quia, commodi quo culpa explicabo nisi unde optio quam saepe eligendi inventore ab, voluptatem nam natus odio tempore corrupti similique expedita dolores? Molestias natus accusantium odio repellendus qui dolorem, libero autem, beatae debitis odit pariatur ab placeat",
    author: "Nick Johns",
    author_title: "Software Engineer",
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
