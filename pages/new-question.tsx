import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import { useState, useContext } from "react";
import { supabase } from "../services/supabaseClient";
import { DolphinContext } from "../context/DolphinContext";
import { useRouter } from "next/router";
import NewQuestionForm from "../components/common/new-question-form";

export default function NewQuestion() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useContext(DolphinContext);
  const router = useRouter();

  async function handleSubmit() {
    if (!currentUser) router.push("/login");
    const result = await supabase
      .from("feed")
      .insert({
        title,
        content,
        author: currentUser.user_metadata.full_name,
      })
      .select();
    if (result.error) setError(result.error.message);
    else router.push("/");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <NewQuestionForm isQuestion={true} questionId={null} />
    </div>
  );
}
