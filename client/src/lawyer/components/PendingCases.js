import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../shared/context/auth";

const PendingCases = () => {
  const [pendingCases, setPendingCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPendingCases = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/JusticeRoots/cases/assignments/pending/${user._id}`
        );
        setPendingCases(response.data);
      } catch (error) {
        console.error("Error fetching pending cases:", error);
        alert("Failed to load pending cases.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCases();
  }, []);

  const handleStatusUpdate = async (caseId, status) => {
    setUpdating(caseId);
    try {
      await axios.put(
        `http://localhost:5000/JusticeRoots/cases/assignments/${caseId}`,
        { status }
      );
      setPendingCases((prev) =>
        prev.filter((assignment) => assignment._id !== caseId)
      );
      alert(`Case ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(`Error updating case status to ${status}:`, error);
      alert(`Failed to update the case to ${status}.`);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Pending Case Assignments
      </Typography>
      {pendingCases.length === 0 ? (
        <Typography>No pending cases at the moment.</Typography>
      ) : (
        pendingCases.map((assignment) => (
          <Card
            key={assignment._id}
            sx={{ marginBottom: 3, boxShadow: 3, borderRadius: 2 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Case Title: {assignment.caseId.case_title}
              </Typography>
              <Typography>
                <strong>Client:</strong> {assignment.clientId.first_name}{" "}
                {assignment.clientId.last_name} ({assignment.clientId.email})
              </Typography>
              <Typography>
                <strong>Status:</strong> {assignment.status}
              </Typography>
              <Typography>
                <strong>Requested At:</strong>{" "}
                {new Date(assignment.requestedAt).toLocaleString()}
              </Typography>
              {assignment.caseId.case_description && (
                <Typography>
                  <strong>Case Details:</strong>{" "}
                  {assignment.caseId.case_description}
                </Typography>
              )}
              {assignment.caseId.case_type && (
                <Typography>
                  <strong>Case Type:</strong> {assignment.caseId.case_type}
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleStatusUpdate(assignment._id, "Accepted")}
                disabled={updating === assignment._id}
              >
                {updating === assignment._id ? (
                  <CircularProgress size={24} />
                ) : (
                  "Accept"
                )}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleStatusUpdate(assignment._id, "Denied")}
                disabled={updating === assignment._id}
              >
                {updating === assignment._id ? (
                  <CircularProgress size={24} />
                ) : (
                  "Deny"
                )}
              </Button>
            </CardActions>
          </Card>
        ))
      )}
    </Box>
  );
};

export default PendingCases;
