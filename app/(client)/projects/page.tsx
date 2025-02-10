import Container from "@/components/Container";
import Projects from "@/components/Projects";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import React from "react";

const ProjectsPage = () => {
  return (
    <div>
      <section className="py-20 md:py-32 bg-gradient-to-r from-darkOrange to-darkBlue text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Get the Best Projects for Business
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
              deserunt aliquam excepturi repellendus natus esse tempora
              molestias veniam doloribus.
            </p>
            <Button size="lg" variant="secondary">
              Explore Projects
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>

      <Projects />
    </div>
  );
};

export default ProjectsPage;
