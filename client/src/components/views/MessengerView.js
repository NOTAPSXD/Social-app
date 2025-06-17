import { Grid, Paper } from "@mui/material"; // Remove Card
import { Box, Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import Messages from "../Messages";
import Navbar from "../Navbar";
import UserMessengerEntries from "../UserMessengerEntries";
import { getConversations } from "../../api/messages";
import { isLoggedIn } from "../../helpers/authHelper";
import { useLocation } from "react-router-dom";

const MessengerView = () => {
  const [conservant, setConservant] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [width, setWindowWidth] = useState(0);
  const mobile = width < 800;
  const user = isLoggedIn();
  const { state } = useLocation();
  const newConservant = state && state.user;

  const getConversation = (conversations, conservantId) => {
    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      if (conversation.recipient._id === conservantId) {
        return conversation;
      }
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      let conversations = await getConversations(user);
      if (newConservant) {
        setConservant(newConservant);
        if (!getConversation(conversations, newConservant._id)) {
          const newConversation = {
            _id: newConservant._id,
            recipient: newConservant,
            new: true,
            messages: [],
          };
          conversations = [newConversation, ...conversations];
        }
      }
      setConversations(conversations);
      setLoading(false);
    };

    fetchConversations();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

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
        <Box>
          <Paper
            elevation={8}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              mt: 3,
              boxShadow: "0 8px 32px #2575fc33",
              background: "rgba(255,255,255,0.95)",
            }}
          >
            <Grid
              container
              sx={{
                height: { xs: "calc(100vh - 120px)", md: "70vh" },
                minHeight: 400,
              }}
              alignItems="stretch"
            >
              {!mobile ? (
                <>
                  <Grid
                    item
                    xs={5}
                    sx={{
                      borderRight: 1,
                      borderColor: "divider",
                      height: "100%",
                      bgcolor: "#f5f7fa",
                    }}
                  >
                    <UserMessengerEntries
                      conservant={conservant}
                      conversations={conversations}
                      setConservant={setConservant}
                      loading={loading}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={7}
                    sx={{
                      height: "100%",
                      bgcolor: "#fff",
                    }}
                  >
                    <Messages
                      conservant={conservant}
                      conversations={conversations}
                      setConservant={setConservant}
                      setConversations={setConversations}
                      getConversation={getConversation}
                    />
                  </Grid>
                </>
              ) : !conservant ? (
                <Grid
                  item
                  xs={12}
                  sx={{
                    borderRight: 1,
                    borderColor: "divider",
                    height: "100%",
                    bgcolor: "#f5f7fa",
                  }}
                >
                  <UserMessengerEntries
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    loading={loading}
                  />
                  <Box sx={{ display: "none" }}>
                    <Messages
                      conservant={conservant}
                      conversations={conversations}
                      setConservant={setConservant}
                      setConversations={setConversations}
                      getConversation={getConversation}
                    />
                  </Box>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={12}
                  sx={{
                    height: "100%",
                    bgcolor: "#fff",
                  }}
                >
                  <Messages
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    setConversations={setConversations}
                    getConversation={getConversation}
                    mobile
                  />
                </Grid>
              )}
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default MessengerView;
