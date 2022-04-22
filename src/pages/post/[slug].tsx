import { GetStaticPaths, GetStaticProps } from 'next';

import Head from 'next/head';
import { RTNode } from '@prismicio/types';
import * as prismicH from '@prismicio/helpers';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { PrismicRichText, PrismicText } from '@prismicio/react';
import { getPrismicClient, linkResolver } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: [RTNode];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  function calculeReadTime(): number {
    // const cont =
    //   String(post.data.content.body)
    //     .replace(/(\r\n|\n|\r)/g, ' ')
    //     .trim()
    //     .split(/\s+/g).length - 1;

    return Math.ceil(200 / 200);
  }
  console.log(post);
  return (
    <>
      <Head>
        <title>Spacetraveling | {post.data.title}</title>
      </Head>

      <img className={styles.banner} src={post.data.banner.url} alt="banner" />

      <main className={styles.container}>
        <div className={styles.heading}>
          <h1>{post.data.title}</h1>
          <div>
            <div>
              <FiCalendar />
              <span>{post.first_publication_date}</span>
            </div>
            <div>
              <FiUser />
              <span>{post.data.author}</span>
            </div>
            <div>
              <FiClock />
              <span>{calculeReadTime()}</span>
            </div>
          </div>
        </div>
        <div className={styles.post}>
          {/* {post.data.content} */}
          <PrismicText field={post.data.content} />
          <p>------------------------------------------</p>
          <p>------------------------------------------</p>
          <p>------------------------------------------</p>
          <p>------------------------------------------</p>
          <p>------------------------------------------</p>
          <PrismicRichText field={post.data.content} />
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.getAllByType('posts');

  return {
    paths: posts.map(post => prismicH.asLink(post, linkResolver)),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const { first_publication_date, data } = await prismic.getByUID(
    'posts',
    String(slug)
  );

  return {
    props: {
      post: {
        first_publication_date: format(new Date(first_publication_date), 'PP', {
          locale: ptBR,
        }),
        data: {
          title: data?.title,
          banner: {
            url: data?.banner.url,
          },
          author: data?.author,
          content: data?.content,
        },
      },
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
