"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { 
  ImagePlus, 
  MapPin, 
  Tag, 
  Type, 
  MessageCircle, 
  Upload, 
  X 
} from "lucide-react";
import { useUploadFileMutation } from "@/lib/services/upload";

const UploadPhotoPage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const [uploadFile] = useUploadFileMutation();



  const formik = useFormik({
    initialValues: {
      title: "",
      caption: "",
      location: "",
      tags: "",
      photo: null,
    },
    validate: (values) => {
      const errors = {};
      
      if (!values.title) {
        errors.title = "Title is required";
      }
      
      if (!values.photo) {
        errors.photo = "Photo is required";
      }

      return errors;
    },
    onSubmit: async (values) => {
        const formData1 = new FormData();
      
        // Validate file before submission
        if (!values.photo) {
          console.error("No photo selected");
          return;
        }
      
        // Append all fields
        formData1.append("photo", values.photo);
        formData1.append("title", values.title || "");
        formData1.append("caption", values.caption || "");
        formData1.append("location", values.location || "");
        formData1.append("tags", values.tags || "");
      
        // Log FormData contents for debugging
        for (let [key, value] of formData1.entries()) {
          console.log(`${key}:`, value);
        }
      
        try {
          console.log("Uploading file...");
          
          // Don't manually set the Content-Type header; let the browser handle it
          const response = await uploadFile(formData1).unwrap();
          console.log("Upload successful:", response);
          router.push("/"); // Redirect after success
        } catch (error) {
          console.error("Upload failed:", {
            message: error.message,
            details: error.response?.data || error.data
          });
          alert("Failed to upload photo. Please try again.");
        }
      }
      
    });    

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert("Only JPEG, PNG, and GIF files are allowed.");
        return;
      }

      if (file.size > maxSize) {
        alert("File is too large. Maximum size is 5MB.");
        return;
      }

      formik.setFieldValue('photo', file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    formik.setFieldValue('photo', null);
  };

  return (
    <div 
      className="flex flex-col md:flex-row min-h-screen"
      style={{ backgroundColor: "#0F172A" }}
    >
      {/* Left side - Large Image Preview */}
      <div 
        className="md:w-2/3 w-full bg-slate-900/50 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-4xl relative">
          <input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {imagePreview ? (
            <div className="relative group">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-4 right-4 bg-red-500/80 text-white p-2 rounded-full 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                hover:bg-red-600"
              >
                <X size={24} />
              </button>
            </div>
          ) : (
            <label 
              htmlFor="photo-upload" 
              className="cursor-pointer block"
            >
              <div 
                className="w-full h-[70vh] border-4 border-dashed border-slate-600 
                flex items-center justify-center text-slate-400 rounded-xl 
                hover:border-green-500 hover:text-emerald-800 transition-all duration-300"
              >
                <div className="text-center">
                  <ImagePlus size={96} className="mx-auto mb-6" />
                  <p className="text-2xl font-semibold">
                    Drag and Drop or Click to Upload
                  </p>
                  <p className="text-sm mt-2">
                    Supports JPEG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>
            </label>
          )}
          
          {formik.errors.photo && (
            <div className="text-red-500 text-xs mt-4 text-center">
              {formik.errors.photo}
            </div>
          )}
        </div>
      </div>

      {/* Right side - Upload Form */}
      <div 
        className="md:w-1/3 w-full bg-slate-800 flex flex-col justify-center p-8"
      >
        <form 
          onSubmit={formik.handleSubmit} 
          className="w-full space-y-6"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center">
            <Upload className="mr-3" /> Upload Photo
          </h2>

          {/* Title Input */}
          <div className="space-y-2">
            <label 
              htmlFor="title" 
              className="text-sm font-semibold text-white"
            >
              Title
            </label>
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className={`p-3 border rounded-md focus:outline-none focus:ring-2 w-full pl-10 bg-slate-700 text-white ${
                  formik.errors.title && formik.touched.title
                    ? "border-red-500"
                    : "border-slate-600"
                }`}
                placeholder="Enter photo title"
              />
              <div className="absolute left-3 top-3 text-slate-400">
                <Type size={20} />
              </div>
            </div>
            {formik.errors.title && formik.touched.title && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.title}
              </div>
            )}
          </div>

          {/* Caption Input */}
          <div className="space-y-2">
            <label 
              htmlFor="caption" 
              className="text-sm font-semibold text-white"
            >
              Caption
            </label>
            <div className="relative">
              <textarea
                id="caption"
                name="caption"
                onChange={formik.handleChange}
                value={formik.values.caption}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 w-full pl-10 h-24 resize-none bg-slate-700 text-white border-slate-600"
                placeholder="Add a caption to your photo"
              />
              <div className="absolute left-3 top-3 text-slate-400">
                <MessageCircle size={20} />
              </div>
            </div>
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <label 
              htmlFor="location" 
              className="text-sm font-semibold text-white"
            >
              Location
            </label>
            <div className="relative">
              <input
                id="location"
                name="location"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.location}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 w-full pl-10 bg-slate-700 text-white border-slate-600"
                placeholder="Where was this photo taken?"
              />
              <div className="absolute left-3 top-3 text-slate-400">
                <MapPin size={20} />
              </div>
            </div>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label 
              htmlFor="tags" 
              className="text-sm font-semibold text-white"
            >
              Tags
            </label>
            <div className="relative">
              <input
                id="tags"
                name="tags"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.tags}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 w-full pl-10 bg-slate-700 text-white border-slate-600"
                placeholder="Add tags (comma-separated)"
              />
              <div className="absolute left-3 top-3 text-slate-400">
                <Tag size={20} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!imagePreview}
            className="w-full mt-4 p-3 bg-amber-700 text-white rounded-md 
            hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed 
            flex items-center justify-center"
          >
            <Upload className="mr-2" /> 
            {imagePreview ? "Upload Photo" : "Select a Photo First"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPhotoPage;