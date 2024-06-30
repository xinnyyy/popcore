import React, { useState } from "react";

const Write = ({ onSubmit, placeholder }) => {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyText.trim() === "") {
      return; 
    }
    onSubmit(replyText); 
    setReplyText(""); 
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-purple-500"
      />
      <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600">
        Submit
      </button>
    </form>
  );
};

export default Write;
