import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../shared/context/auth";
import { useNavigate } from "react-router-dom";

const LawyerCases = () => {
  const navigate = useNavigate();
  const [plaintiffCases, setPlaintiffCases] = useState([]);
  const [defendantCases, setDefendantCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("plaintiff");
  const [users, setUsers] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const [plaintiffRes, defendantRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/JusticeRoots/cases/lawyerPlaintiff/${user._id}`
          ),
          axios.get(
            `http://localhost:5000/JusticeRoots/cases/lawyerDefendant/${user._id}`
          ),
        ]);
        const allCases = [...plaintiffRes.data, ...defendantRes.data];

        const uniqueSSIDs = [
          ...new Set(allCases.map((caseItem) => caseItem.user)),
        ];

        const userResponses = await Promise.all(
          uniqueSSIDs.map((ssid) =>
            axios.get(`http://localhost:5000/JusticeRoots/users/${ssid}`)
          )
        );

        const usersMap = userResponses.reduce((acc, res, index) => {
          acc[uniqueSSIDs[index]] = res.data;
          return acc;
        }, {});

        setPlaintiffCases(plaintiffRes.data);
        setDefendantCases(defendantRes.data);
        setUsers(usersMap);
      } catch (err) {
        console.error("Error fetching cases or users:", err);
        setError("Failed to load cases or user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [user._id]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
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

  if (error) {
    return (
      <Box sx={{ textAlign: "center", padding: 4 }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const casesToShow =
    selectedType === "plaintiff" ? plaintiffCases : defendantCases;

  return (
    <Box sx={{ width: "80%", padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lawyer Cases
      </Typography>
      <FormControl sx={{ minWidth: 200, marginBottom: 4 }}>
        <InputLabel id="case-type-label">Case Type</InputLabel>
        <Select
          labelId="case-type-label"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <MenuItem value="plaintiff">Plaintiff Cases</MenuItem>
          <MenuItem value="defendant">Defendant Cases</MenuItem>
        </Select>
      </FormControl>
      {casesToShow.length === 0 ? (
        <Typography>No cases available for the selected type.</Typography>
      ) : (
        <Grid container spacing={3}>
          {casesToShow.map((caseItem) => (
            <Grid item xs={12} sm={6} md={4} key={caseItem._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", marginBottom: 1 }}
                  >
                    {caseItem.Case.caseType.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: 1 }}
                  >
                    {caseItem.Case.description}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Court:</strong> {caseItem.Case.court_branch.name}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Judge:</strong>{" "}
                    {caseItem.Case.judges[0]?.first_name}{" "}
                    {caseItem.Case.judges[0]?.last_name}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Client:</strong>{" "}
                    {users[caseItem.user]?.user.first_name}{" "}
                    {users[caseItem.user]?.user.last_name}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Case Status:</strong> {caseItem.status || "Pending"}
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: "auto", justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/lawyer/cases/${caseItem._id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default LawyerCases;
