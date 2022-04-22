import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';

import sm from '../../sm.json';

export const endpoint = sm.apiEndpoint;
export const repositoryName = prismic.getRepositoryName(endpoint);

export function linkResolver(doc): string {
  switch (doc.type) {
    case 'posts':
      return `/post/${doc.uid}`;
    default:
      return null;
  }
}

export function getPrismicClient(config: any = {}): prismic.Client {
  const client = prismic.createClient(endpoint, {
    ...config,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
}
