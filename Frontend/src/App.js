import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login";
import MainLayout from "./components/MainLayout";
import Registration from "./components/Registration";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { ThemeProvider } from "./contexts/ThemeContext";
import styles from './App.module.css';
// import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {

  

  return (
    <ThemeProvider className={styles.app}>

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
