import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../context/sidebarSlice";
import Hamburger from "../icons/Hamburger";
import Cancel from "../icons/Cancel";
import Logout from "../icons/Logout";
import Dark from "../icons/Dark";
import Light from "../icons/Light";

const Navbar = () => {
  const open = useSelector((state) => state.sidebar.open);
  const dark = useSelector((state) => state.theme.isDark);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [results, setResults] = useState([]);

  return (
    <div className="fixed bg-white dark:bg-[#1E212A] top-0 left-0 right-0 z-10 h-14 shadow-md flex items-center justify-between px-4 md:px-20" data-testid="navbar-component">
      <div className="text-sm md:text-base font-bold text-purple-500 cursor-pointer flex items-center gap-4">
        <div onClick={() => dispatch(toggle())} className="transition-transform ease-linear duration-700 cursor-pointer">
          {!open ? <Hamburger /> : <Cancel />}
        </div>
        POPCORE
      </div>
      <div className="flex items-center gap-3">
        {dark ? <Light /> : <Dark />}
        <Logout />
        <div className="hidden md:flex items-center gap-5">
          <div
            className="cursor-pointer text-sm md:text-base dark:text-white"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </div>
          <img
            src={
              user?.profileImage ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFY677t7F_8Epm50xo5OfqI882l5OBOPKRDxDWeGo7OQ&s"
            }
            alt="profile"
            className="w-6 h-6 md:w-7 md:h-7 rounded-full cursor-pointer"
          />
        </div>
      </div>

      {results.length > 0 && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-[#1E212A] shadow-lg max-h-96 overflow-y-auto z-20">
          {results.map((result) => (
            <div key={result._id} className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold">{result.question}</h3>
              <p className="text-sm">{result.description}</p>
              <p className="text-xs text-gray-500">Tags: {result.tags.join(", ")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;

