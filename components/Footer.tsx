import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import { footerLinks } from "@/constants/data";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="py-12 bg-primary/5">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-5 lg:gap-20">
        <div className="flex flex-col gap-3 lg:col-span-3">
          <Logo className="w-[88px]">Pandian</Logo>
          <p className="text-sm tracking-wide">
          I’m Pandian, a passionate Full Stack Developer skilled in the MERN stack. I actively share my code on GitHub and grow my professional network via LinkedIn. If you’d like to connect, collaborate, or just say hi feel free to drop me a message!
          </p>
          <SocialLinks />
        </div>
        <div className="hidden lg:inline-flex" />
        <div className="lg:col-span-4 flex justify-between">
          {footerLinks?.map((item) => (
            <div key={item?.title}>
              <h2 className="text-base capitalize font-semibold text-primary/80">
                {item?.title}
              </h2>
              <div className="flex flex-col mt-2 gap-2 text-sm font-medium text-primary/80 ">
                {item?.data?.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="hover:text-darkOrange hoverEffect"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Footer;
