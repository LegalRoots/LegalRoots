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
  Divider,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { AuthContext } from "../../shared/context/auth";
import { useToast } from "@chakra-ui/react";

const HireALawyer = () => {
  function getRelativeTime(lastActive) {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);

    const seconds = Math.floor((now - lastActiveDate) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(days / 365);
    return `${years} years ago`;
  }

  const toast = useToast();
  const { user } = useContext(AuthContext);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCases, setUserCases] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [lawyerDetails, setLawyerDetails] = useState(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/JusticeRoots/lawyers"
        );
        setLawyers(response.data.data.lawyers);
        console.log(response.data.data.lawyers);
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
        `http://localhost:5000/JusticeRoots/cases/user/${user.SSID}`
      );
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
          error.response?.data?.message ||
          "Failed to assign lawyer to the case",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleMoreDetails = (lawyer) => () => {
    setLawyerDetails(lawyer);
    console.log(lawyer);
    setOpenDetailsModal(true);
  };

  // Group lawyers by specialization
  const groupedLawyers = lawyers.reduce((acc, lawyer) => {
    const specialization = lawyer.specialization || "General";
    if (!acc[specialization]) {
      acc[specialization] = [];
    }
    acc[specialization].push(lawyer);
    return acc;
  }, {});

  // Filter lawyers based on search term
  const filteredLawyers = Object.keys(groupedLawyers).reduce(
    (acc, specialization) => {
      const filtered = groupedLawyers[specialization].filter(
        (lawyer) =>
          lawyer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lawyer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[specialization] = filtered;
      }
      return acc;
    },
    {}
  );

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
      <TextField
        label="Search Lawyers"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {Object.keys(filteredLawyers).map((specialization) => (
        <Box key={specialization} sx={{ marginBottom: 5 }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            {specialization}
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Grid container spacing={3}>
            {filteredLawyers[specialization].map((lawyer) => (
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
                      src={`http://localhost:5000/images/${lawyer.photo}`}
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
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={handleMoreDetails(lawyer)}
                    >
                      More Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* <Button
            variant="contained"
            color="primary"
            onClick={() => fetchRecommendedLawyer(specialization)}
          >
            Recommend Lawyer
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchRecommendedLawyerByWonCases(specialization)}
          >
            Recommend Lawyer (Won Cases)
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => fetchRecommendedLawyerByAssessment(specialization)}
          >
            Recommend Lawyer (Assessment)
          </Button> */}
        </Box>
      ))}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Select a Case</DialogTitle>
        <DialogContent>
          <List>
            {userCases.length === 0 && (
              <ListItem>
                <ListItemText primary="No cases without a lawyer found." />
              </ListItem>
            )}
            {userCases &&
              userCases.map((userCase) => (
                <ListItem
                  sx={{ cursor: "pointer" }}
                  key={userCase._id}
                  onClick={() => handleCaseSelection(userCase._id)}
                >
                  <ListItemText
                    primary={`Case ID: ${userCase._id}`}
                    secondary={
                      <>
                        <strong>Case Type:</strong>{" "}
                        {userCase.Case?.caseType?.name || "N/A"} <br />
                        <strong>Case Description:</strong>{" "}
                        {userCase.Case?.description || "No description"} <br />
                        <strong>Initiated On:</strong>{" "}
                        {new Date(
                          userCase.Case?.init_date
                        ).toLocaleDateString() || "Unknown"}{" "}
                        <br />
                        <strong>Is Active:</strong>{" "}
                        {userCase.Case?.isActive ? "Yes" : "No"} <br />
                        <strong>Judges:</strong>{" "}
                        {userCase.Case?.judges?.length > 0
                          ? userCase.Case.judges
                              .map(
                                (judge) =>
                                  `${judge.first_name} ${judge.last_name}`
                              )
                              .join(", ")
                          : "None"}{" "}
                        <br />
                        <strong>Plaintiff:</strong>{" "}
                        {userCase.Case?.plaintiff || "Unknown"} <br />
                        <strong>Defendant:</strong>{" "}
                        {userCase.Case?.defendant || "Unknown"} <br />
                        <strong>Case Fields:</strong>{" "}
                        {userCase.Case?.caseType?.fields?.length > 0
                          ? userCase.Case.caseType.fields
                              .map((field) => `${field.name} (${field.type})`)
                              .join(", ")
                          : "None"}{" "}
                        <br />
                        <strong>Court Branch:</strong>{" "}
                        {userCase.Case?.court_branch?.name || "N/A"} <br />
                        <strong>Documents:</strong>{" "}
                        {userCase.case_documents?.length > 0
                          ? `${userCase.case_documents.length} available`
                          : "None"}{" "}
                        <br />
                        <strong>Tasks:</strong>{" "}
                        {userCase.tasks?.length > 0
                          ? `${userCase.tasks.length} tasks`
                          : "None"}{" "}
                        <br />
                        <strong>Notes:</strong>{" "}
                        {userCase.notes?.length > 0
                          ? `${userCase.notes.length} notes`
                          : "None"}
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

      {lawyerDetails && (
        <Dialog
          open={openDetailsModal}
          onClose={() => setOpenDetailsModal(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>{`${lawyerDetails.first_name} ${lawyerDetails.last_name}`}</DialogTitle>
          <DialogContent>
            {/* Lawyer's Photo and Basic Info */}
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar
                src={`http://localhost:5000/images/${lawyerDetails.photo}`}
                alt="Lawyer's photo"
                sx={{ width: 100, height: 100, marginRight: 2 }}
              />
              <Box>
                <Typography variant="h6" gutterBottom>
                  {`${lawyerDetails.first_name} ${lawyerDetails.last_name}`}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Specialization: {lawyerDetails.specialization}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Years of Experience: {lawyerDetails.yearsOfExperience}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Consultation Price: ${lawyerDetails.consultation_price}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Rating (out of 5): {lawyerDetails.assessment}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Last Active: {getRelativeTime(lawyerDetails.lastActive)}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  href={`http://localhost:5000/uploads/${lawyerDetails.cv}`}
                >
                  Download CV
                </Button>
              </Box>
            </Box>

            {/* Achievements and Certifications */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Professional Details
              </Typography>
              <Typography variant="body1">
                Achievements:{" "}
                {lawyerDetails.achievements?.length > 0
                  ? lawyerDetails.achievements.join(", ")
                  : "None listed"}
              </Typography>
              <Typography variant="body1">
                Certifications:{" "}
                {lawyerDetails.additionalCertifications?.length > 0
                  ? lawyerDetails.additionalCertifications.join(", ")
                  : "None listed"}
              </Typography>
            </Box>

            {/* Contact Details */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Contact Details
              </Typography>
              <Typography variant="body1">
                Email: {lawyerDetails.email}
              </Typography>
              <Typography variant="body1">
                Phone: {lawyerDetails.phone}
              </Typography>
              <Typography variant="body1">
                City: {lawyerDetails.city}
              </Typography>
              <Typography variant="body1">
                Street: {lawyerDetails.street}
              </Typography>
            </Box>

            {/* Performance Metrics */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body1">
                    Total Cases: {lawyerDetails.totalCases}
                  </Typography>
                  <Typography variant="body1">
                    Won Cases: {lawyerDetails.wonCases}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body1">
                    Lost Cases: {lawyerDetails.lostCases}
                  </Typography>
                  <Typography variant="body1">
                    Ongoing Cases: {lawyerDetails.ongoingCases}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body1">
                    Average Response Time: {lawyerDetails.averageResponseTime}{" "}
                    hrs
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Client Reviews */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Client Reviews
              </Typography>
              {lawyerDetails.clientReviews.length > 0 ? (
                lawyerDetails.clientReviews.map((review) => (
                  <Box
                    key={review.clientId}
                    mb={2}
                    p={2}
                    bgcolor="#f9f9f9"
                    borderRadius={2}
                  >
                    <Typography variant="body1">
                      Client:{" "}
                      {review.clientId.first_name +
                        " " +
                        review.clientId.last_name}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                      Rating: {review.rating}/5
                    </Typography>
                    <Typography variant="body1">{review.feedback}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No reviews yet.
                </Typography>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default HireALawyer;
