"use client";
import { QuestionProps, usePoll } from "@/Context/PollContext";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const PollsList = () => {
  const { questions } = usePoll();
  const variants = {
    hidden: {
      x: -100,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
    },
  };
  return (
    <div className="flex max-w-[80rem] mx-auto p-4 flex-wrap gap-8 bg-slate-800 h-[88vh] border-b-2 border-b-sky-500">
      {Object.values(questions)?.map(
        (question: QuestionProps, index: number) => (
          <div
            key={index + 1}
            className="hover:scale-105 hover:shadow-sky-500 max-w-sm max-h-[12rem] shadow-lg transition-all my-8"
          >
            <motion.div
              variants={variants}
              initial="hidden"
              viewport={{ amount: 0 }}
              animate="visible"
              transition={{
                type: "spring",
                duration: 1,
                ease: "easeOut",
                delay: (index + 1) * 0.5,
              }}
              className="max-w-sm p-6 h-full flex flex-col justify-between border  rounded-lg shadow bg-gray-800 border-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-justify text-white">
                {index + 1}. {question.question}
              </h5>

              <Link
                href={`/polls/${index + 1}`}
                className="inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-center text-white  rounded-lg focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 focus:ring-blue-800  "
              >
                Vote
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        )
      )}
    </div>
  );
};

export default PollsList;
