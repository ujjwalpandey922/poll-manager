"use client";
import Poll from "@/Components/Poll";
import { usePoll } from "@/Context/PollContext";

const PollPage = ({ params: { id } }: { params: { id: string } }) => {
  const { questions  } = usePoll();
  const currentQuestion = questions[id as string];

  if (!currentQuestion) {
    return <div>Invalid poll ID</div>;
  }

  return <Poll {...currentQuestion} id={id as string} />;
};

export default PollPage;
