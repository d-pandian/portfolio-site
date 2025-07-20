"use client";
import React, { useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import { headerLinks } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNavButton = ({ showMenu, setShowMenu }: Props) => {
  return (
    <button
      onClick={() => setShowMenu(!showMenu)}
      className="flex md:hidden size-12 items-center justify-center self-center rounded-lg data-[hover]:bg-black/5 lg:hidden duration-300"
    >
      {showMenu ? (
        <X className="size-6 text-gray-950" />
      ) : (
        <Menu className="size-6 text-gray-950" />
      )}
    </button>
  );
};

export const MobileNav = ({ showMenu, setShowMenu }: Props) => {
  return (
    <div className="lg:hidden">
      {showMenu && (
        <div className="flex flex-col px-4">
          {headerLinks?.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{
                duration: 0.15,
                ease: "easeInOut",
                rotateX: { duration: 0.3, delay: index * 0.1 },
              }}
              key={item?.href}
              className="w-full flex flex-col space-y-2"
              onClick={() => setShowMenu(false)}
            >
              <Link
                href={item?.href}
                className="text-primary text-sm hover:text-darkOrange uppercase font-semibold bg-darkColor/5 w-full px-5 py-2.5"
              >
                {item?.label}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: "easeInOut",
              rotateX: { duration: 0.3, delay: 0.7 },
            }}
          ></motion.div>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  return (
    <div className="bg-white sticky top-0 z-50 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between gap-10 border-b border-b-darkColor/10 py-5">
        <Logo>Pandian</Logo>
        <div className="hidden md:inline-flex items-center gap-7 font-semibold text-sm tracking-wide">
          {headerLinks?.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`${
                pathname === href && "text-darkOrange"
              } relative group overflow-hidden hover:text-darkOrange hoverEffect`}
            >
              {label}
              <span
                className={`${
                  pathname === href && "translate-x-0"
                } block w-full h-px bg-darkOrange -translate-x-[110%] group-hover:translate-x-0 hoverEffect`}
              />
            </Link>
          ))}
        </div>

        <MobileNavButton showMenu={showMenu} setShowMenu={setShowMenu} />
      </Container>
      <MobileNav showMenu={showMenu} setShowMenu={setShowMenu} />
    </div>
  );
};

export default Header;
