import React, { useEffect, useState, useContext } from "react";
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
} from "@mui/material";
import { useToast } from "@chakra-ui/react";
import Grid from "@mui/material/Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import axios from "axios";
import { AuthContext } from "../../shared/context/auth";
const { useParams } = require("react-router-dom");

const Case = () => {
  const toast = useToast();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [caseData, setCaseData] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState(null);
  const [editedCase, setEditedCase] = useState({});
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/JusticeRoots/cases/${id}`
        );
        setCaseData(response.data);
      } catch (error) {
        console.error("Failed to fetch case:", error);
      }
    };
    fetchCase();
  }, [id]);

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

  const handleEditCase = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/JusticeRoots/cases/${id}`,
        editedCase
      );
      setCaseData(response.data);
      setEditModalOpen(false);
      toast({
        title: "Case updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update case:", error);
      toast({
        title: "Failed to update case!",
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
        { note: newNote, user: user._id }
      );
      setCaseData((prev) => ({
        ...prev,
        notes: [...prev.notes, response.data],
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

  const handleOpenEditModal = () => {
    setEditedCase({
      case_title: caseData.case_title,
      case_description: caseData.case_description,
      case_type: caseData.case_type,
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleOpenAddNoteModal = () => {
    setAddNoteModalOpen(true);
  };

  const handleCloseAddNoteModal = () => {
    setAddNoteModalOpen(false);
  };

  const handleDeleteCase = async () => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      try {
        await axios.delete(`http://localhost:5000/JusticeRoots/cases/${id}`);
        toast({
          title: "Case deleted successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        window.location.href = "/user/my-cases";
      } catch (error) {
        console.error("Failed to delete case:", error);
        toast({
          title: "Failed to delete case!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  if (!caseData.case_title)
    return <Typography variant="h5">Loading...</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Card sx={{ width: "100%", margin: 2, boxShadow: 6, borderRadius: 3 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Typography variant="h5" gutterBottom color="primary">
              {caseData.case_title}
            </Typography>
            <IconButton
              sx={{ width: "40px", height: "40px" }}
              color="error"
              onClick={handleDeleteCase}
              title="Delete Case"
              size="large"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            {caseData.case_description}
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Chip label={`Type: ${caseData.case_type}`} color="info" />
            <Chip label={`Status: ${caseData.status}`} color="success" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Court Date: {new Date(caseData.court_date).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Created At: {new Date(caseData.createdAt).toLocaleString()}
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            Lawyer:{" "}
            {caseData.lawyer
              ? caseData.lawyer.first_name + " " + caseData.lawyer.last_name
              : "No lawyer assigned"}
          </Typography>

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
                        secondary={doc.path}
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
                  {caseData.notes.map((note) => (
                    <ListItem key={note._id} divider>
                      <ListItemText
                        primary={note.note}
                        secondary={`Added by: ${
                          note.addedBy
                        } | Created: ${new Date(
                          note.createdAt
                        ).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
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
              color="primary"
              onClick={handleOpenEditModal}
            >
              Edit Case
            </Button>

            <Button
              size="small"
              variant="contained"
              color="warning"
              startIcon={<NoteAddIcon />}
              onClick={handleOpenAddNoteModal}
            >
              Add Note
            </Button>
          </Box>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              size="small"
              variant="contained"
              color="secondary"
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

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-case-modal"
        aria-describedby="edit-case-description"
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
              <Typography id="edit-case-modal" variant="h6">
                Edit Case
              </Typography>
              <IconButton
                sx={{ width: 40, height: 40 }}
                onClick={handleCloseEditModal}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <TextField
              label="Case Title"
              name="case_title"
              value={editedCase.case_title}
              onChange={(e) =>
                setEditedCase({ ...editedCase, case_title: e.target.value })
              }
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Case Description"
              name="case_description"
              value={editedCase.case_description}
              onChange={(e) =>
                setEditedCase({
                  ...editedCase,
                  case_description: e.target.value,
                })
              }
              fullWidth
              multiline
              rows={3}
              variant="outlined"
            />
            <TextField
              label="Case Type"
              name="case_type"
              value={editedCase.case_type}
              onChange={(e) =>
                setEditedCase({ ...editedCase, case_type: e.target.value })
              }
              fullWidth
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditCase}
              fullWidth
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Modal>

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
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddNote}
              fullWidth
            >
              Add Note
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default Case;
