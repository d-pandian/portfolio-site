import Container from "@/components/Container";
import Projects from "@/components/Projects";
import ServicesBadge from "@/components/ServicesBadge";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import React from "react";

const ServicesPage = () => {
  return (
    <div>
      <section className="py-20 md:py-32 bg-gradient-to-r from-darkOrange to-darkBlue text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Elevate Your Digital Presence
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              From concept to execution, we deliver cutting-edge solutions that
              drive your business forward.
            </p>
            <Button size="lg" variant="secondary">
              Explore Services
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>
      <ServicesBadge />
      <Projects className="pt-0 md:pt-0" />
    </div>
  );
};

export default ServicesPage;
