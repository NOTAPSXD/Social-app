import {
  Alert,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/users";
import ErrorAlert from "../ErrorAlert";
import { loginUser } from "../../helpers/authHelper";
import Copyright from "../Copyright";

const LoginView = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await login(formData);
    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 6,
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <Typography
              variant="h2"
              color="primary"
              sx={{
                mb: 2,
                fontWeight: 700,
                letterSpacing: 2,
                textShadow: "1px 2px 8px #2575fc33",
              }}
            >
              <Link
                to="/"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Socially
              </Link>
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Login
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Don't have an account yet?{" "}
              <Link to="/signup" style={{ color: "#2575fc", fontWeight: 500 }}>
                Sign Up
              </Link>
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                label="Email Address"
                fullWidth
                margin="normal"
                autoComplete="email"
                autoFocus
                required
                id="email"
                name="email"
                onChange={handleChange}
                sx={{
                  bgcolor: "#f5f7fa",
                  borderRadius: 2,
                  input: { color: "#222" },
                }}
              />
              <TextField
                label="Password"
                fullWidth
                required
                margin="normal"
                id="password"
                name="password"
                onChange={handleChange}
                type="password"
                sx={{
                  bgcolor: "#f5f7fa",
                  borderRadius: 2,
                  input: { color: "#222" },
                }}
              />
              <ErrorAlert error={serverError} />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  my: 2,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
                  boxShadow: "0 4px 20px #2575fc44",
                }}
              >
                Login
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Copyright />
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginView;
