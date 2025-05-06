"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Eye, EyeOff, User, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; 
import { useCreateUserMutation } from "@/lib/services/auth";

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // API Mutation Hook
  const [createUser, { isLoading, isError, isSuccess, error }] = useCreateUserMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Registration successful! Redirecting..."); // Success toast
      setTimeout(() => {
        router.push("/"); 
      }, 2000); 
    }
    if (isError) {
      toast.error(error?.data?.message || "Registration failed!"); // Error toast
    }
  }, [isSuccess, isError, router, error]);

  // Formik Form Handling
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "", 
      role: "creator",
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Name is required";
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email address is invalid";
      }
      if (!values.password) errors.password = "Password is required";
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords must match";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await createUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        }).unwrap();
      } catch (err) {
        console.error("Registration failed:", err);
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side image */}
      <div
        className="md:w-1/2 w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(https://cdn.mu-43.com/attachments/wof06040-edit-jpg.917175/)",
        }}
      ></div>

      {/* Right side form */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center bg-gray-900">
        <h2 className="text-3xl font-bold text-white mb-6">Register</h2>

        <form onSubmit={formik.handleSubmit} className="w-full max-w-md space-y-6 p-8 bg-gray-800 shadow-lg rounded-lg">
          {/* Name */}
          <div className="flex flex-col relative">
            <label htmlFor="name" className="text-sm font-semibold text-white mb-2">
              Name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name || ""}  // Ensure value is never undefined
                className={`p-3 border rounded-md focus:outline-none focus:ring-2 w-full pl-10 ${
                  formik.errors.name && formik.touched.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <User size={20} />
              </div>
            </div>
            {formik.errors.name && formik.touched.name && <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>}
          </div>

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
                value={formik.values.email || ""}  // Ensure value is never undefined
                className={`p-3 border rounded-md focus:outline-none focus:ring-2 w-full pl-10 ${
                  formik.errors.email && formik.touched.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <Mail size={20} />
              </div>
            </div>
            {formik.errors.email && formik.touched.email && <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>}
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
                value={formik.values.password || ""}  // Ensure value is never undefined
                className={`p-3 border rounded-md focus:outline-none focus:ring-2 w-full pl-10 ${
                  formik.errors.password && formik.touched.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <div className="absolute left-3 top-3 cursor-pointer text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {formik.errors.password && formik.touched.password && <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col relative">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-white mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword || ""}  // Ensure value is never undefined
                className={`p-3 border rounded-md focus:outline-none focus:ring-2 w-full pl-10 ${
                  formik.errors.confirmPassword && formik.touched.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <div className="absolute left-3 top-3 cursor-pointer text-gray-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full mt-4 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>

        </form>
      </div>

      {/* Toast Container */}
      
    </div>
  );
};

export default RegisterPage;
