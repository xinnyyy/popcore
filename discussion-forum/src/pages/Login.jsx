import axios from "axios";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import popcornBackground from "../assets/popcorn.jpeg"; // Import the background image

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = e.target;

    const user = {
      email: email.value,
      password: password.value,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        user
      );
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/");
        toast.success("Logged in successfully");
      } else {
        toast.error("User does not exist");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      toast.error("Something went wrong, please try again!");
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${popcornBackground})`, // Use the imported background image
      }}
    >
      <Toaster />
      <div
        className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0"
      >
        <div
          className="w-[90%] md:w-full bg-[#F8F0E1] dark:bg-[#F8F0E1] border px-10 py-10 mt-5 overflow-hidden shadow-md sm:max-w-md rounded-lg"
        >
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-purple-950 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                className="border border-[#F8F0E1] dark:border-[#F8F0E1] mt-2 w-full h-10 px-3 rounded outline-none shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-purple-950 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                className="border border-[#F8F0E1] dark:border-[#F8F0E1] mt-2 w-full h-10 px-3 rounded outline-none shadow-sm"
              />
            </div>
            <div className="mt-8 flex flex-col items-center justify-center">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-purple-950 border border-transparent rounded-md active:bg-gray-900 false"
              >
                Login
              </button>
              <a
                className="text-sm text-purple-950 dark:text-purple-950 underline hover:text-gray-900 pt-2"
                href="/register"
              >
                Don't have an account? Register
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
