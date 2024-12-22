import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Scheduler, { Resource } from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.light.css";
import { Box, Typography, Paper, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid2";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  schedulerWrapper: {
    marginTop: theme.spacing(4),
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: "#1e88e5",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1565c0",
    },
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[3],
  },
}));

const SchedulerPage = () => {
  const groups = ["assignedTo"];
  const { id } = useParams();
  const caseId = id;
  const [schedulerData, setSchedulerData] = useState([]);
  const classes = useStyles();

  // Fetch tasks for the scheduler
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
          text: text,
          assignedTo: assignedTo,
          startDate: startDate,
          endDate: endDate,
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
    <Box className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Case Scheduler for Case #{caseId}
      </Typography>
      <Paper className={classes.paper}>
        <Typography variant="h6">Tasks Overview</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1">
              View and manage tasks related to this case.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Box className={classes.schedulerWrapper}>
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
              setSchedulerData(schedulerData.filter((task) => task.id !== id));
            } catch (error) {
              console.error("Failed to delete task", error);
            }
          }}
          groups={groups}
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
  );
};

export default SchedulerPage;
