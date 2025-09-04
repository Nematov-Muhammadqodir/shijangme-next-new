// @ts-nocheck
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import withLayoutChat from "@/libs/components/layout/ChatBasic";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, checkAuth } =
    useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immediately without uploading yet
    setSelectedImg(URL.createObjectURL(file));

    // Prepare FormData for multer
    const formData = new FormData();
    formData.append("memberImage", file); // name must match multer's .single("memberImage")

    await updateProfile(formData);
  };

  console.log("authUser", authUser);
  const imagePath = `${process.env.NEXT_PUBLIC_CHAT_URL}/${authUser?.profilePic}`;

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", pt: 8 }}>
      <Box sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
        <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
          {/* Title */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight={600}>
              Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Your profile information
            </Typography>
          </Box>

          {/* Avatar upload */}
          <Stack alignItems="center" spacing={2} mb={4}>
            <Box position="relative" display="inline-block">
              <Avatar
                src={selectedImg || imagePath || "/img/profile/defaultImg.jpg"}
                alt="Profile"
                sx={{
                  width: 128,
                  height: 128,
                  border: "4px solid",
                  borderColor: "divider",
                }}
              />
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                  transform: "scale(1)",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                disabled={isUpdatingProfile}
              >
                <Camera size={20} />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {isUpdatingProfile ? (
                <>
                  <CircularProgress size={14} sx={{ mr: 1 }} /> Uploading...
                </>
              ) : (
                "Click the camera icon to update your photo"
              )}
            </Typography>
          </Stack>

          {/* User info */}
          <Stack spacing={3} mb={4}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={1}
                mb={0.5}
              >
                <User size={16} /> Full Name
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5 }}>
                {authUser?.fullName}
              </Paper>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={1}
                mb={0.5}
              >
                <Mail size={16} /> Email Address
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5 }}>
                {authUser?.email}
              </Paper>
            </Box>
          </Stack>

          {/* Account info */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" mb={2}>
              Account Information
            </Typography>
            <Stack spacing={2} divider={<Divider />}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Member Since</Typography>
                <Typography variant="body2">
                  {authUser?.createdAt?.split("T")[0]}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Account Status</Typography>
                <Typography variant="body2" color="success.main">
                  Active
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Paper>
      </Box>
    </Box>
  );
};

export default withLayoutChat(ProfilePage);
