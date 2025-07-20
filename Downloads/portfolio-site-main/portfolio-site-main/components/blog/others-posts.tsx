import React from "react";
import { image } from "@/sanity/image";
import dayjs from "dayjs";
import { GET_OTHERS_POSTS_QUERYResult } from "@/sanity/types";
import Link from "next/link";
import Container from "../Container";
import { Subheading } from "../text";

export const OtherPosts = async ({
  otherPosts,
}: {
  otherPosts: GET_OTHERS_POSTS_QUERYResult;
}) => {
  return (
    <Container>
      <div className="mb-10">
        <p className="text-xl font-semibold mb-5">You may also like</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {otherPosts?.map((item, index) => (
            <div key={index} className="relative group">
              <div className="overflow-hidden rounded-2xl">
                {item?.mainImage && (
                  <img
                    alt={item.mainImage.alt || ""}
                    src={image(item?.mainImage).size(2016, 1344).url()}
                    className="aspect-[3/2] w-full rounded-tr-2xl rounded-tl-2xl object-cover shadow-xl group-hover:scale-105 duration-500"
                  />
                )}
              </div>
              <div className="p-5 bg-gray-100 rounded-br-2xl rounded-bl-2xl">
                {item.slug && (
                  <Link href={`/blog/${item.slug.current}`}>
                    <span className="absolute inset-0" />
                    <p className="text-sm font-semibold mb-2 line-clamp-1">
                      {item.title}
                    </p>
                  </Link>
                )}
                <div className="flex items-center justify-between">
                  {item.author && (
                    <div className="flex items-center gap-3">
                      {item.author.image && (
                        <img
                          alt=""
                          src={image(item.author.image).size(64, 64).url()}
                          className="aspect-square size-6 rounded-full object-cover"
                        />
                      )}
                      <div className="text-sm text-gray-700">
                        {item.author.name}
                      </div>
                    </div>
                  )}
                  <Subheading>
                    {dayjs(item.publishedAt).format("dddd, MMMM D, YYYY")}
                  </Subheading>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
