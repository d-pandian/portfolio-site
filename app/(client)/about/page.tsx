import { hero } from "@/assets/image";
import Container from "@/components/Container";
import Image from "next/image";
import React from "react";

const BlogPage = () => {
  return (
    <Container className="bg-white text-darkColor py-10 md:py-20">
      <div>
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <Image
              className="h-48 w-full object-contain md:w-48"
              src={hero}
              alt="Profile picture"
              width={192}
              height={192}
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-darkOrange font-bold">
              Full Stack Developer
            </div>
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-darkColor sm:text-4xl">
              Christian Rolan
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-darkColor/80">
              Passionate about building scalable and efficient software
              solutions.
            </p>
          </div>
        </div>

        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold mb-4">About Me</h2>
          <p className="text-darkColor/80 mb-4">
            With over 7 years of experience in software development, I
            specialize in creating robust and user-friendly applications. My
            expertise spans across full-stack development, with a particular
            focus on JavaScript technologies like React and Node.js. Lorem
            ipsum, dolor sit amet consectetur adipisicing elit. Quam id non
            excepturi a tempora veritatis earum aut ab quia veniam! Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Ad quisquam dignissimos
            error nulla necessitatibus quae esse? Minima, veritatis autem! Autem
            quia assumenda, doloremque labore possimus repellat illum accusamus
            quae nostrum! Ullam nam nemo aliquid ratione atque commodi modi
            dolor minus, iusto itaque reprehenderit dolorum voluptatum illo
            saepe, eos quas voluptatem.
          </p>
          <p className="text-darkColor/80 mb-4">
            I&apos;m passionate about clean code, test-driven development, and
            continuously learning new technologies. When I&apos;m not coding,
            you can find me contributing to open-source projects or mentoring
            junior developers. Lorem ipsum, dolor sit amet consectetur
            adipisicing elit. Eveniet, natus quae. Voluptate, nesciunt. Vero,
            sapiente! Doloribus, possimus? Alias optio, eligendi beatae tempore
            illo, doloribus quos iure numquam recusandae commodi id.
          </p>
        </div>

        <div className="px-8 py-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "JavaScript",
              "TypeScript",
              "React",
              "Node.js",
              "Rust",
              "Docker",
              "AWS",
              "Git",
            ].map((skill) => (
              <span
                key={skill}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BlogPage;
