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
              Pandian D
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-darkColor/80">
              Passionate about building scalable and efficient software solutions.
            </p>
          </div>
        </div>

        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold mb-4">About Me</h2>
          <p className="text-darkColor/80 mb-4">
            With 1 year of professional experience as a Full Stack Developer at Thots2IT Technologies (Feb 2024 – Jan 2025), I have built and maintained enterprise-level web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js). My expertise lies in developing clean and efficient REST APIs, building responsive frontends with React and Tailwind CSS, managing data with MongoDB, and handling authentication flows using JWT and Clerk. I&rsquo;ve also worked on integrating Stripe for secure payments, managing CMS content with Sanity, and collaborating with cross-functional teams using Agile methodology. I am passionate about clean code, scalable architecture, test-driven development, and continuously learning new technologies. Outside of coding, I enjoy contributing to open-source projects and mentoring junior developers to help them grow in their careers. My goal is to deliver solutions that not only meet business needs but also provide excellent user experiences.
          </p>
          <p className="text-darkColor/80 mb-4">
            I&apos;m passionate about clean code, test-driven development, and continuously learning new technologies. As a MERN Stack Developer with hands-on experience in building full-stack applications, I thrive in turning complex problems into simple, scalable solutions. I actively contribute to open-source projects and enjoy mentoring junior developers to help them grow.
            <br />
            When I&rsquo;m not coding, you&rsquo;ll find me exploring new tools in the JavaScript ecosystem or researching the latest trends in web development. I&apos;m committed to writing maintainable, performant code and building meaningful digital experiences.
          </p>
        </div>

        <div className="px-8 py-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "JavaScript",
              "TypeScript",
              "HTML5",
              "CSS3",
              "React.js",
              "Next.js",
              "Tailwind CSS",
              "Bootstrap",
              "Framer Motion",
              "Redux Toolkit",
              "Zustand",
              "ShadCN UI",
              "Node.js",
              "Express.js",
              "MongoDB",
              "Mongoose",
              "PostgreSQL",
              "Prisma",
              "REST APIs",
              "GraphQL",
              "Responsive Web Design"
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
