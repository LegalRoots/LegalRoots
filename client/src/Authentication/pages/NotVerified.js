import React from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const NotVerified = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f3f4f6",
        padding: 3,
      }}
    >
      <Paper
        sx={{
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" gutterBottom>
          🌟 You're Almost There! 🌟
        </Typography>
        <Typography variant="body1" paragraph>
          As a lawyer, your identity is being verified by our admin team. Please
          be patient as we process your verification request.
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          In the meantime, here’s something fun to do while you wait...
        </Typography>
        <CircularProgress sx={{ marginBottom: 2 }} />
        <Typography variant="body2" color="textSecondary" paragraph>
          How about taking a look at the latest legal updates or brushing up on
          the newest case law? Feel free to explore the resources available to
          you.
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: 3,
          }}
          onClick={() => window.history.back()}
        >
          <ArrowBack sx={{ marginRight: 1 }} />
          Go Back
        </Button>
      </Paper>
    </Box>
  );
};

export default NotVerified;
