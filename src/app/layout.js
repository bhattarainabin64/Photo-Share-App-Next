import "./globals.css";

import StoreProvider from "./StoreProvider";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

export const metadata = {
  title: "Photo Share App",
  description: "A simple photo-sharing application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <StoreProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            rtl={false}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
