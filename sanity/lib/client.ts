import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-10-01",
  useCdn: true,
});

export const clientFetch = async ({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, any>;
}) => {
  return await client.fetch(query, params);
};
