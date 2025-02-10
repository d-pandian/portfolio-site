import { MoveUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Container from "./Container";
import Image from "next/image";
import { hero } from "@/assets/image";
import Statistics from "./Statistics";
import Counter from "./Counter";

const Banner = () => {
  return (
    <div className="relative">
      <Container className="flex flex-col md:flex-row py-16">
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <h2 className="text-5xl font-bold capitalize leading-[55px]">
            <span className="flex items-center gap-5">
              Hi! I am{" "}
              <span className="bg-darkBlue text-primaryWhite rounded-full text-xl px-6 py-1.5">
                Developer
              </span>
            </span>
            Christian Rolan
          </h2>
          <p className="text-base font-medium tracking-wide">
            Building and deploying websites for{" "}
            <span className="font-bold">6+ years</span> <br />
            as a Web Developer.
          </p>
          <div className="flex items-center gap-5 text-sm font-bold tracking-wide">
            <button className="bg-darkOrange text-primaryWhite border border-darkOrange px-8 py-2.5 rounded-md hover:bg-transparent hover:text-primary transition-colors duration-300">
              Hire Me
            </button>
            <Link
              href={"/projects"}
              className="flex items-center gap-2 border px-6 py-2.5 rounded-md hover:border-darkOrange transition-colors duration-300 group"
            >
              Projects{" "}
              <MoveUpRight className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              <Counter end={105} />+
            </h2>
            <p className="text-base font-medium leading-5 mt-1">
              Clients on work <br />
              worldwide
            </p>
          </div>
          <div className="flex items-center gap-20 md:gap-32">
            <div>
              <h2 className="text-2xl font-bold">
                <Counter end={450} />+
              </h2>
              <p className="text-base font-medium leading-5 mt-1">
                Project Done
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Contact</h2>
              <Link
                href="mailto:reactjsbd@gmail.com"
                className="text-base font-medium"
              >
                reactjsbd@gmail.com
              </Link>
            </div>
          </div>
        </div>
      </Container>
      <Statistics />

      <div className="md:absolute md:top-0 md:right-0 w-full md:w-1/2 h-full bg-lightYellow pt-5">
        <div className="relative w-full h-auto md:w-full md:h-full overflow-hidden flex items-center justify-center">
          <Image
            src={hero}
            alt="heroImage"
            className="max-h-[800px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
