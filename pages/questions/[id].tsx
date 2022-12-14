import Link from "next/link";
import Head from "next/head";
import { remark } from "remark";
import html from "remark-html";
import { supabase } from "../../services/supabaseClient";
import sanitizeHtml from "sanitize-html";
import NewQuestionForm from "../../components/common/new-question-form";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

// Use get server side props because we need to run this dynamically
export async function getServerSideProps({ params }) {
  let { data, error, status } = await supabase
    .from("questions")
    .select("*")
    .eq("id", Number(params.id));
  const questionData = data[0];

  // Here we also sneek in markdown proccesing since we need
  // to do it on server side (this function runs server-side
  // as opposed to client-side)
  const processedContent = await remark()
    .use(html)
    .process(questionData.content);
  const questionHtml = sanitizeHtml(processedContent.toString());

  const answerData = await supabase
    .from("answers")
    .select("*")
    .eq("questionId", Number(params.id));
  const answerPromises = answerData.data.map(async (answer) => {
    const processedContent = await remark().use(html).process(answer.content);
    const contentHtml = sanitizeHtml(processedContent.toString());
    return contentHtml;
  });
  const answerHtml = await Promise.all(answerPromises);
  return {
    props: {
      questionData,
      questionHtml,
      answerData: answerData.data,
      answerHtml,
    },
  };
}

export default function Question({
  questionData,
  questionHtml,
  answerData,
  answerHtml,
}) {
  return (
    <>
      <Head>
        <title>{questionData.title}</title>
      </Head>
      <h1>{questionData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: questionHtml }} />
      <h1>Atbildes</h1>
      <Stack direction="column" spacing={3}>
        {answerHtml.map((html: string, index: number) => (
          <div key={index}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <p>{answerData[index].author}</p>
          </div>
        ))}
        <NewQuestionForm isQuestion={false} questionId={questionData.id} />
      </Stack>
    </>
  );
}
