import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { User } from "lucide-react";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = localStorage.getItem("uName");
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    localStorage.removeItem("uName");
    navigate("/login");
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* PROFILE ICON */}
      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition">
        <User className="w-5 h-5 text-white" />
      </div>

      {/* HOVER BRIDGE (IMPORTANT) */}
      <div className="absolute right-0 top-full h-3 w-full" />

      {/* PROFILE CARD */}
      <div
        className={`absolute right-0 top-[calc(100%+12px)] w-48 rounded-xl bg-[#111] border border-gray-800 shadow-xl p-4 z-50 transition-all duration-150 ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <p className="text-sm text-gray-400">Signed in as</p>
        <p className="text-white font-medium truncate">{user}</p>

        <button
          onClick={handleLogout}
          className="mt-4 w-full text-sm py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;
