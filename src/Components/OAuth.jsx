import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice.js";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const proviter = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, proviter);

      const res = await fetch(
        "https://wohngluk-api.onrender.com/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        }
      );

      const data = await res.json();
      console.log("data from google", data);

      // Store the access_token in sessionStorage
      if (data?.access_token) {
        sessionStorage.setItem("accessToken", data.access_token);
      }

      // Dispatch the user data (without the token if you prefer to keep it separate in Redux)
      const { access_token, ...userData } = data; // Separate token from user data
      dispatch(signInSuccess(userData));

      navigate("/");
    } catch (error) {
      console.log("could not sign in with google ", error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="flex items-center justify-center gap-3 w-full bg-white text-gray-700 p-3 rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-all hover:bg-gray-100 active:scale-95"
    >
      <FcGoogle size={24} /> {/* Google Logo */}
      <span className="font-semibold text-md">Continue with Google</span>
    </button>
  );
}

export default OAuth;
