import { Categories } from "@/components/blog/categories";
import { image } from "@/sanity/image";
import { getCategoryPost } from "@/sanity/queries";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import { ChevronRightIcon, FileX2 } from "lucide-react";
import Image from "next/image";
import Container from "@/components/Container";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const posts = await getCategoryPost(slug);

  return (
    <div>
      <Container>
        <div className="py-10 flex items-start gap-10">
          <Categories noFeed={true} currentCategory={slug} />
          <div className="flex-1">
            {posts?.length > 0 ? (
              <div>
                <h2 className="font-medium text-lg">
                  All post by{" "}
                  <span className="font-semibold capitalize underline underline-offset-2 decoration-[1px]">
                    {slug}
                  </span>{" "}
                  Category
                </h2>
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
                            <Image
                              alt=""
                              src={image(post.author.image)
                                .width(64)
                                .height(64)
                                .url()}
                              width={100}
                              height={100}
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
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <FileX2
                    className="h-10 w-10 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No posts found
                </h2>
                <p className="text-muted-foreground mb-4">
                  It seems there are no posts available for{" "}
                  <span className="font-semibold capitalize underline underline-offset-2 decoration-[1px]">
                    {slug}
                  </span>{" "}
                  category.
                </p>
                <Link href="/">Back to Home</Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
