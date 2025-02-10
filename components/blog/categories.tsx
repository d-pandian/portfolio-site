import { getCategories } from "@/sanity/queries";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";
import React from "react";
import { CheckIcon, ChevronsUpDown, RssIcon } from "lucide-react";

export const Categories = async ({
  noFeed,
  currentCategory,
}: {
  noFeed?: boolean;
  currentCategory?: string;
}) => {
  const categories = await getCategories();

  if (categories.length === 0) {
    return;
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Menu>
        <MenuButton className="flex items-center justify-between gap-2 font-medium">
          {currentCategory ? currentCategory : "All categories"}
          <ChevronsUpDown className="size-4 fill-slate-900" />
        </MenuButton>
        <MenuItems
          anchor="bottom start"
          className="min-w-40 rounded-lg bg-white p-1 shadow-lg ring-1 ring-gray-200 [--anchor-gap:6px] [--anchor-offset:-4px] [--anchor-padding:10px]"
        >
          <MenuItem>
            <Link
              href="/"
              className="group grid grid-cols-[1rem,1fr] items-center gap-2 rounded-md px-2 py-1 data-[focus]:bg-gray-950/5"
            >
              <CheckIcon className="hidden size-4 group-data-[selected]:block" />
              <p className="col-start-2 text-sm/6">All categories</p>
            </Link>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                className="group grid grid-cols-[16px,1fr] items-center gap-2 rounded-md px-2 py-1 data-[focus]:bg-gray-950/5"
              >
                <CheckIcon className="hidden size-4 group-data-[selected]:block" />
                <p className="col-start-2 text-sm/6">{category.title}</p>
              </Link>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
      {!noFeed && (
        <div className="gap-1 flex items-center">
          <RssIcon className="size-4" />
          <span className="text-sm font-semibold">My Blog Post</span>
        </div>
      )}
    </div>
  );
};
