import Link from 'next/link';
import { AppProps } from 'next/app';
import { PrismicProvider } from '@prismicio/react';
import { PrismicPreview } from '@prismicio/next';

import Head from 'next/head';
import Header from '../components/Header';
import { linkResolver, repositoryName } from '../services/prismic';

import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <PrismicProvider
      linkResolver={linkResolver}
      internalLinkComponent={({ href, children, ...props }) => (
        <Link href={href}>
          <a {...props}>{children}</a>
        </Link>
      )}
    >
      <PrismicPreview repositoryName={repositoryName}>
        <Head>
          <title>Spacetraveling</title>
        </Head>
        <Header />
        <Component {...pageProps} />
      </PrismicPreview>
    </PrismicProvider>
  );
}

export default MyApp;
