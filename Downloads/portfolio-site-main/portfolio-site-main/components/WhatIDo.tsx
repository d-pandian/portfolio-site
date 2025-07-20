import React from "react";
import Container from "./Container";
import { Title } from "./typo";
import { Box, Dice5, LoaderPinwheel, Sparkle } from "lucide-react";

const data = [
  {
    icon: <Sparkle size={50} />,
    title: "Design",
    description:
      "We craft purposeful and visually compelling designs that align with your brand identity. From layout to typography, every element is thoughtfully structured to engage users and deliver intuitive, beautiful digital experiences",
  },
  {
    icon: <Dice5 size={50} />,
    title: "Branding",
    description:
      "We build powerful brand identities that leave lasting impressions. From logos to brand guidelines, we help define your voice, style, and story ensuring consistency and recognition across every platform",
  },
  {
    icon: <LoaderPinwheel size={50} />,
    title: "Innovative",
    description:
      "Our team thrives on fresh thinking, bold ideas, and breakthrough solutions that challenge the ordinary From concept to completion, innovation is the heartbeat of everything we do.",
  },
  {
    icon: <Box size={50} />,
    title: "Solutions",
    description:
      "We don’t just follow trends we set them Our team thrives on fresh thinking, bold ideas, and breakthrough solutions that challenge the ordinary From concept to completion, innovation is the heartbeat of everything we do",
  },
];

const WhatIDo = () => {
  return (
    <div className="bg-darkColor text-primaryWhite py-20 md:py-24">
      <Container className="space-y-10">
        <div>
          <Title className="tracking-widest">What I Do</Title>
          <p className="tracking-wide max-w-2xl mt-2 text-primaryWhite/80">
            Transforming ideas into digital realities by blending strategic
            insights with innovative design, helping brands thrive in a rapidly
            evolving digital landscape.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {data?.map((item) => (
            <div key={item?.title} className="space-y-4 group">
              <span className="group-hover:text-darkOrange hoverEffect group-hover:animate-spin inline-block">
                {item?.icon}
              </span>
              <h3 className="text-2xl font-semibold">{item?.title}</h3>
              <p className="tracking-wide text-primaryWhite/80 group-hover:text-primaryWhite/90 hoverEffect">
                {item?.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default WhatIDo;
