"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import {} from "react-firebase-hooks/auth";
import Alert from "@/app/components/Alert";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import React from "react";
// import global css
import "../globals.css";


const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const router = useRouter();

  const email = watch("email");
  const password = watch("password");

  const handleSignIn = async () => {
    try {
      const res = (await signInWithEmailAndPassword(email, password)) as {
        error?: { message: string };
      };

      console.log({ res });
      //if response contains error then display error
      if (res.error) {
        setMessage(res.error.message);
        setMessageType("error");
        setShowAlert(true);
        return;
      }

      //sessionStorage.setItem("userid", "true" );
      router.push("/farm");

    } catch (e) {
      console.error(e);
      setMessage("Sign-up failed");
      setMessageType("error");
      setShowAlert(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSignIn)}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="flex justify-center mb-4 text-2xl font-extrabold text-gray-900 dark:text-white md:text-2xl lg:text-3xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Agri Community
            </span>
          </h1>
          <div className="flex justify-center mb-6">
            <img src="/logo-clear.png" alt="Logo" className="h-24 w-auto" />
          </div>
          <h3 className="text-gray-800 text-2xl mb-5 text-center font-semibold">
            Sign In
          </h3>
          {showAlert && <Alert message={message} type={messageType} />}
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Email is invalid" },
            })}
            className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 rounded-lg outline-none text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 rounded-lg outline-none text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <button className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Sign In
          </button>
          <a
            href="/sign-up"
            rel="stylesheet"
            className="text-gray-600 flex justify-center"
          >
            Already have an account? Sign-up
          </a>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
