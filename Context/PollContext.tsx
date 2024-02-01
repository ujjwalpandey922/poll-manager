"use client";
import { createContext, useContext, useState } from "react";
export type QuestionProps = {
  question: string;
  options: string[];
};
type PollContextValue = {
  questions: { [key: string]: QuestionProps };
  currentQuestionKey: string | null;
  setCurrentQuestionKey: React.Dispatch<React.SetStateAction<string | null>>;
};
const PollContext = createContext<PollContextValue | null>(null);

export const PollContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [questions, setQuestions] = useState<{ [key: string]: QuestionProps }>({
    "1": {
      question: "How you feel today?",
      options: [
        "Brilliant! I have so much energy",
        "Always can be worse.",
        "Please, end my misery.",
      ],
    },
    "2": {
      question: "How you like the Opinary test?",
      options: [
        "It was great and so challenging.",
        "Not bad, but you can improve.",
        "It was a nightmare, never again.",
      ],
    },
  });

  const [currentQuestionKey, setCurrentQuestionKey] = useState<string | null>(
    null
  );

  const value: PollContextValue = {
    questions,
    currentQuestionKey,
    setCurrentQuestionKey,
  };
  return <PollContext.Provider value={value}>{children}</PollContext.Provider>;
};
export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error("usePoll must be used within a PollProvider");
  }
  return context;
};
