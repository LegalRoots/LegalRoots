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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { AuthContext } from "../../shared/context/auth";
const { useParams } = require("react-router-dom");

const LawyerCaseDetails = () => {
  const toast = useToast();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [caseData, setCaseData] = useState({});
  const [newComment, setNewComment] = useState("");
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [documentToUpload, setDocumentToUpload] = useState(null);

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

  const handleUploadDocument = async () => {
    if (!documentToUpload) {
      toast({
        title: "Please select a document to upload!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const formData = new FormData();
    formData.append("file", documentToUpload);
    try {
      await axios.post(
        `http://localhost:5000/JusticeRoots/cases/${id}/lawyer-documents`,
        formData
      );
      setDocumentToUpload(null);
      toast({
        title: "Document uploaded successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
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

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Comment cannot be empty!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/JusticeRoots/cases/${id}/lawyer-comments`,
        { comment: newComment, lawyerId: user._id }
      );
      setCaseData((prev) => ({
        ...prev,
        comments: [...prev.comments, response.data],
      }));
      setNewComment("");
      setCommentModalOpen(false);
      toast({ title: "Comment added successfully!", status: "success" });
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast({
        title: "Failed to add comment!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openCommentModal = () => setCommentModalOpen(true);
  const closeCommentModal = () => setCommentModalOpen(false);

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
          <Typography variant="h5" gutterBottom color="primary">
            {caseData.case_title}
          </Typography>
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
            Assigned Client: {caseData.client?.name || "Not Assigned"}
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Documents</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {caseData.documents?.length ? (
                <List>
                  {caseData.documents.map((doc, index) => (
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
              <Typography>Comments</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {caseData.comments?.length ? (
                <List>
                  {caseData.comments.map((comment) => (
                    <ListItem key={comment._id} divider>
                      <ListItemText
                        primary={comment.comment}
                        secondary={`Added: ${new Date(
                          comment.createdAt
                        ).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No comments available.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </CardContent>

        <CardActions>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={openCommentModal}
          >
            Add Comment
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            component="label"
            startIcon={<NoteAddIcon />}
          >
            Upload Document
            <input
              type="file"
              hidden
              onChange={(e) => setDocumentToUpload(e.target.files[0])}
            />
          </Button>
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleUploadDocument}
            disabled={!documentToUpload}
          >
            Submit Document
          </Button>
        </CardActions>
      </Card>

      {/* Add Comment Modal */}
      <Modal
        open={commentModalOpen}
        onClose={closeCommentModal}
        aria-labelledby="add-comment-modal"
        aria-describedby="add-comment-description"
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
            <Typography id="add-comment-modal" variant="h6">
              Add Comment
            </Typography>
            <TextField
              label="Comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComment}
              fullWidth
            >
              Submit Comment
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default LawyerCaseDetails;
