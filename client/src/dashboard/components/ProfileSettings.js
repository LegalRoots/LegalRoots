import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { AuthContext } from "../../shared/context/auth";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const ProfileSettings = () => {
  const { updateUserContext } = useContext(AuthContext);
  const toast = useToast();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    SSID: user.SSID,
    birthday: user.birthday,
    city: user.city,
    street: user.street,
    photo: user.photo,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/JusticeRoots/users/updateProfile",
        profile,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        title: "Profile Updated",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      updateUserContext(response.data.user);
    } catch (error) {
      console.error("Error updating profile", error);
      toast({ title: "Error", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 4,
        flexDirection: "column",
        width: "70%",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Profile Settings
      </Typography>
      <Card
        sx={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 4,
          boxShadow: 6,
          borderRadius: 4,
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src={profile.photo}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: "3px solid #3f51b5",
              "&:hover": { cursor: "pointer" },
            }}
          />
          <Button variant="contained" component="label" sx={{ mb: 3 }}>
            Change Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid sizes={{ xs: 12, sm: 6 }}>
            <TextField
              label="First Name"
              name="first_name"
              value={profile.first_name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid sizes={{ xs: 12, sm: 6 }}>
            <TextField
              label="Last Name"
              name="last_name"
              value={profile.last_name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid sizes={{ xs: 12, sm: 6 }}>
            <TextField
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              type="email"
            />
          </Grid>
          <Grid sizes={{ xs: 12, sm: 6 }}>
            <TextField
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              type="tel"
            />
          </Grid>
          <Grid sizes={{ xs: 12, sm: 6 }}>
            <TextField
              label="SSID"
              name="SSID"
              value={profile.SSID}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid sizes={{ xs: 12, sm: 6 }}>
            <TextField
              label="Birthday"
              name="birthday"
              value={profile.birthday.split("T")[0]}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid sizes={{ xs: 12, sm: 6 }}>
            <TextField
              label="City"
              name="city"
              value={profile.city}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid sizes={{ xs: 12, sm: 6 }}>
            <TextField
              label="Street"
              name="street"
              value={profile.street}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>
        <CardActions sx={{ justifyContent: "center", marginTop: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
            sx={{ width: 200 }}
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ProfileSettings;
