import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Scheduler, { Resource } from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.material.orange.light.css";

import {
  Box,
  Typography,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Grid from "@mui/material/Grid";

const SchedulerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseId = id;
  const [schedulerData, setSchedulerData] = useState([]);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/JusticeRoots/cases/${id}`
        );
        const caseData = response.data;
        const tasks = caseData.tasks.map((task) => ({
          text: task.text,
          startDate: task.startDate,
          endDate: task.endDate,
          assignedTo: task.assignedTo,
          id: task._id,
          status: task.status,
          allDay: task.allDay,
          description: task.description,
        }));
        setSchedulerData(tasks);
      } catch (error) {
        console.error("Failed to fetch case:", error);
      }
    };
    fetchCase();
  }, [id]);

  const handleAppointmentAdding = async (e) => {
    const { text, startDate, endDate, assignedTo } = e.appointmentData;
    try {
      const response = await axios.post(
        `http://localhost:5000/JusticeRoots/cases/tasks/${id}`,
        {
          text,
          assignedTo,
          startDate,
          endDate,
          allDay: e.appointmentData.allDay,
          description: e.appointmentData.description,
        }
      );

      const updatedCase = response.data;
      const tasks = updatedCase.tasks.map((task) => ({
        text: task.text,
        startDate: task.startDate,
        endDate: task.endDate,
        assignedTo: task.assignedTo,
        taskId: task.taskId,
        id: task._id,
        status: task.status,
        allDay: task.allDay,
        description: task.description,
      }));
      setSchedulerData(tasks);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            sx={{ width: "50px", height: "50px" }}
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Go Back
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{ padding: 3, backgroundColor: "background.default", flexGrow: 1 }}
      >
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tasks for Case {caseId}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                View and manage tasks related to this case.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Box
          sx={{
            marginTop: 3,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          <Scheduler
            dataSource={schedulerData}
            defaultCurrentDate={new Date()}
            startDayHour={8}
            endDayHour={18}
            height={600}
            onAppointmentFormOpening={(e) => {
              e.form.itemOption("recurrenceRule", "disabled", true);
            }}
            editing={{
              allowAdding: true,
              allowUpdating: true,
              allowDeleting: true,
              allowDragging: false,
            }}
            onAppointmentAdding={handleAppointmentAdding}
            onAppointmentDeleted={async (e) => {
              const { id } = e.appointmentData;
              try {
                await axios.delete(
                  `http://localhost:5000/JusticeRoots/cases/${caseId}/tasks/${id}`
                );
                setSchedulerData(
                  schedulerData.filter((task) => task.id !== id)
                );
              } catch (error) {
                console.error("Failed to delete task", error);
              }
            }}
            groups={["assignedTo"]}
            onAppointmentUpdated={async (e) => {
              const updatedTask = e.appointmentData;
              try {
                await axios.put(
                  `http://localhost:5000/JusticeRoots/cases/${caseId}/tasks/${updatedTask.id}`,
                  updatedTask
                );
                setSchedulerData(
                  schedulerData.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                  )
                );
              } catch (error) {
                console.error("Failed to update task", error);
              }
            }}
            descriptionExpr="description"
          >
            <Resource
              fieldExpr="assignedTo"
              dataSource={[
                { id: "Lawyer", color: "#1e88e5", text: "Lawyer Tasks" },
                { id: "Client", color: "#43a047", text: "Client Tasks" },
              ]}
              label="Assigned To"
            />
          </Scheduler>
        </Box>
      </Box>
    </Box>
  );
};

export default SchedulerPage;
