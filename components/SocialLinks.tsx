import { Facebook, Github, Linkedin, Mail, Youtube } from "lucide-react";
import Link from "next/link";
import React from "react";

const footerData = [
  { label: "Github", href: "https://github.com/d-pandian", icon: <Github /> },
  {
    label: "Youtube",
    href: "https://www.youtube.com/@pandya076",
    icon: <Youtube />,
  },
  {
    label: "Linkedin",
    href: "https://www.linkedin.com/in/pandian-d",
    icon: <Linkedin />,
  },
  {
    label: "Facebook",
    href: "https://www.linkedin.com/in/pandian-d",
    icon: <Facebook />,
  },
  {
    label: "Email",
    href: "https://www.linkedin.com/in/pandian-d",
    icon: <Mail />,
  },
];

const SocialLinks = () => {
  return (
    <div className="flex items-center gap-3">
      {footerData?.map((item) => (
        <Link
          href={item?.href}
          key={item?.label}
          className="border border-darkOrange/50 p-2 rounded-lg text-primary/80 hover:border-darkOrange hover:text-darkOrange hover:bg-darkOrange/5 hoverEffect"
        >
          <span>{item?.icon}</span>
        </Link>
      ))}
    </div>
  );
};

export default SocialLinks;
