import { supabase } from "../services/supabaseClient";
import { useState } from "react";
import styles from "../styles/Login.module.css";

export default function Login() {
  const signInWithGoogle = async () => {
    try {
      const response = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>This is the login page</h1>
      <button className={styles.container} onClick={signInWithGoogle}>
        Sign in with google
      </button>
    </div>
  );
}