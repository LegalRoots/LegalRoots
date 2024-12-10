import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Stack,
  Modal,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { AuthContext } from "../../shared/context/auth";
import { useToast } from "@chakra-ui/react";
const HireALawyer = () => {
  const toast = useToast();
  const { user } = useContext(AuthContext);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCases, setUserCases] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/JusticeRoots/lawyers"
        );
        setLawyers(response.data.data.lawyers);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  const handleHireLawyer = (lawyerId) => async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/JusticeRoots/cases/user/${user._id}`
      );
      console.log(response.data);
      setUserCases(response.data);
      setSelectedLawyer(lawyerId);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching user cases:", error);
    }
  };

  const handleCaseSelection = async (caseId) => {
    try {
      await axios.post(
        "http://localhost:5000/JusticeRoots/cases/assignLawyer",
        {
          lawyerId: selectedLawyer,
          caseId,
          user: user._id,
        }
      );
      toast({
        title: "Lawyer Assigned",
        description: "Lawyer has been successfully assigned to the case",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setOpenModal(false);
    } catch (error) {
      console.error("Error assigning lawyer:", error);
      toast({
        title: "Error",
        description:
          "You already have a pending request with this lawyer for the selected case.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hire a Lawyer
      </Typography>
      <Grid container spacing={3}>
        {lawyers.map((lawyer) => (
          <Grid sizes={{ xs: 12, sm: 6, md: 4 }} key={lawyer._id}>
            <Card
              sx={{
                maxWidth: 345,
                borderRadius: 3,
                boxShadow: 6,
                padding: "1rem 2.5rem",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Box display="flex" justifyContent="center" pt={2}>
                <Avatar
                  src={`http://localhost:3000/images/${lawyer.photo}`}
                  alt={`${lawyer.first_name} ${lawyer.last_name}`}
                  sx={{
                    width: 100,
                    height: 100,
                    border: "2px solid #3f51b5",
                  }}
                />
              </Box>
              <CardContent>
                <Typography variant="h6" textAlign="center">
                  {lawyer.first_name} {lawyer.last_name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  textAlign="center"
                  gutterBottom
                >
                  Specialization: {lawyer.specialization}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  <Chip
                    label={lawyer.isAvailable ? "Available" : "Unavailable"}
                    color={lawyer.isAvailable ? "success" : "error"}
                  />
                  <Chip
                    label={`$${lawyer.consultation_price}/hr`}
                    color="primary"
                  />
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleHireLawyer(lawyer._id)}
                >
                  Hire Lawyer
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Select a Case</DialogTitle>
        <DialogContent>
          <List>
            {userCases &&
              userCases.map((userCase) => (
                <ListItem
                  sx={{ cursor: "pointer" }}
                  key={userCase._id}
                  onClick={() => handleCaseSelection(userCase._id)}
                >
                  <ListItemText
                    primary={userCase.case_title}
                    secondary={
                      <>
                        Case Type: {userCase.case_type} <br />
                        Case Description: {userCase.case_description} <br />
                        Case ID: {userCase._id}
                      </>
                    }
                  />
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HireALawyer;
