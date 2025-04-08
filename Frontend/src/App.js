import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/login";
import MainLayout from "./components/MainLayout";
import Registration from "./components/Registration";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { ThemeProvider } from "./contexts/ThemeContext";
import styles from './App.module.css';

function App() {
  return (
    <ThemeProvider className={styles.app}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/ResetPasswordForm" element={<ResetPasswordForm />} />

        {/* Dashboard with Sidebar */}
        <Route path="/dashboard/*" element={<MainLayout />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
