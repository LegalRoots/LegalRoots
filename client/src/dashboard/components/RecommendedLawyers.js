import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Chip,
  CardMedia,
  Grid,
  Box,
  Button,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";

const RecommendedLawyersSlider = ({
  handleShowDetails,
  handleHireLawyer,
  recommendedLawyers,
}) => {
  if (!recommendedLawyers || recommendedLawyers.length === 0) {
    return (
      <Typography variant="body1" textAlign="center" mt={3}>
        No recommended lawyers available for this specialization.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Typography variant="h5" textAlign="center" mt={3}>
        Recommended Lawyers
      </Typography>

      <Box
        sx={{
          width: "100%",
          mt: 3,
        }}
      >
        <Carousel
          sx={{
            width: "40%",
            margin: "auto",
            overflow: "visible",
          }}
          animation="slide"
          indicators={false}
          navButtonsAlwaysVisible
          navButtonsProps={{
            style: {
              backgroundColor: "#ffbf00",
              borderRadius: "50%",
              padding: "0px",
            },
          }}
          autoPlay={true}
        >
          {recommendedLawyers.map((lawyer) => (
            <Card
              key={lawyer.id}
              sx={{
                display: "flex",
                m: 2,
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: 120, height: 120, borderRadius: "50%", m: 2 }}
                image={
                  `http://localhost:5000/uploads/images/${lawyer.photo}` ||
                  "/default-profile.png"
                }
                alt={lawyer.name}
              />
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h6">
                  {lawyer.first_name} {lawyer.last_name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  {lawyer.specialization}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lawyer.yearsOfExperience} years of experience
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  ${lawyer.consultation_price}/hr
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ⭐ {lawyer.assessment}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🎉 {lawyer.wonCases} won cases
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={handleShowDetails(lawyer)}
                >
                  More Details
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={handleHireLawyer(lawyer._id)}
                >
                  Hire Lawyer
                </Button>
              </CardContent>
            </Card>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
};

export default RecommendedLawyersSlider;
