"use client";


import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; 
import { useDispatch } from "react-redux";  
import { setCredentials } from "@/lib/redux/slices/authSlice"; 
import { useLoginUserMutation } from "@/lib/services/auth";


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch(); 
  

  // API Mutation Hook
    const [loginUser, { isLoading, isError, isSuccess, error }] = useLoginUserMutation();
    
  // Formik Form Handling
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await loginUser({
          email: values.email,
          password: values.password,
        }).unwrap();
    
    
        if (response?.token) {
          dispatch(setCredentials({ token: response?.token, user: response?.user })); 
          toast.success("Login successful! Redirecting..."); // Success toast

          setTimeout(() => {

            router.push("/");
          }
          , 1000);
         
        } else {
          toast.error("Authentication failed. Please try again.");
        }
      } catch (err) {
        console.error("Login failed:", err);
        toast.error(err?.data?.message || "Login failed!");
      }
    },
    
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email address is invalid";
      }
      if (!values.password) {
        errors.password = "Password is required";
      }
      return errors;
    },
  });

  // Navigate to the Register page
  const navigateToRegister = () => {
    router.push("register");
  };

  // Navigate to the Forgot Password page
  const navigateToForgotPassword = () => {
    router.push("account/forgot-password");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side image */}
      <div
        className="md:w-1/2 w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://t3.ftcdn.net/jpg/05/59/87/12/360_F_559871209_pbXlOVArUal3mk6Ce60JuP13kmuIRCth.jpg)",
        }}
      ></div>

      {/* Right side form */}
      <div
        className="md:w-1/2 w-full flex flex-col justify-center items-center"
        style={{ backgroundColor: "#0F172A" }}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Login</h2>
        <form onSubmit={formik.handleSubmit} className="w-full max-w-md space-y-6 p-8">
          {/* Email */}
          <div className="flex flex-col relative">
            <label htmlFor="email" className="text-sm font-semibold text-white mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`p-3 border rounded-md focus:outline-none focus:ring-2 w-full pl-10 ${
                  formik.errors.email && formik.touched.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="absolute left-3 top-3">
                <Mail size={20} />
              </div>
            </div>
            {formik.errors.email && formik.touched.email && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-sm font-semibold text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`p-3 border rounded-md focus:outline-none focus:ring-2 w-full pl-10 ${
                  formik.errors.password && formik.touched.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div
                className="absolute left-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {formik.errors.password && formik.touched.password && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
          >
            {isLoading ? 'Logging in...' : 'Login'} 
          </button>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <a
              href="#"
              onClick={navigateToForgotPassword}
              className="text-blue-400 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Create Account Link */}
          <div className="text-center mt-4">
            <span className="text-white">Don't have an account? </span>
            <a
              href="/account/register"
              className="text-blue-400 font-semibold hover:underline"
            >
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
