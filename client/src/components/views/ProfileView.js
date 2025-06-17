import { Box, Card, Container, Stack, Tab, Tabs, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getUser, updateUser } from "../../api/users";
import { isLoggedIn } from "../../helpers/authHelper";
import CommentBrowser from "../CommentBrowser";

import ErrorAlert from "../ErrorAlert";
import FindUsers from "../FindUsers";
import Footer from "../Footer";
import GoBack from "../GoBack";
import GridLayout from "../GridLayout";
import Loading from "../Loading";
import MobileProfile from "../MobileProfile";
import Navbar from "../Navbar";
import PostBrowser from "../PostBrowser";
import Profile from "../Profile";
import ProfileTabs from "../ProfileTabs";

const ProfileView = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState("posts");
  const user = isLoggedIn();
  const [error, setError] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = async () => {
    setLoading(true);
    const data = await getUser(params);
    setLoading(false);
    if (data.error) {
      setError(data.error);
    } else {
      setProfile(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;

    await updateUser(user, { biography: content });

    setProfile({ ...profile, user: { ...profile.user, biography: content } });
    setEditing(false);
  };

  const handleEditing = () => {
    setEditing(!editing);
  };

  const handleMessage = () => {
    navigate("/messenger", { state: { user: profile.user } });
  };

  useEffect(() => {
    fetchUser();
  }, [location]);

  const validate = (content) => {
    let error = "";

    if (content.length > 250) {
      error = "Bio cannot be longer than 250 characters";
    }

    return error;
  };

  let tabs;
  if (profile) {
    tabs = {
      posts: (
        <PostBrowser
          profileUser={profile.user}
          contentType="posts"
          key="posts"
        />
      ),
      liked: (
        <PostBrowser
          profileUser={profile.user}
          contentType="liked"
          key="liked"
        />
      ),
      comments: <CommentBrowser profileUser={profile.user} />,
    };
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        py: { xs: 1, md: 3 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
        <Navbar />
        <GridLayout
          left={
            <Paper
              elevation={8}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                mt: 3,
                mb: 3,
                px: { xs: 1, md: 3 },
                py: { xs: 2, md: 4 },
                background: "rgba(255,255,255,0.97)",
                boxShadow: "0 8px 32px #2575fc33",
              }}
            >
              <MobileProfile
                profile={profile}
                editing={editing}
                handleSubmit={handleSubmit}
                handleEditing={handleEditing}
                handleMessage={handleMessage}
                validate={validate}
              />
              <Stack spacing={2}>
                {profile ? (
                  <>
                    <ProfileTabs tab={tab} setTab={setTab} />
                    {tabs[tab]}
                  </>
                ) : (
                  <Loading />
                )}
                {error && <ErrorAlert error={error} />}
              </Stack>
            </Paper>
          }
          right={
            <Stack spacing={2} sx={{ mt: 3 }}>
              <Paper
                elevation={8}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  px: { xs: 1, md: 3 },
                  py: { xs: 2, md: 4 },
                  background: "rgba(255,255,255,0.97)",
                  boxShadow: "0 8px 32px #2575fc33",
                }}
              >
                <Profile
                  profile={profile}
                  editing={editing}
                  handleSubmit={handleSubmit}
                  handleEditing={handleEditing}
                  handleMessage={handleMessage}
                  validate={validate}
                />
              </Paper>
              <Paper
                elevation={6}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  px: { xs: 1, md: 3 },
                  py: { xs: 2, md: 3 },
                  background: "rgba(255,255,255,0.95)",
                  boxShadow: "0 4px 16px #2575fc22",
                }}
              >
                <FindUsers />
              </Paper>
              <Footer />
            </Stack>
          }
        />
      </Container>
    </Box>
  );
};

export default ProfileView;
