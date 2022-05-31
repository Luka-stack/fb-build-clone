import { getSession } from 'next-auth/react';
import Head from 'next/head';

import Header from '../components/header';
import LogIn from '../components/login';
import Sidebar from '../components/sidebar';
import Feed from '../components/feed';
import Widgets from '../components/widgets';
import { db } from '../firebase';

export default function Home({ session, posts }) {
  if (!session) return <LogIn />;

  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <Head>
        <title>Facebook</title>
      </Head>

      <Header />

      <main className="flex">
        <Sidebar />
        <Feed posts={posts} />
        <Widgets />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Get the user
  const session = await getSession(context);

  const posts = await db.collection('posts').orderBy('timestamp', 'desc').get();

  posts.docs.map((post) => console.log(post.data()));

  const docs = posts.docs.map((post) => ({
    id: post.id,
    ...post.data(),
    timestamp: null,
  }));

  return {
    props: {
      session,
      posts: docs,
    },
  };
}
