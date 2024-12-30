import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { AuthContext } from "../../shared/context/auth";

const PayLawyer = () => {
  const { user } = useContext(AuthContext);
  const [lawyers, setLawyers] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/JusticeRoots/cases/my-lawyers/${user.SSID}`)
      .then((response) => response.json())
      .then((data) => {
        setLawyers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching lawyers:", error);
        setLoading(false);
      });
  }, []);

  const handleLawyerChange = (event) => {
    setSelectedLawyer(event.target.value);
  };

  const handlePayment = () => {
    alert(`Payment initiated for lawyer ID: ${selectedLawyer}`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h5" textAlign="center" marginBottom={2}>
        Pay Lawyer
      </Typography>

      <TextField
        select
        fullWidth
        label="Select a Lawyer"
        value={selectedLawyer}
        onChange={handleLawyerChange}
        margin="normal"
        helperText="Choose the lawyer you want to pay."
      >
        {lawyers.map((lawyer) => (
          <MenuItem key={lawyer._id} value={lawyer._id}>
            {lawyer.first_name} {lawyer.last_name}
          </MenuItem>
        ))}
      </TextField>

      {selectedLawyer && (
        <Card sx={{ marginBottom: 2 }}>
          <CardMedia
            component="img"
            height="40px"
            sx={{
              width: "40px",
            }}
            image={`http://localhost:5000/uploads/images/${
              lawyers.find((l) => l._id === selectedLawyer)?.photo
            }`}
            alt="Lawyer photo"
          />
          <CardContent>
            <Typography variant="h6">
              {lawyers.find((l) => l._id === selectedLawyer)?.first_name}{" "}
              {lawyers.find((l) => l._id === selectedLawyer)?.last_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {lawyers.find((l) => l._id === selectedLawyer)?.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Consultation Price :{" "}
              {
                lawyers.find((l) => l._id === selectedLawyer)
                  ?.consultation_price
              }
              $
            </Typography>
          </CardContent>
        </Card>
      )}

      <Typography variant="subtitle1" marginBottom={2}>
        Payment Details
      </Typography>
      <TextField fullWidth label="Card Number" margin="normal" />
      <Box display="flex" gap={2}>
        <TextField fullWidth label="Expiry Date" margin="normal" />
        <TextField fullWidth label="CVV" margin="normal" />
      </Box>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handlePayment}
        disabled={!selectedLawyer}
      >
        Pay Now
      </Button>
    </Box>
  );
};

export default PayLawyer;
