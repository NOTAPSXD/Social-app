import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
  Alert,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { signup } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Copyright from "../Copyright";
import ErrorAlert from "../ErrorAlert";
import { isLength, isEmail, contains } from "validator";

const SignupView = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length !== 0) return;

    const data = await signup(formData);

    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  const validate = () => {
    const errors = {};

    if (!isLength(formData.username, { min: 6, max: 30 })) {
      errors.username = "Must be between 6 and 30 characters long";
    }

    if (contains(formData.username, " ")) {
      errors.username = "Must contain only valid characters";
    }

    if (!isLength(formData.password, { min: 8 })) {
      errors.password = "Must be at least 8 characters long";
    }

    if (!isEmail(formData.email)) {
      errors.email = "Must be a valid email address";
    }

    setErrors(errors);

    return errors;
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
              <MuiLink
                component={RouterLink}
                to="/"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Socially
              </MuiLink>
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Sign Up
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Already have an account?{" "}
              <MuiLink
                component={RouterLink}
                to="/login"
                sx={{ color: "#2575fc", fontWeight: 500 }}
              >
                Login
              </MuiLink>
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                autoFocus
                required
                id="username"
                name="username"
                onChange={handleChange}
                error={errors.username !== undefined}
                helperText={errors.username}
                sx={{
                  bgcolor: "#f5f7fa",
                  borderRadius: 2,
                  input: { color: "#222" },
                }}
              />
              <TextField
                label="Email Address"
                fullWidth
                margin="normal"
                autoComplete="email"
                required
                id="email"
                name="email"
                onChange={handleChange}
                error={errors.email !== undefined}
                helperText={errors.email}
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
                autoComplete="password"
                id="password"
                name="password"
                type="password"
                onChange={handleChange}
                error={errors.password !== undefined}
                helperText={errors.password}
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
                Sign Up
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

export default SignupView;
