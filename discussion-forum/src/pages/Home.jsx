import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SyncLoader from "react-spinners/SyncLoader";
import Arrowup from "../icons/Arrowup";
import Arrowdown from "../icons/Arrowdown";
import UserInfo from "../components/UserInfo";
import Comment from "../icons/Comment"; // Import the Comment icon here
import Write from "../components/Write"; // Import the Write component


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openReplyIndex, setOpenReplyIndex] = useState(null); // State to track open reply section

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/questions`);
        setPosts(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCommentSubmit = async (replyText, postId) => {
    try {
      console.log('Submitting comment:', replyText, postId); // Log to check values are correct
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/comments`, {
        replyText,
        postId,
    });
      console.log('Comment submitted successfully:', response.data);
      // Refresh posts after submission if needed
      // fetchPosts(); // Uncomment this if you need to refresh posts after comment submission
    } catch (error) {
      console.error('Error submitting comment:', error);
      console.log('Error response:', error.response); // Log the detailed error response
    }
  };

  const handleReplyToggle = (index) => {
    setOpenReplyIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <SyncLoader size={10} color="#7E22CE" />
      </div>
    );
  }

  return (
    <div className="bg-purple-100 py-5">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-4 text-center">All Posts</h1>
        {posts.map((post, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg mb-4">
            <div className="flex items-start gap-5 p-4 md:p-6">
              <div className="left-section space-y-1 text-center">
                <Arrowup id={post._id} />
                <h3 className="text-sm md:text-base">
                  {post?.upvote?.length || 0}
                </h3>
                <Arrowdown id={post._id} />
              </div>
              <div className="right-section w-full">
                <h2 className="text-xl font-semibold mb-2">{post?.question}</h2>
                <p className="text-gray-700">{post?.description}</p>
                <hr />
                <UserInfo question={post} />
              </div>
            </div>
            {/* Toggle reply section */}
            <div className="flex items-center gap-2 p-4 md:p-6">
              <Comment
                className="h-4 md:h-6 w-4 md:w-6 cursor-pointer"
                onClick={() => handleReplyToggle(index)}
              />
              <span
                className="text-gray-300 text-xs cursor-pointer"
                onClick={() => handleReplyToggle(index)} // Ensure onClick is added here as well
              >
                Reply
              </span>
            </div>
            {/* Write component for replying */}
            {openReplyIndex === index && (
               <div className="w-full mt-4 p-4 md:p-6 bg-white rounded-lg shadow-md">
                <Write
                  onSubmit={(replyText) => handleCommentSubmit(replyText, post._id)}
                  placeholder="Type your reply here..."
                />
              </div>
            )}
            {/* Nested replies */}
            {post?.replies?.map((reply, replyIndex) => (
              <div key={reply._id} className="flex items-center gap-4 mt-4 p-4 md:p-6">
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
        ))}
      </div>
    </div>
  );
};

export default Home;
