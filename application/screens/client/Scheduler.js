import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Button,
  Text,
  Switch,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Calendar as BigCalendar } from "react-native-big-calendar";
import axios from "axios";
import { API_URL } from "@env";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

const SchedulerPage = () => {
  const route = useRoute();
  const caseId = route.params.id;
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [taskText, setTaskText] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("Client");
  const [allDay, setAllDay] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/JusticeRoots/cases/${caseId}`
        );
        const caseTasks = response.data.tasks.map((task) => {
          let end = new Date(task.endDate);
          let start = new Date(task.startDate);
          if (task.allDay) {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
          }
          return {
            title: task.text,
            start: new Date(task.startDate),
            end: end,
            assignedTo: task.assignedTo,
            description: task.description,
            id: task._id,
            status: task.status,
            allDay: task.allDay,
          };
        });
        setTasks(caseTasks);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch tasks: " + error.message);
      }
    };

    fetchTasks();
  }, [caseId]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true); // Show modal for selecting time and adding task
  };

  const handleTimeChange = (event, selectedDate) => {
    const currentTime = selectedDate || startTime;
    setStartTime(currentTime);
  };

  const handleEndTimeChange = (event, selectedDate) => {
    const currentTime = selectedDate || endTime;
    setEndTime(currentTime);
  };

  const handleSubmitTask = async () => {
    if (!taskTitle || !taskText) {
      Alert.alert("Error", "Task title and description are required");
      return;
    }
    const ENDTIME = allDay ? endTime.setHours(23, 59, 59, 999) : endTime;
    const appointmentData = {
      text: taskTitle,
      startDate: startTime,
      endDate: ENDTIME,
      assignedTo,
      allDay,
      description: taskText,
    };

    try {
      const response = await axios.post(
        `${API_URL}/JusticeRoots/cases/tasks/${caseId}`,
        {
          text: appointmentData.text,
          assignedTo: appointmentData.assignedTo,
          startDate: appointmentData.startDate,
          endDate: appointmentData.endDate,
          allDay: appointmentData.allDay,
          description: appointmentData.description,
        }
      );

      const updatedCase = response.data;
      const tasks = updatedCase.tasks.map((task) => {
        let end = new Date(task.endDate);
        let start = new Date(task.startDate);
        if (task.allDay) {
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
        }
        return {
          title: task.text,
          start: new Date(task.startDate),
          end: end,
          assignedTo: task.assignedTo,
          description: task.description,
          id: task._id,
          status: task.status,
          allDay: task.allDay,
        };
      });
      setTasks(tasks);
      setModalVisible(false); // Close modal after adding the task
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Calendar for selecting dates */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={tasks.reduce((acc, task) => {
          const dateKey = task.start.toISOString().split("T")[0];
          acc[dateKey] = {
            marked: true,
            dotColor: task.assignedTo === "Lawyer" ? "blue" : "green",
          };
          return acc;
        }, {})}
      />

      {/* BigCalendar for detailed task views */}
      <BigCalendar
        events={tasks}
        height={600}
        onPressEvent={(event) => {
          Alert.alert(
            "Task Details",
            `Title: ${event.title}\nAssigned To: ${event.assignedTo}\nStatus: ${event.status}\nDescription: ${event.description}\nAll Day: ${event.allDay}`
          );
        }}
      />

      {/* Modal for adding task */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={taskTitle}
            onChangeText={setTaskTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Task Description"
            value={taskText}
            onChangeText={setTaskText}
          />
          <Text>Assigned To</Text>
          <View style={styles.radioGroup}>
            <Button
              title="Client"
              onPress={() => setAssignedTo("Client")}
              color={assignedTo === "Client" ? "blue" : "gray"}
            />
            <Button
              title="Lawyer"
              onPress={() => setAssignedTo("Lawyer")}
              color={assignedTo === "Lawyer" ? "blue" : "gray"}
            />
          </View>

          <Text>Start Time</Text>
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
          {!allDay && (
            <>
              <Text>End Time</Text>
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={handleEndTimeChange}
              />
            </>
          )}
          <View style={styles.switchContainer}>
            <Text>All Day</Text>
            <Switch
              value={allDay}
              onValueChange={(value) => setAllDay(value)}
            />
          </View>
          <Button title="Add Task" onPress={handleSubmitTask} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 32,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    width: "80%",
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default SchedulerPage;
