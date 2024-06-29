"use client";
import { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import {} from "react-firebase-hooks/auth";
import Alert from "@/app/components/Alert";
import { useForm } from "react-hook-form";

import React from "react";
// import global css
import "../globals.css";
import { createDocument } from "../firebase/firestoreFunctions";
import { GoogleOAuthProvider } from "@react-oauth/google";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const email = watch("email");
  const password = watch("password");
  const name = watch("name");

  const handleSignUp = async () => {
    try {
      const res = (await createUserWithEmailAndPassword(email, password)) as {
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

      sessionStorage.setItem("user", "true");

      // Show the alert
      setMessage(
        "Sign up successful! You can now log in with your new account."
      );
      setMessageType("success");
      setShowAlert(true);

      //get recently created user id
      const user = auth.currentUser;
      const createUserDocument = async () => {
        createDocument("user", {
          name: name,
          email: email,
          userid: user?.uid,
        });
      };

      createUserDocument();
      reset();
    } catch (e) {
      console.error(e);
      setMessage("Sign up failed");
      setMessageType("error");
      setShowAlert(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSignUp)}>
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
            Sign Up
          </h3>
          {showAlert && <Alert message={message} type={messageType} />}
          <GoogleOAuthProvider clientId="1009282809407-sh8h2kgmot2q295a503sl5530pldnaj9.apps.googleusercontent.com">
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </GoogleOAuthProvider>
          <a
            href="/sign-in"
            rel="stylesheet"
            className="text-gray-600 flex justify-center"
          >
            Already have an account? Sign-in
          </a>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
