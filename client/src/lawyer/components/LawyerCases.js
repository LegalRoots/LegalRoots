import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  CardActions,
  Chip,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../shared/context/auth";
import Grid from "@mui/material/Grid2";

const LawyerCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLawyerCases = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/JusticeRoots/cases/lawyer/${user._id}`
        );
        setCases(response.data);
      } catch (error) {
        console.error("Error fetching lawyer cases:", error);
        setError("Failed to load cases.");
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerCases();
  }, [user._id]);

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

  if (error) {
    return (
      <Box sx={{ textAlign: "center", padding: 4 }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "80%", padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Assigned Cases
      </Typography>

      <Grid sx={{ width: "100%" }} container spacing={3}>
        {cases.length === 0 ? (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Typography variant="h6" color="textSecondary">
              No cases assigned yet.
            </Typography>
          </Box>
        ) : (
          cases.map((caseItem) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={caseItem._id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {caseItem.case_title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {caseItem.case_description}
                  </Typography>
                  <Chip
                    label={caseItem.case_type}
                    color="primary"
                    sx={{ marginBottom: 2 }}
                  />
                  <Typography>
                    <strong>Status:</strong> {caseItem.status}
                  </Typography>
                  <Typography>
                    <strong>Client:</strong> {caseItem.user.first_name}{" "}
                    {caseItem.user.last_name} ({caseItem.user.email})
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ justifyContent: "space-between", padding: 2 }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    href={`/lawyer/cases/${caseItem._id}`}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default LawyerCases;
