import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

const isDevelopment = process.env.NODE_ENV === "development";
const developerToken = process.env.SANITY_API_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: isDevelopment ? false : true,
  token: developerToken,
});

export const clientFetch = <const QueryString extends string>({
  query,
  params = {},
  // revalidate = 10,
  tags = [],
}: {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}) => {
  return client.fetch(query, params, {
    next: {
      // revalidate: isDevelopment || tags.length ? false : revalidate,
      revalidate: 0,
      tags,
    },
  });
};
