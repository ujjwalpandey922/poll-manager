"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { toast } from "sonner";
import { usePoll } from "@/Context/PollContext";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";

const Home = () => {
  // Fetching necessary data and methods from the PollContext
  const { questions, setCurrentQuestionKey, currentQuestionKey } = usePoll();

  // Local state for managing the question and options
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);

  // Router for navigation
  const router = useRouter();

  // Handler to update the value of an option
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  // Function to add a new option
  const addOption = () => {
    // Checking if a question is present before adding options
    if (!question) {
      toast.warning("Enter Question First");
      return;
    }

    // Checking if the previous option is empty before adding a new one
    if (!options.at(-1) && options.length >= 1) {
      toast.warning("Options Can Not Be Empty...");
      return;
    }

    // Adding a new empty option
    setOptions([...options, ""]);
  };

  // Function to delete an option
  const deleteOption = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  // Function to handle the form submission
  const handleSubmit = () => {
    // Checking if all options are filled before submitting
    if (options.some((str: string) => str.trim() === "")) {
      toast.warning("Again All options Must be filled");
      return;
    }

    // Generating a new key for the question
    const newQuestionKey = String(Object.keys(questions).length + 1);

    // Setting the current question key in the context
    setCurrentQuestionKey(newQuestionKey);

    // Adding the new question to the context
    questions[newQuestionKey] = {
      question: question,
      options: options,
    };

    // Navigating to the poll page for the new question
    router.push(`/polls/${newQuestionKey}`);
  };

  // Variants for animation
  const variants = {
    hidden: {
      x: 0,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-[88vh]  relative flex gap-8 p-4 flex-wrap justify-center py-8">
      <motion.div
        variants={variants}
        initial="hidden"
        viewport={{ amount: 0 }}
        animate="visible"
        transition={{
          type: "spring",
          duration: 1,
          ease: "easeOut",
          delay: 1,
        }}
        className="container max-w-max"
      >
        {/* Heading */}
        <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white my-6 pb-10">
          Welcome To Poll Manager{" "}
        </h2>

        {/* Form */}
        <form className="max-w-lg mx-auto">
          {/* Question Input */}
          <div className="mb-4">
            <label
              htmlFor="question"
              className="block mb-2 text-lg font-medium text-white"
            >
              Write Your Question...
            </label>
            <input
              type="text"
              id="question"
              placeholder="Enter What You Wanna Ask!!!!!!"
              className=" border   text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 "
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Options Input */}
          {options.length >= 1 && (
            <span className="block mb-2 text-lg font-medium text-white">
              Write All Options...
            </span>
          )}
          {options.map((option, index) => (
            <div key={index} className="mb-2 flex justify-center items-center">
              {/* Option Input */}
              <input
                type="text"
                className=" border   text-sm rounded-lg  focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 "
                value={option}
                placeholder={`Enter Option ${index + 1}`}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />

              {/* Delete Option Icon */}
              <MdOutlineDelete
                onClick={() => deleteOption(index)}
                data-testid="delete-option"
                className="hover:scale-105 transition-all cursor-pointer text-4xl text-red-300 hover:text-rose-600"
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="flex gap-4">
            {/* Add Option Button */}
            <Button
              type="button"
              id="add-options"
              className="bg-green-500 hover:bg-green-800 text-white p-2 rounded-md"
              onClick={addOption}
            >
              Add Option
            </Button>

            {/* Submit Button */}
            {options.length >= 2 && (
              <Button
                type="button"
                id="submit-poll"
                className="bg-sky-500 hover:bg-sky-800 text-white p-2 rounded-md"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Poll List Button */}
      <Button
        onClick={() => router.push(`/pollslist`)}
        className="absolute top-4 right-4 hover:scale-110 transition-all"
      >
        Poll List
      </Button>
    </div>
  );
};

export default Home;
