import React, { useState } from "react";
import axios from "axios";
import Arrowup from "../icons/Arrowup";
import Arrowdown from "../icons/Arrowdown";
import UserInfo from "../components/UserInfo";

const discussionTopics = [
  "Netflix Hits",
  "What to Watch Next",
  "Behind the Scenes",
  "Fan Theories",
  "Character Analysis",
  "Show Reviews",
  "Show Comparisons",
  "Underrated Gems",
  "Romance",
  "Comedy",
  "Thriller / Mystery",
  "Action / Adventure",
  "Fantasy / SciFi",
  "Kdrama",
  "HBO Shows",
  "Netflix Originals",
  "Sitcoms",
  "Cdramas",
  "Jdramas",
  "Reality TV",
  "Reviews",
  "Movies",
];

const hexColorCodes = [
  "#FFA366", // Light Orange
  "#66FF99", // Light Green
  "#9966FF", // Light Purple
  "#FF6699", // Light Red
  "#66FFCC", // Light Aqua
  "#66CCFF", // Light Blue
  "#CC66FF", // Light Purple
  "#FF66CC", // Light Pink
  "#CCFF66", // Light Lime Green
  "#FFCC66", // Light Yellow-Orange
  "#CC66FF", // Light Purple
  "#66FF99", // Light Green
  "#99FF66", // Light Lime
  "#6699FF", // Light Blue
  "#FF6699", // Light Red-Pink
  "#9966FF", // Light Purple
  "#66FF99", // Light Green
  "#99FF66", // Light Lime
  "#FF9933", // Light Orange
  "#9966FF", // Light Purple
  "#66FFFF", // Light Cyan
  "#FFFF66", // Light Yellow
  "#66FFCC", // Light Aqua
  "#CCFF66", // Light Greenish Yellow
  "#FFCC66", // Light Orange-Yellow
  "#CC66FF", // Light Purple
];

const Explore = () => {
  const [posts, setPosts] = useState([]);

  const navigateToTopic = async (topic) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/find/${encodeURIComponent(topic)}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div className="bg-purple-100 py-5">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Select A Topic To Explore
        </h1>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {discussionTopics.map((topic, index) => (
            <div
              key={index}
              className={`flex items-center cursor-pointer gap-2 p-3 rounded-full ${
                posts.length > 0 ? "bg-purple-300" : "bg-white"
              } hover:bg-purple-200`}
              style={{ backgroundColor: hexColorCodes[index] }}
              onClick={() => navigateToTopic(topic)}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: hexColorCodes[index] }}
              ></div>
              <h3
                className={`text-xs ${
                  posts.length > 0 ? "text-black" : "text-gray-800"
                }`}
              >
                {topic}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-5xl mt-5">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="bg-white shadow-md rounded-lg mb-4">
              <div className="flex items-start gap-5 p-4 md:p-6">
                <div className="left-section space-y-1 text-center">
                  <Arrowup id={post._id} />
                  <h3 className="text-sm md:text-base">
                    {post?.upvote?.length || 0}
                  </h3>
                  <Arrowdown id={post._id} />
                </div>
                <div className="right-section w-full">
                  <h2 className="text-xl font-semibold mb-2">
                    {post?.question}
                  </h2>
                  <p className="text-gray-700">{post?.description}</p>
                  <hr />
                  <UserInfo question={post} />
                </div>
              </div>
              {post?.replies?.map((reply) => (
                <div
                  key={reply._id}
                  className="flex items-center gap-4 mt-4 p-4 md:p-6"
                >
                  <img
                    className="h-4 md:h-6 w-4 md:w-6"
                    src="https://cdn.icon-icons.com/icons2/2596/PNG/512/nested_arrows_icon_155086.png"
                    alt=""
                  />
                  <div className="bg-white max-w-xl p-4 rounded-lg shadow-md">
                    <p>{reply?.reply}</p>
                    <UserInfo answer={reply} />
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="bg-white shadow-md rounded-lg mb-4 p-6">
            <p className="text-center mt-4 mb-4">
              No posts available for this topic.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
