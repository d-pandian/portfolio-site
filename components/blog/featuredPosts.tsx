import { getFeaturedPosts } from "@/sanity/queries";
import React from "react";

import Link from "next/link";
import dayjs from "dayjs";
import Container from "../Container";
import { image } from "@/sanity/image";

export const FeaturedPosts = async () => {
  const featuredPosts = await getFeaturedPosts(3);
  if (featuredPosts?.length === 0) {
    return;
  }

  return (
    <div className="mt-10 bg-gradient-to-t from-gray-200 pb-14">
      <Container>
        <h2 className="text-2xl font-semibold tracking-wide">
          My Featured Blog
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <div
              key={post.slug}
              className="relative flex flex-col rounded-3xl bg-white p-2 shadow-md shadow-black/5 ring-1 ring-black/5 group"
            >
              <div className=" overflow-hidden rounded-2xl">
                {post.mainImage && (
                  <img
                    alt={post.mainImage.alt || ""}
                    src={image(post.mainImage).size(1170, 780).url()}
                    className="aspect-[3/2] w-full rounded-2xl object-cover group-hover:scale-110 duration-500"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-8">
                <div className="text-sm/5 text-gray-700">
                  {dayjs(post.publishedAt).format("dddd, MMMM D, YYYY")}
                </div>
                <div className="mt-2 text-base/7 font-medium">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </div>
                <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                  {post?.excerpt}
                </div>
                {post.author && (
                  <div className="mt-6 flex items-center gap-3">
                    {post.author.image && (
                      <img
                        alt=""
                        src={image(post.author.image).size(64, 64).url()}
                        className="aspect-square size-6 rounded-full object-cover"
                      />
                    )}
                    <div className="text-sm/5 text-gray-700">
                      {post.author.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
