import { Categories } from "@/components/blog/categories";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { image } from "@/sanity/image";
import { getAllPosts } from "@/sanity/queries";
import dayjs from "dayjs";
import { ArrowDown, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const BlogPage = async () => {
  const posts = await getAllPosts(10);
  return (
    <div>
      <section className="py-20 md:py-32 bg-gradient-to-r from-darkOrange to-darkBlue text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Learn More About LifeStyle
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
              culpa nulla iure, ad amet.
            </p>
            <Button size="lg" variant="secondary">
              Explore My Blogs
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>
      <Container>
        <Container className="mt-16 pb-24 lg:px-10">
          <Categories />
          {posts?.length === 0 ? (
            <div>no post</div>
          ) : (
            <div className="mt-6">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="relative grid grid-cols-1 border-b border-b-gray-100 py-10 first:border-t first:border-t-gray-200 max-sm:gap-3 sm:grid-cols-3"
                >
                  <div>
                    <div className="text-sm/5 max-sm:text-gray-700 sm:font-medium">
                      {dayjs(post.publishedAt).format("dddd, MMMM D, YYYY")}
                    </div>
                    {post.author && (
                      <div className="mt-2.5 flex items-center gap-3">
                        {post.author.image && (
                          <img
                            alt=""
                            src={image(post.author.image)
                              .width(64)
                              .height(64)
                              .url()}
                            className="aspect-square size-6 rounded-full object-cover"
                          />
                        )}
                        <div className="text-sm/5 text-gray-700">
                          {post.author.name}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2 sm:max-w-2xl">
                    <h2 className="text-sm/5 font-medium">{post.title}</h2>
                    <p className="mt-3 text-sm/6 text-gray-500">
                      {post.excerpt}
                    </p>
                    <div className="mt-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-1 text-sm/5 font-medium"
                      >
                        <span className="absolute inset-0" />
                        Read more
                        <ChevronRightIcon className="size-4 fill-gray-400" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </Container>
    </div>
  );
};

export default BlogPage;
