import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth.jsx";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(
        "https://wohngluk-api.onrender.com/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Removed credentials: "include"
        }
      );

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data?.message || "Sign in failed"));
        return;
      }

      // Store the access_token in localStorage
      if (data?.access_token) {
        localStorage.setItem("accessToken", data.access_token);
      }

      // Dispatch user data (excluding the raw token if you prefer)
      const { access_token, ...userData } = data;
      dispatch(signInSuccess(userData));

      navigate("/");
      console.log("Sign in success:", userData);
    } catch (error) {
      dispatch(signInFailure(error.message || "An unexpected error occurred"));
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className=" font-semibold text-md text-white p-3 w-full bg-gray-700 p-3 rounded-lg border border-gray-300 shadow-md hover:shadow-lg  hover:bg-gray-500 active:scale-95"
        >
          {loading ? "Loading..." : "Sign in"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p> Dont Have an account?</p>
        <Link to="/sign-up" className="text-blue-700">
          Sign up
        </Link>
      </div>
      {error && <p className="text-red-800">{error}</p>}
    </div>
  );
};

export default SignIn;
