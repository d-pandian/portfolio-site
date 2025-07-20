import Banner from "@/components/Banner";
import { FeaturedPosts } from "@/components/blog/featuredPosts";
import Projects from "@/components/Projects";
import ServicesBadge from "@/components/ServicesBadge";
import Testimonials from "@/components/Testimonials";
import WhatIDo from "@/components/WhatIDo";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Banner />
      <ServicesBadge />
      <WhatIDo />
      <Projects />
      <Testimonials />
      <FeaturedPosts />
    </div>
  );
}
