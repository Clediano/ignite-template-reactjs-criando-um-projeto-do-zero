/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { GetStaticProps } from 'next';
import * as prismicH from '@prismicio/helpers';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Post from './post/[slug]';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    setPosts(postsPagination.results);
    setNextPage(postsPagination.next_page);
  }, [postsPagination]);

  function handleLoadMorePosts(): void {
    const params = new URLSearchParams(nextPage);

    const accessToken = params.get('access_token');

    fetch(nextPage)
      .then(response => response.json())
      .then(json => {
        const newPosts = json.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: format(
              new Date(post.first_publication_date),
              'PP',
              {
                locale: ptBR,
              }
            ),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });

        setNextPage(
          json.next_page
            ? `${json.next_page}&access_token=${accessToken}`
            : null
        );
        setPosts([...posts, ...newPosts]);
      });
  }

  return (
    <>
      <Head>
        <title>Spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => {
            return (
              <Link href={`/post/${post.uid}`} key={post.uid}>
                <a>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div>
                    <time>
                      <FiCalendar />
                      <span>{post.first_publication_date}</span>
                    </time>
                    <div>
                      <FiUser />
                      <span>{post.data.author}</span>
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
        <div className={styles.loadMorePosts}>
          {nextPage && (
            <button onClick={handleLoadMorePosts}>
              <strong>Carregar mais posts</strong>
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = getPrismicClient({ previewData });

  const response = await client.getByType('posts', {
    pageSize: 1,
  });

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'PP',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: `${response.next_page}&access_token=${process.env.PRISMIC_ACCESS_TOKEN}`,
        results: posts,
      },
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
