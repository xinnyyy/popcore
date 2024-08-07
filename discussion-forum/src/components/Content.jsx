import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Arrowup from "../icons/Arrowup";
import Arrowdown from "../icons/Arrowdown";
import UserInfo from "./UserInfo";
import Write from "../icons/Write";
import Send from "../icons/Send";
import Loading from "./Loading";
import NothingHere from "./NothingHere";
import { Toaster } from "react-hot-toast";
import newRequests from "../utils/newRequest";

const Content = () => {
  const { topic } = useParams();
  const [openId, setOpenId] = useState([]);
  const [answer, setAnswer] = useState("");

  const { isLoading, data = [], error } = useQuery("getAllQuestions", () => {
    const endpoint = topic 
      ? `${process.env.REACT_APP_BACKEND_URL}/find/${topic}`
      : `${process.env.REACT_APP_BACKEND_URL}/questions`;

    return newRequests
      .get(endpoint)
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
        return []; // Return an empty array on error
      });
  });

  if (isLoading) return <Loading />;
  if (error) return <NothingHere />;

  return (
    <div className="md:w-[60%] flex flex-col items-center gap-y-5 md:gap-8 my-8">
      <Toaster />
      {data.length > 0 ? (
        data.map((question, index) => (
          <div
            key={index}
            className="w-[96%] md:w-[80%] mx-12 flex flex-col items-end p-3 md:p-4 rounded-md bg-purple-100 dark:bg-slate-400"
          >
            <div className="w-full bg-white dark:bg-[#1E212A] p-4 md:p-5 rounded-lg shadow-md flex items-start gap-5">
              <div className="left-section space-y-1 text-center">
                <Arrowup id={question._id} />
                <h3 className="text-sm md:text-base">
                  {question?.upvote?.length || 0}
                </h3>
                <Arrowdown id={question._id} />
              </div>
              <div className="right-section w-full">
                <h1 className="text-base md:text-lg dark:text-white">
                  {question?.question}
                </h1>
                <p className="text-sm md:text-base">
                  {question?.description}
                </p>
                <hr />
                <UserInfo
                  openId={openId}
                  index={index + 1}
                  setOpenId={setOpenId}
                  question={question}
                />
              </div>
            </div>
            {/* nested comment */}
            {openId.includes(index + 1) && (
              <>
                {question?.replies?.map((answer, idx) => (
                  <div key={answer._id} className="flex items-center gap-4">
                    <img
                      className="h-4 md:h-6 w-4 md:w-6"
                      src="https://cdn.icon-icons.com/icons2/2596/PNG/512/nested_arrows_icon_155086.png"
                      alt=""
                    />
                    <div className="bg-white dark:bg-[#32353F] dark:text-white max-w-xl p-5 rounded-lg shadow-md flex flex-col items-start gap-5 mt-2">
                      <p className="text-inherit">{answer?.reply}</p>
                      <UserInfo answer={answer} />
                    </div>
                  </div>
                ))}
                <div className="w-full bg-white dark:bg-slate-900 flex items-center gap-4 px-5 py-2 rounded-lg shadow-md mt-2">
                  <Write />
                  <input
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full h-10 border-none outline-none rounded-md py-1 px-2"
                    type="text"
                    value={answer}
                    placeholder="Write a comment"
                  />
                  <Send
                    questionId={question._id}
                    answer={answer}
                    setAnswer={setAnswer}
                  />
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <NothingHere />
      )}
    </div>
  );
};

export default Content;


