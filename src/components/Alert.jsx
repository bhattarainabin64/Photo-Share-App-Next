// components/Alert.js
import React from "react";

const Alert = ({ type, message, title }) => {
  const alertStyles = {
    success: {
      bgColor: "bg-teal-50",
      borderColor: "border-teal-500",
      iconBgColor: "bg-teal-200",
      iconBorderColor: "border-teal-100",
      textColor: "text-teal-800",
      iconPath: (
        <path
          d="m9 12 2 2 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      ),
    },
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      iconBgColor: "bg-red-200",
      iconBorderColor: "border-red-100",
      textColor: "text-red-800",
      iconPath: (
        <>
          <path
            d="M18 6 6 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="m6 6 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </>
      ),
    },
  };

  const alertStyle = alertStyles[type] || alertStyles.success;

  return (
    <div
      className={`flex ${alertStyle.bgColor} border-t-2 ${alertStyle.borderColor} rounded-lg p-4`}
      role="alert"
      tabIndex="-1"
    >
      <div className="shrink-0">
        <span
          className={`inline-flex justify-center items-center size-8 rounded-full border-4 ${alertStyle.iconBorderColor} ${alertStyle.iconBgColor} text-gray-800`}
        >
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {alertStyle.iconPath}
          </svg>
        </span>
      </div>
      <div className="ms-3">
        <h3 className={`text-gray-800 font-semibold ${alertStyle.textColor}`}>
          {title || (type === "success" ? "Success" : "Error")}
        </h3>
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Alert;
