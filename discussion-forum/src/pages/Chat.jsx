import React, { useEffect, useState } from "react";
import Write from "../icons/Write";
import moment from "moment";
import { socket } from "../App";
import { useSelector } from "react-redux";

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

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState("Netflix Hits");
  const onlineUsers = useSelector((state) => state.online.onlineUsers);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);

    if (currentUser) {
      socket.auth = { user: currentUser };
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected");
        socket.emit("join-room", { room, user: currentUser });
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socket.on("receive-message", ({ message, room: msgRoom, user, createdAt }) => {
        if (msgRoom === room) {
          setMessages((prevMessages) => {
            const updatedMessages = {
              ...prevMessages,
              [msgRoom]: [...(prevMessages[msgRoom] || []), { message, user, createdAt }],
            };
            localStorage.setItem("messages", JSON.stringify(updatedMessages));
            return updatedMessages;
          });
        }
      });

      // Initial load from localStorage if available
      const storedMessages = JSON.parse(localStorage.getItem("messages"));
      if (storedMessages) {
        setMessages(storedMessages);
      }
    }

    return () => {
      // Disconnect socket only when component unmounts
      socket.disconnect();
    };
  }, [room]);

  const handleClick = () => {
    if (message.trim()) {
      socket.emit("send-message", {
        message,
        room,
        user,
      });
      setMessage("");
    }
  };

  const handleRoomChange = (newRoom) => {
    setRoom(newRoom);
    socket.emit("join-room", { room: newRoom, user });
  };

  return (
    <div className="h-full overflow-y-hidden w-full md:w-[60%] flex flex-col items-center gap-4 mt-8">
      <div className="w-full md:w-[80%] text-sm md:text-base flex justify-between items-center dark:text-white">
        <h1 className="flex gap-4 text-sm md:text-base text-inherit">
          Online Users
          <span className="text-purple-600 text-sm flex gap-2">
            {onlineUsers.map((user) => (
              <img
                key={user._id}
                alt="profile"
                className="rounded-full h-6 md:h-8 w-6 md:w-8 bg-purple-100 flex items-center justify-center gap-2"
                src={user.profileImage}
              />
            ))}
          </span>
        </h1>
        <h1 className=" text-sm md:text-base text-inherit">
          {onlineUsers.length ? onlineUsers.length : 0}
        </h1>
      </div>

      <div className="w-full md:w-[80%] flex justify-center">
        <select
          value={room}
          onChange={(e) => handleRoomChange(e.target.value)}
          className="border p-2 rounded-md"
        >
          {discussionTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full relative border-2 overflow-y-scroll p-3 px-2 md:p-4 rounded-md md:w-[80%] h-[90%] md:h-[80%] flex flex-col">
        {(messages[room] || []).map((msg, index) => (
          <div key={index} className={`w-max mb-2 ${user?._id === msg.user._id ? "ml-auto" : ""}`}>
            <div className={"text-sm md:text-base text-white bg-purple-400 py-2 px-3 rounded-md " + (user?._id === msg.user._id ? "bg-purple-600" : "")}>
              {msg.message}
            </div>
            <span className="text-xs text-gray-500">
              {msg.user._id === user?._id ? "(You) " : msg.user.name + " "}
              {moment(msg.createdAt).fromNow()}
            </span>
          </div>
        ))}

        <div className="w-full mt-auto bg-purple-600 dark:bg-slate-900 flex items-center gap-2 px-2 md:px-5 py-1 md:py-2 rounded-lg shadow-md">
          <Write />
          <div className="flex-grow w-full">
            <input
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-8 border-none outline-none rounded-md py-1 px-2"
              type="text"
              value={message}
              placeholder="Write a comment"
            />
          </div>
          <svg
            onClick={handleClick}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-white cursor-pointer hover:scale-110 hover:translate-x-1 hover:transform transition-all duration-300"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Chat;
