import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Avatar,
  Tooltip,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { format } from "date-fns";
import { AuthContext } from "../../shared/context/auth";
import { useNavigate } from "react-router-dom";

const CaseCard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [plaintiffCases, setPlaintiffCases] = useState([]);
  const [defendantCases, setDefendantCases] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("plaintiff");

  useEffect(() => {
    const fetchPlaintiffCases = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/JusticeRoots/cases/user/plaintiff/${user.SSID}`
        );
        setPlaintiffCases(response.data);
      } catch (error) {
        console.error("Error fetching plaintiff cases:", error);
      }
    };

    const fetchDefendantCases = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/JusticeRoots/cases/user/defendant/${user.SSID}`
        );
        setDefendantCases(response.data);
      } catch (error) {
        console.error("Error fetching defendant cases:", error);
      }
    };

    fetchPlaintiffCases();
    fetchDefendantCases();
  }, [user.SSID]);
  const renderCaseCard = (caseData) => {
    const {
      Case: {
        caseType,
        judges,
        court_branch,
        data,
        description,
        init_date,
        isActive,
        isClosed,
      },
      lawyer,
    } = caseData;

    return (
      <Card
        key={caseData._id}
        sx={{
          mb: 2,
          border: `2px solid ${isClosed ? "red" : isActive ? "green" : "gray"}`,
          borderRadius: "12px",
          padding: 2,
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Typography variant="h6">{caseType?.name}</Typography>
            <Chip
              label={isClosed ? "Closed" : isActive ? "Active" : "Inactive"}
              color={isClosed ? "error" : isActive ? "success" : "default"}
            />
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Court:</strong> {court_branch?.name} (
                {court_branch?.city})
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Filed On:</strong>{" "}
                {format(new Date(init_date), "dd MMM yyyy")}
              </Typography>
              <Divider sx={{ mt: 2 }} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Details:</strong>
              </Typography>
              <Stack spacing={1} mt={1}>
                {Object.entries(data).map(([key, value]) => (
                  <Typography key={key} variant="body2">
                    {key}: {value}
                  </Typography>
                ))}
              </Stack>
              <Box mt={2}>
                <Button
                  onClick={() => {
                    navigate(`/user/my-cases/${caseData._id}`);
                  }}
                  variant="contained"
                  size="small"
                >
                  Show More Details
                </Button>
              </Box>
            </Grid>

            <Divider orientation="vertical" flexItem />

            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Judges:</strong>
              </Typography>
              <Stack direction="row" spacing={1} mt={1}>
                {judges.map((judge) => (
                  <Tooltip
                    key={judge._id}
                    title={`${judge.first_name} ${judge.last_name}`}
                  >
                    <Avatar>{judge.first_name[0]}</Avatar>
                  </Tooltip>
                ))}
              </Stack>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Lawyers:</strong>
              </Typography>
              <Stack direction="row" spacing={1} mt={1}>
                {lawyer &&
                  lawyer.map((lawyerr) => (
                    <Tooltip
                      key={lawyerr._id}
                      title={`${lawyerr.first_name} ${lawyerr.last_name}`}
                    >
                      <Avatar>{lawyerr.first_name[0]}</Avatar>
                    </Tooltip>
                  ))}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderCases = () => {
    const cases =
      selectedCategory === "plaintiff" ? plaintiffCases : defendantCases;

    if (cases.length === 0) {
      return (
        <Typography>No cases where you are a {selectedCategory}.</Typography>
      );
    }

    return cases.map((caseData) => renderCaseCard(caseData));
  };

  return (
    <Box sx={{ padding: 4 }}>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="case-category-select-label">Case Category</InputLabel>
        <Select
          labelId="case-category-select-label"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <MenuItem value="plaintiff">Plaintiff Cases</MenuItem>
          <MenuItem value="defendant">Defendant Cases</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={4}>
        <Grid size={12}>
          <Typography variant="h5" gutterBottom>
            {selectedCategory === "plaintiff"
              ? "Plaintiff Cases"
              : "Defendant Cases"}
          </Typography>
          {renderCases()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseCard;
