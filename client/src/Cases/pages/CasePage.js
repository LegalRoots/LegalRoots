import React, { useEffect, useState, useContext, Fragment } from "react";
import AddCommentIcon from "@mui/icons-material/AddComment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { AccessTime, CheckCircle, HourglassEmpty } from "@mui/icons-material";
import PhoneIcon from "@mui/icons-material/Phone";
import StarIcon from "@mui/icons-material/Star";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Chip,
  Modal,
  TextField,
  Stack,
  IconButton,
  Divider,
  Rating,
} from "@mui/material";
import { useToast } from "@chakra-ui/react";
import Grid from "@mui/material/Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import axios from "axios";
import { AuthContext } from "../../shared/context/auth";
const { useParams } = require("react-router-dom");

const Case = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [newDocument, setNewDocument] = useState(null);
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [lawyerFeedback, setLawyerFeedback] = useState(null);
  const [defendant, setDefendant] = useState("");
  const [defendantLawyers, setDefendantLawyers] = useState("");
  const [plaintiff, setPlaintiff] = useState("");
  const [plaintiffLawyers, setPlaintiffLawyers] = useState("");
  const [newFeedback, setNewFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [courtData, setCourtData] = useState(null);
  const [courtAdmins, setCourtAdmins] = useState({});
  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/JusticeRoots/cases/${id}`
        );

        const courtRes = await axios.get(
          `http://localhost:5000/admin/court/caseId/${response.data.Case._id}`
        );
        setCourtData(courtRes.data.courts);

        const allAdmins = [
          ...new Set(courtRes.data.courts.map((court) => court.admins).flat()),
        ];

        const adminResponses = await Promise.all(
          allAdmins.map((adminId) =>
            axios.get(`http://localhost:5000/admin/judges/ssid/${adminId}`)
          )
        );

        const adminsMap = adminResponses.reduce((acc, res, index) => {
          acc[allAdmins[index]] = res.data.data;
          return acc;
        }, {});

        setCourtAdmins(adminsMap);

        try {
          const caseDefendant = await axios.get(
            `http://localhost:5000/JusticeRoots/users/${response.data.Case.defendant}`
          );
          setDefendant(caseDefendant.data.user);
        } catch (error) {
          setDefendant("No defendant found");
        }

        try {
          const caseDefendantLawyers = await Promise.all(
            response.data.Case.defendant_lawyers.map((lawyerId) =>
              axios.get(
                `http://localhost:5000/JusticeRoots/lawyers/ssid/${lawyerId}`
              )
            )
          );
          setDefendantLawyers(caseDefendantLawyers.map((res) => res.data.data));
        } catch (error) {
          setDefendantLawyers("No defendant lawyers found");
        }

        const casePlaintiff = await axios.get(
          `http://localhost:5000/JusticeRoots/users/${response.data.Case.plaintiff}`
        );
        setPlaintiff(casePlaintiff.data.user);

        try {
          const casePlaintiffLawyers = await Promise.all(
            response.data.Case.plaintiff_lawyers.map((lawyerId) =>
              axios.get(
                `http://localhost:5000/JusticeRoots/lawyers/ssid/${lawyerId}`
              )
            )
          );

          setPlaintiffLawyers(casePlaintiffLawyers.map((res) => res.data.data));
        } catch (error) {
          setPlaintiffLawyers("No plaintiff lawyers found");
        }

        setCaseData(response.data);
      } catch (error) {
        console.error("Failed to fetch case:", error);
      }
    };
    fetchCase();
  }, [id]);

  const handleAddFeedBack = () => {
    setFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setNewFeedback("");
  };

  const submitFeedback = async () => {
    if (!newFeedback.trim()) {
      toast({
        title: "Feedback cannot be empty!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!rating) {
      toast({
        title: "Please provide a rating!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/JusticeRoots/lawyers/${lawyerFeedback._id}/reviews`,
        { feedback: newFeedback, rating, user: user._id }
      );

      setCaseData((prev) => ({
        ...prev,
        feedbacks: [...(prev.feedbacks || []), response.data],
      }));

      setFeedbackModalOpen(false);
      setNewFeedback("");
      setRating(0);
      toast({
        title: "Feedback added successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to add feedback:", error);
      toast({
        title: "Failed to add feedback!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDocumentUpload = async () => {
    if (!newDocument) {
      toast({
        title: "Please select a document to upload!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const formData = new FormData();
    formData.append("file", newDocument);
    try {
      await axios.post(
        `http://localhost:5000/JusticeRoots/cases/${id}/documents`,
        formData
      );
      setNewDocument(null);
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast({
        title: "Failed to upload document!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast({
        title: "Note cannot be empty!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/JusticeRoots/cases/${id}/notes`,
        { note: newNote, user: user._id, userType: "User" }
      );

      setCaseData((prev) => ({
        ...prev,
        notes: response.data.notes,
      }));

      setNewNote("");
      setAddNoteModalOpen(false);
      toast({ title: "Note added successfully!", status: "success" });
    } catch (error) {
      console.error("Failed to add note:", error);
      toast({
        title: "Failed to add note!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleOpenAddNoteModal = () => {
    setAddNoteModalOpen(true);
  };

  const handleCloseAddNoteModal = () => {
    setAddNoteModalOpen(false);
  };

  if (!caseData) return <Typography variant="h5">Loading...</Typography>;
  const getFriendlyName = (path) => {
    const fileName = path.split("/").pop();
    const parts = fileName.split("-");
    const extIndex = fileName.lastIndexOf(".");
    const originalName = parts.slice(0, -2).join("-");
    return `${originalName}${fileName.substring(extIndex)}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Card sx={{ width: "80%", margin: 2, boxShadow: 6, borderRadius: 3 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Box
              sx={{ width: "100%" }}
              display="flex"
              justifyContent="space-between"
              mb={2}
            >
              <Typography
                sx={{ marginRight: 2 }}
                variant="h5"
                gutterBottom
                color="primary"
              >
                {caseData.Case.caseType.name}
              </Typography>
              {caseData.Case.isActive && (
                <Chip label="Active" color="success" />
              )}
              {caseData.Case.isClosed && <Chip label="Closed" color="error" />}
            </Box>
          </Box>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            {caseData.Case.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>
              Court: {caseData.Case.court_branch.name} |{" "}
              {caseData.Case.court_branch.city}
            </strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Court Admin:</strong>{" "}
            {caseData.Case.court_branch.admin.full_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Court Date: </strong> {caseData.Case.init_date}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>More Details: </strong>
            {Object.entries(caseData.Case.data).map(([key, value]) => (
              <Fragment key={key}>
                <strong>{key}: </strong>
                {value}
                <br />
              </Fragment>
            ))}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Defendant:{" "}
            {defendant.first_name
              ? defendant.first_name + " " + defendant.last_name
              : "No defendant found"}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Defendant Lawyers:{" "}
            {defendantLawyers.length > 0
              ? defendantLawyers
                  .map((lawyer) => lawyer.first_name + " " + lawyer.last_name)
                  .join(", ")
              : "No defendant lawyers found"}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Plaintiff:{" "}
            {plaintiff.first_name
              ? plaintiff.first_name + " " + plaintiff.last_name
              : "No plaintiff found"}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Plaintiff Lawyers:{" "}
              {plaintiffLawyers.length > 0
                ? plaintiffLawyers
                    .map((lawyer) => lawyer.first_name + " " + lawyer.last_name)
                    .join(", ")
                : "No plaintiff lawyers found"}
            </Typography>
          </Typography>

          <Divider
            sx={{ margin: "1rem 0", backgroundColor: "rgba(0, 0, 0, 0.12)" }}
          />
          <Typography variant="h6" gutterBottom>
            Lawyers:
          </Typography>
          {caseData.lawyer.map((lawyerr) => {
            return (
              <Box key={lawyerr._id} display="flex" alignItems="center" gap={2}>
                <img
                  src={`http://localhost:5000/${lawyerr}`}
                  alt="Lawyer"
                  style={{ width: 100, height: 100, borderRadius: "50%" }}
                />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {lawyerr.first_name + " " + lawyerr.last_name}
                    <Rating
                      name="lawyer-rating"
                      value={lawyerr.assessment}
                      readOnly
                      size="small"
                      sx={{
                        ml: 1,
                      }}
                    />
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {lawyerr.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {lawyerr.specialization}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<StarIcon />}
                      onClick={() => {
                        handleAddFeedBack();
                        setLawyerFeedback(lawyerr);
                      }}
                    >
                      Add Feedback
                    </Button>
                  </Box>
                </Box>
              </Box>
            );
          })}
          <Divider
            sx={{ margin: "1rem 0", backgroundColor: "rgba(0, 0, 0, 0.12)" }}
          />
          <Typography variant="h6" gutterBottom>
            Judges:
          </Typography>
          {caseData.Case.judges.map((judge) => (
            <Box key={judge._id} display="flex" alignItems="center" gap={2}>
              <img
                src={`http://localhost:5000/${judge.photo}`}
                alt="Judge"
                style={{ width: 100, height: 100, borderRadius: "50%" }}
              />
              <Box>
                <Typography variant="h6" gutterBottom>
                  {judge.first_name +
                    " " +
                    judge.second_name +
                    " " +
                    judge.third_name +
                    " " +
                    judge.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <LocationOnIcon
                    sx={{ fontSize: 16, verticalAlign: "middle" }}
                  />{" "}
                  {judge.address.city + ", " + judge.address.street}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <PhoneIcon sx={{ fontSize: 16, verticalAlign: "middle" }} />
                  {judge.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <EmailIcon sx={{ fontSize: 16, verticalAlign: "middle" }} />
                  {judge.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <AccessTimeFilledIcon
                    sx={{ fontSize: 16, verticalAlign: "middle" }}
                  />
                  {judge.experience} of experience
                </Typography>
              </Box>
            </Box>
          ))}
          <Divider
            sx={{ margin: "1rem 0", backgroundColor: "rgba(0, 0, 0, 0.12)" }}
          />

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Documents</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {caseData.case_documents.length ? (
                <List>
                  {caseData.case_documents.map((doc, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={`Document ${index + 1}`}
                        secondary={getFriendlyName(doc.path)}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        href={`http://localhost:5000/${doc.path}`}
                        target="_blank"
                      >
                        Download
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No documents available.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Notes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {caseData.notes.length ? (
                <List>
                  {caseData.notes.map((note) => {
                    return (
                      <ListItem key={note._id} divider>
                        <ListItemText
                          primary={note.note}
                          secondary={`Added by: ${
                            note.addedBy.first_name +
                            " " +
                            note.addedBy.last_name
                          } | Created: ${new Date(
                            note.createdAt
                          ).toLocaleString()}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No notes available.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </CardContent>

        <CardActions sx={{ flexWrap: "wrap", justifyContent: "space-evenly" }}>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              size="small"
              variant="contained"
              startIcon={<NoteAddIcon />}
              onClick={handleOpenAddNoteModal}
            >
              Add Note
            </Button>
            <Button
              size="small"
              variant="contained"
              href={`/scheduler/${id}`}
              fullWidth
              startIcon={<AccessTimeIcon />}
            >
              View Scheduler
            </Button>
          </Box>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              size="small"
              variant="contained"
              component="label"
              fullWidth
              startIcon={<AddIcon />}
            >
              Add Document
              <input
                type="file"
                hidden
                onChange={(e) => setNewDocument(e.target.files[0])}
              />
            </Button>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={handleDocumentUpload}
              disabled={!newDocument}
            >
              Upload Document
            </Button>
          </Box>
        </CardActions>
      </Card>
      <Grid container spacing={2}>
        <Typography variant="h5" sx={{ marginTop: 2 }}>
          Courts
        </Typography>
        {courtData.map((court) => (
          <Grid item xs={12} sm={12} md={12} key={court._id}>
            <Card variant="outlined" sx={{ width: "400px", margin: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Case ID: {court.caseId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {court.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Initiator:</strong>{" "}
                  {court.initiator.first_name +
                    " " +
                    court.initiator.second_name +
                    " " +
                    court.initiator.third_name +
                    " " +
                    court.initiator.last_name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  <AccessTime
                    sx={{ verticalAlign: "middle", marginRight: 0.5 }}
                  />
                  {new Date(court.time).toLocaleString()}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {!court.hasStarted && !court.hasFinished && (
                    <Chip label="Upcoming" color="primary" />
                  )}
                  {court.hasStarted && !court.hasFinished && (
                    <Chip label="In Progress" color="secondary" />
                  )}
                  {court.hasFinished && (
                    <Chip label="Finished" color="default" />
                  )}
                </Typography>

                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="h6">Judges:</Typography>

                  <List sx={{ padding: 0 }}>
                    {court.admins.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No admins assigned.
                      </Typography>
                    ) : (
                      court.admins.map((admin) => (
                        <div key={admin}>
                          <ListItem sx={{ paddingLeft: 0, paddingRight: 0 }}>
                            <ListItemText
                              primary={
                                courtAdmins[admin]
                                  ? `${courtAdmins[admin].first_name} ${courtAdmins[admin].last_name}`
                                  : "Admin not found"
                              }
                            />
                          </ListItem>
                          <Divider />
                        </div>
                      ))
                    )}
                  </List>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: 2 }}
                >
                  <strong>Guests:</strong> {court.guests.length} participants
                </Typography>
              </CardContent>
              {!court.hasFinished && (
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      navigate(`/user/join-court`);
                    }}
                  >
                    Join Court
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Add Note Modal */}
      <Modal
        open={addNoteModalOpen}
        onClose={handleCloseAddNoteModal}
        aria-labelledby="add-note-modal"
        aria-describedby="add-note-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Stack spacing={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography id="add-note-modal" variant="h6">
                Add Note
              </Typography>
              <IconButton
                sx={{ width: 40, height: 40 }}
                onClick={handleCloseAddNoteModal}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <TextField
              label="Note"
              name="note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
            <Button variant="contained" onClick={handleAddNote} fullWidth>
              Add Note
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        open={feedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        aria-labelledby="feedback-modal"
        aria-describedby="feedback-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Stack spacing={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography id="feedback-modal" variant="h6">
                Add Feedback
              </Typography>
              <IconButton
                sx={{ width: 40, height: 40 }}
                onClick={handleCloseFeedbackModal}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Star Rating */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="body1">Rate your experience:</Typography>
              <Rating
                name="feedback-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                size="large"
              />
            </Box>

            {/* Feedback Input */}
            <TextField
              label="Your Feedback"
              name="feedback"
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={submitFeedback}
              fullWidth
            >
              Submit Feedback
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default Case;
