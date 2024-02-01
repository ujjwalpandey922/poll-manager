"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type PollProps = {
  question: string;
  options: string[];
  id: string | string[];
};

const Poll: React.FC<PollProps> = ({ question, options, id }) => {
  // State to manage the selected option
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // State to manage the votes
  const [votes, setVotes] = useState<number[]>(
    () =>
      JSON.parse(localStorage.getItem(`poll_${id}`) || "[]") ||
      Array(options.length).fill(0)
  );

  // Function to handle voting
  const handleVote = () => {
    if (selectedOption !== null) {
      const newVotes = [...votes];
      newVotes[selectedOption] = (newVotes[selectedOption] ?? 0) + 1;
      setVotes(newVotes);
      localStorage.setItem(`poll_${id}`, JSON.stringify(newVotes));
    } else {
      // Show a warning if no option is selected
      toast.warning("Select Any Option First...");
    }
  };

  // Effect to update votes from local storage
  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem(`poll_${id}`) || "[]");
    setVotes(
      storedVotes === "[]" ? Array(options.length).fill(0) : storedVotes
    );
  }, [id, options.length]);

  // Framer Motion variants for animation
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

  // Function to calculate percentage based on count
  const countPercentage = (count: number) => {
    let Percentage;
    let sumOfAllVotes = votes.reduce((acc, vote) => (acc += vote), 0);
    Percentage = (count / sumOfAllVotes) * 100;
    return Percentage.toFixed(0);
  };

  return (
    <div className="max-w-[80rem] bg-slate-800 min-h-[88vh] border-b-2 border-b-sky-500 flex flex-col justify-start gap-8 text-white mx-auto p-4">
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{
          type: "spring",
          duration: 1,
          ease: "easeOut",
          delay: 0.5,
        }}
        className="flex flex-col gap-8 justify-start items-center"
      >
        <h3 className="font-bold text-3xl">Q. {question}</h3>
        <form className="flex flex-col gap-4 p-4 max-w-[400px]  w-full ">
          {options?.map((option, index) => (
            <div key={index} className="hover:scale-105 transition-all ">
              <label
                className={`cursor-pointer text-xl  ${
                  selectedOption === index ? "text-sky-700 font-extrabold" : ""
                }`}
              >
                <input
                  type="radio"
                  name={`poll_${id}`}
                  value={index}
                  className="hidden"
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                />
                {option}
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={handleVote}
            className="inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-center text-white  rounded-lg focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 "
          >
            Vote
          </button>
        </form>
      </motion.div>
     {votes.length>0 && <div className=" w-full ">
        <div className="p-4 max-w-[40rem] mx-auto rounded-2xl shadow-lg bg-neutral-900">
          <h2 className="font-bold text-2xl mb-4 text-center"> Result...!!!</h2>
          {votes?.map((count, index) => (
            <div key={index} className="flex flex-col gap-2 mt-6">
              <span className="font-2xl font-bold">
                {" "}
                {options[index]} : {count}
              </span>
              <div className="w-full bg-gray-200 rounded-md dark:bg-gray-700">
                <div
                  className="bg-blue-600 text-lg font-medium text-blue-100 text-center p-0.5 leading-none rounded-sm"
                  style={{ width: countPercentage(count) + "%" }}
                >
                  {" "}
                  {countPercentage(count)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
};

export default Poll;
