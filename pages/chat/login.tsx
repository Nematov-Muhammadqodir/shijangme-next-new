// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/router";
import withLayoutChat from "@/libs/components/layout/ChatBasic";
import { Box, Button, Stack } from "@mui/material";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { authUser } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };
  const handleLogin = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) login(formData);
  };

  useEffect(() => {
    if (authUser) {
      router.push("/chat");
    }
  }, [authUser, router]);

  return (
    <div className="signup-main-container">
      <Stack className="container">
        <Stack className="signupForm">
          <Box className="signup-title-container">
            <span className="signup-title">Login</span>
          </Box>

          <form action="" onSubmit={handleLogin} className="signup-form">
            <Stack className="email-container">
              <span className="form-label">Email</span>
              <input
                type="email"
                className="input"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Stack>
            <Stack className="password-container">
              <span className="form-label">Password</span>
              <input
                type="password"
                className="input"
                required
                placeholder="********"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Stack>
            <Button type="submit" className="signup-btn">
              Login
            </Button>
          </form>

          <Stack className="login-link-container">
            <p>Create an account!</p>
            <a href="/chat/signup">Signup</a>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default withLayoutChat(Login);
