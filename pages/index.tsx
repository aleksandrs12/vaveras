// Home Component - root component of the app

import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import Post from "../components/post/post";
import { DolphinContext } from "../context/DolphinContext";
import { supabase } from "../services/supabaseClient";
import { useRouter } from "next/router";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const { currentUser } = useContext(DolphinContext);
  const router = useRouter();

  function signOut() {
    supabase.auth.signOut();
    router.push("/");
  }

  // @ts-ignore
  const fetcher = (...args: any) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR("api/get-posts", fetcher, {
    refreshInterval: 200,
  });
  useEffect(() => {
    if (!data) return;
    setPosts(data.data);
  }, [data]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Vaver[a]s - Kur Skolēni Atbalsta, Mācās, Dalās</title>
        <meta name="description" content="Sveika pasaule" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.header}>
        <h1>Question feed</h1>
        <Button
          onClick={() => router.push("/new-question")}
          variant="contained"
        >
          Uzdot jautājumu
        </Button>
      </div>
      {currentUser ? (
        <>
          <p>Hello {currentUser.user_metadata.full_name}</p>
          <button onClick={signOut}>logout</button>
        </>
      ) : (
        <Link href="/login">please login</Link>
      )}

      <Stack direction="column" spacing={3}>
        {posts.map((post, index) => {
          // @ts-ignore
          if (Math.floor(index / 5 + 1) == page)
            return <Post key={index} data={post} />;
          return <div key={index} />;
        })}
      </Stack>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Pagination
          count={Math.floor(posts.length / 5) + 1}
          onChange={(e, page) => setPage(page)}
          color="primary"
        />
      </div>
    </div>
  );
}
