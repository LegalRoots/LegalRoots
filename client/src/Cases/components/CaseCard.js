import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Avatar,
  Stack,
  Chip,
  Tooltip,
  Box,
  List,
  ListItem,
  ListItemText,
  Drawer,
  TextField,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import { Close } from "@mui/icons-material";
import axios from "axios";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth";
const CaseCard = () => {
  const { user } = useContext(AuthContext);

  const [cases, setCases] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    case_title: "",
    case_type: "",
    case_description: "",
    court_date: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/JusticeRoots/cases/user/${user._id}`
        );
        setCases(response.data);
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };

    fetchCases();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCase((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCase = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/JusticeRoots/cases?userId=${user._id}`,
        newCase
      );
      setCases((prev) => [...prev, response.data]);
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error adding new case:", error);
    }
  };

  const handleMarkDone = async (caseId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/JusticeRoots/cases/markDone`,
        {
          caseId,
        }
      );
      const updatedCases = cases.map((caseItem) =>
        caseItem._id === caseId ? response.data : caseItem
      );
      setCases(updatedCases);
    } catch (error) {
      console.error("Error marking case as done:", error);
    }
  };

  return (
    <Box sx={{ width: "80%" }}>
      <Typography gutterBottom variant="h4" component="div">
        Cases
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: "16px", width: "fit-content" }}
        onClick={() => setDrawerOpen(true)}
      >
        Add New Case
      </Button>
      <Grid
        sx={{
          width: "100%",
        }}
        container
        spacing={2}
      >
        {cases.map((caseItem) => (
          <Grid key={caseItem._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              key={caseItem._id}
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: 2,
                marginBottom: "16px",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: "bold", marginBottom: "8px" }}
                >
                  {caseItem.case_title}
                </Typography>
                <Chip
                  label={caseItem.case_type}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: "12px",
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginBottom: "12px" }}
                >
                  {caseItem.case_description}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ marginBottom: "12px" }}
                >
                  <Tooltip title="Lawyer">
                    <Avatar sx={{ bgcolor: "#4caf50" }}>
                      {caseItem.lawyer
                        ? caseItem.lawyer.first_name.charAt(0).toUpperCase()
                        : "N/A"}
                    </Avatar>
                  </Tooltip>
                  <Typography variant="subtitle1" color="text.primary">
                    {caseItem.lawyer
                      ? caseItem.lawyer.first_name +
                        " " +
                        caseItem.lawyer.last_name
                      : "No lawyer assigned"}
                  </Typography>
                </Stack>
                <Typography variant="subtitle2" color="text.secondary">
                  Court Date:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {format(
                      new Date(caseItem.court_date),
                      "MMMM dd, yyyy h:mm a"
                    )}
                  </span>
                </Typography>
                <Typography
                  variant="subtitle2"
                  color={
                    caseItem.status === "Open" ? "success.main" : "warning.main"
                  }
                  sx={{ marginTop: "12px", fontWeight: "bold" }}
                >
                  Status: {caseItem.status}
                </Typography>
              </CardContent>
              <CardActions>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    onClick={() => {
                      navigate(`/user/my-cases/${caseItem._id}`);
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={() => {
                      handleMarkDone(caseItem._id);
                    }}
                    variant="outlined"
                    size="small"
                    color="secondary"
                  >
                    Mark as Completed
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Drawer
        anchor="right"
        open={drawerOpen}
        PaperProps={{ width: 400 }}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 400,
            padding: 2,
          }}
        >
          <Box sx={{ display: "flex" }} mb={2}>
            <Typography width={"100%"} variant="h6">
              Add New Case
            </Typography>
            <IconButton
              sx={{ width: "20px" }}
              onClick={() => setDrawerOpen(false)}
            >
              <Close />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Case Title"
            name="case_title"
            value={newCase.case_title}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Case Type"
            name="case_type"
            value={newCase.case_type}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Case Description"
            name="case_description"
            value={newCase.case_description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Court Date"
            name="court_date"
            value={newCase.court_date}
            onChange={handleInputChange}
            margin="normal"
            type="datetime-local"
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: "16px" }}
            onClick={handleAddCase}
          >
            Add Case
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CaseCard;
