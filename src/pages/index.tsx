import { GetStaticProps } from 'next';
import * as prismicH from '@prismicio/helpers';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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
  console.log(postsPagination);
  return (
    <>
      <h1>POSTS</h1>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = getPrismicClient({ previewData });

  const response = await client.getByType('posts', {
    pageSize: 2,
  });

  const posts = response.results.map(post => {
    return {
      id: post.id,
      slug: post.uid,
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
      date: format(new Date(post.last_publication_date), 'PP', {
        locale: ptBR,
      }),
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: posts,
      },
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
