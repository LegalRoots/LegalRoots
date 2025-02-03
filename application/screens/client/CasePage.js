import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Button as RNButton,
} from "react-native";
import { Card, Divider, Chip } from "react-native-paper";
import { Rating } from "react-native-ratings";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useContext } from "react";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "@env";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../src/shared/context/auth";
import { Modal } from "react-native";
import { TextInput, IconButton, Button, List } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";

const CaseCard = () => {
  const { user, type } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { caseId } = route.params;
  const [caseData, setCaseData] = useState(null);
  const [newDocument, setNewDocument] = useState(null);
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [lawyerFeedback, setLawyerFeedback] = useState(null);
  const [defendant, setDefendant] = useState("");
  const [defendantLawyers, setDefendantLawyers] = useState("");
  const [plaintiff, setPlaintiff] = useState("");
  const [plaintiffLawyers, setPlaintiffLawyers] = useState("");
  const [newFeedback, setNewFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [courtData, setCourtData] = useState(null);
  const [courtAdmins, setCourtAdmins] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [documentExpanded, setDocumentExpanded] = useState(false);
  const handleAccordionToggle = () => {
    setDocumentExpanded(!documentExpanded);
  };
  const handlePress = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/JusticeRoots/cases/${caseId}`
        );

        const courtRes = await axios.get(
          `${API_URL}/admin/court/caseId/${response.data.Case._id}`
        );
        setCourtData(courtRes.data.courts);

        const allAdmins = [
          ...new Set(courtRes.data.courts.map((court) => court.admins).flat()),
        ];

        const adminResponses = await Promise.all(
          allAdmins.map((adminId) =>
            axios.get(`${API_URL}/admin/judges/ssid/${adminId}`)
          )
        );

        const adminsMap = adminResponses.reduce((acc, res, index) => {
          acc[allAdmins[index]] = res.data.data;
          return acc;
        }, {});

        setCourtAdmins(adminsMap);

        try {
          const caseDefendant = await axios.get(
            `${API_URL}/JusticeRoots/users/${response.data.Case.defendant}`
          );
          setDefendant(caseDefendant.data.user);
        } catch (error) {
          setDefendant("No defendant found");
        }

        try {
          const caseDefendantLawyers = await Promise.all(
            response.data.Case.defendant_lawyers.map((lawyerId) =>
              axios.get(`${API_URL}/JusticeRoots/lawyers/ssid/${lawyerId}`)
            )
          );
          setDefendantLawyers(caseDefendantLawyers.map((res) => res.data.data));
        } catch (error) {
          setDefendantLawyers("No defendant lawyers found");
        }

        const casePlaintiff = await axios.get(
          `${API_URL}/JusticeRoots/users/${response.data.Case.plaintiff}`
        );
        setPlaintiff(casePlaintiff.data.user);

        try {
          const casePlaintiffLawyers = await Promise.all(
            response.data.Case.plaintiff_lawyers.map((lawyerId) =>
              axios.get(`${API_URL}/JusticeRoots/lawyers/ssid/${lawyerId}`)
            )
          );

          setPlaintiffLawyers(casePlaintiffLawyers.map((res) => res.data.data));
        } catch (error) {
          setPlaintiffLawyers("No plaintiff lawyers found");
        }

        setCaseData(response.data);
      } catch (error) {
        console.error("Failed to fetch case:", error);
      }
    };
    fetchCase();
  }, [caseId]);

  const handleAddFeedBack = () => {
    setFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setNewFeedback("");
  };

  const submitFeedback = async () => {
    if (!newFeedback.trim()) {
      Toast.show({
        type: "error",
        text1: "Feedback cannot be empty!",
      });

      return;
    }

    if (!rating) {
      Toast.show({
        type: "error",
        text1: "Please provide a rating!",
      });

      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/JusticeRoots/lawyers/${lawyerFeedback._id}/reviews`,
        { feedback: newFeedback, rating, user: user._id }
      );

      setCaseData((prev) => ({
        ...prev,
        feedbacks: [...(prev.feedbacks || []), response.data],
      }));

      setFeedbackModalOpen(false);
      setNewFeedback("");
      setRating(0);
      Toast.show({
        type: "success",
        text1: "Feedback added successfully!",
      });
    } catch (error) {
      console.error("Failed to add feedback:", error);
      Toast.show({
        type: "error",
        text1: "Failed to add feedback!",
      });
    }
  };

  const handleDocumentUpload = async () => {
    if (!newDocument) {
      Toast.show({
        type: "error",
        text1: "Please select a document to upload!",
      });
      return;
    }
    const formData = new FormData();
    formData.append("file", newDocument);
    try {
      await axios.post(
        `${API_URL}/JusticeRoots/cases/${caseId}/documents`,
        formData
      );
      setNewDocument(null);
    } catch (error) {
      console.error("Failed to upload document:", error);
      Toast.show({
        type: "error",
        text1: "Failed to upload document!",
      });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      Toast.show({
        type: "error",
        text1: "Note cannot be empty!",
      });

      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/JusticeRoots/cases/${caseId}/notes`,
        { note: newNote, user: user._id, userType: "User" }
      );

      setCaseData((prev) => ({
        ...prev,
        notes: response.data.notes,
      }));

      setNewNote("");
      setAddNoteModalOpen(false);
      Toast.show({
        type: "success",
        text1: "Note added successfully!",
      });
    } catch (error) {
      console.error("Failed to add note:", error);
      Toast.show({
        type: "error",
        text1: "Failed to add note!",
      });
    }
  };

  if (!caseData) return <Text>Loading...</Text>;
  const getFriendlyName = (path) => {
    const fileName = path.split("/").pop();
    const parts = fileName.split("-");
    const extIndex = fileName.lastIndexOf(".");
    const originalName = parts.slice(0, -2).join("-");
    return `${originalName}${fileName.substring(extIndex)}`;
  };

  const renderLawyer = ({ item }) => (
    <View key={item._id} style={styles.lawyerCard}>
      <Image
        source={{ uri: `${API_URL}/uploads/images/${item.photo}` }}
        style={styles.lawyerImage}
      />
      <View style={styles.lawyerInfo}>
        <Text style={styles.lawyerName}>
          {item.first_name + " " + item.last_name}
        </Text>
        <View style={{ flexDirection: "row" }}>
          {item.assessment &&
            Array.from({ length: item.assessment }, (_, i) => (
              <Text key={i}>⭐</Text>
            ))}
        </View>

        <Text style={styles.lawyerEmail}>{item.email}</Text>
        <Text style={styles.lawyerSpecialization}>{item.specialization}</Text>
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => {
            handleAddFeedBack();
            setLawyerFeedback(item);
          }}
        >
          <Text style={styles.buttonText}>Add Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderJudge = ({ item }) => {
    return (
      <View key={item._id} style={styles.judgeCard}>
        <View style={styles.judgeInfo}>
          <Text style={styles.judgeName}>
            {item.first_name +
              " " +
              item.second_name +
              " " +
              item.third_name +
              " " +
              item.last_name}
          </Text>
          <Text style={styles.judgeLocation}>
            {item.address.city + ", " + item.address.street}
          </Text>
          <Text style={styles.judgePhone}>{item.phone}</Text>
          <Text style={styles.judgeEmail}>{item.email}</Text>
          <Text style={styles.judgeExperience}>
            {item.experience} of experience
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.cheader}>
        <Button
          style={{
            position: "absolute",
            left: 16,
          }}
          onPress={() => navigation.goBack()}
        >
          Back
        </Button>
        <Text style={styles.title}>Case Detail</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text style={styles.caseType}>{caseData.Case.caseType.name}</Text>
              {caseData.Case.isActive && (
                <Chip icon="check" mode="outlined">
                  Active
                </Chip>
              )}
              {caseData.Case.isClosed && (
                <Chip icon="cancel" mode="outlined">
                  Closed
                </Chip>
              )}
            </View>
            <Text style={styles.caseDescription}>
              {caseData.Case.description}
            </Text>

            <Text style={styles.bodyText}>
              <Text style={styles.strong}>Court: </Text>
              {caseData.Case.court_branch.name} |{" "}
              {caseData.Case.court_branch.city}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.strong}>Court Admin: </Text>
              {caseData.Case.court_branch.admin.full_name}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.strong}>Court Date: </Text>
              {caseData.Case.init_date}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.strong}>More Details: </Text>
              {Object.entries(caseData.Case.data).map(([key, value]) => (
                <Text key={key}>
                  {"\n"}
                  <Text style={styles.strong}>{key}: </Text>
                  {value}
                </Text>
              ))}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.strong}>Defendant: </Text>
              {defendant.first_name
                ? `${defendant.first_name} ${defendant.last_name}`
                : "No defendant found"}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.strong}>Defendant Lawyers: </Text>
              {defendantLawyers.length > 0
                ? defendantLawyers
                    .map((lawyer) => `${lawyer.first_name} ${lawyer.last_name}`)
                    .join(", ")
                : "No defendant lawyers found"}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.strong}>Plaintiff: </Text>
              {plaintiff.first_name
                ? `${plaintiff.first_name} ${plaintiff.last_name}`
                : "No plaintiff found"}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.strong}>Plaintiff Lawyers: </Text>
              {plaintiffLawyers.length > 0
                ? plaintiffLawyers
                    .map((lawyer) => `${lawyer.first_name} ${lawyer.last_name}`)
                    .join(", ")
                : "No plaintiff lawyers found"}
            </Text>

            <Divider style={styles.divider} />

            {type === "User" && (
              <View>
                <Text style={styles.lawyerHeader}>Lawyers:</Text>
                {caseData.lawyer.map((lawyer) =>
                  renderLawyer({ item: lawyer })
                )}
              </View>
            )}

            <Divider style={styles.divider} />

            <Text style={styles.judgeHeader}>Judges:</Text>
            {caseData.Case.judges.map((judge) => renderJudge({ item: judge }))}

            <Divider style={styles.divider} />

            <List.Accordion
              title="Notes"
              expanded={expanded}
              onPress={handlePress}
              left={(props) => <List.Icon {...props} icon="note" />}
              right={(props) => (
                <IconButton
                  {...props}
                  icon={expanded ? "chevron-up" : "chevron-down"}
                />
              )}
            >
              {caseData.notes.length ? (
                <View>
                  {caseData.notes.map((note, index) => (
                    <View
                      key={index}
                      style={[
                        styles.noteContainer,
                        index !== caseData.notes.length - 1 && styles.divider,
                      ]}
                    >
                      <Text style={styles.primaryText}>{note.note}</Text>
                      <Text style={styles.secondaryText}>
                        Added by: {note.addedBy.first_name}{" "}
                        {note.addedBy.last_name} | Created:{" "}
                        {new Date(note.createdAt).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noNotesText}>No notes available.</Text>
              )}
            </List.Accordion>

            <List.Accordion
              title="Documents"
              expanded={documentExpanded}
              onPress={handleAccordionToggle}
              left={(props) => <List.Icon {...props} icon="note" />}
              right={(props) => (
                <IconButton
                  {...props}
                  icon={expanded ? "chevron-up" : "chevron-down"}
                />
              )}
            >
              {caseData.case_documents ? (
                <View>
                  {caseData.case_documents.map((document, index) => (
                    <View style={styles.documentItem} key={index}>
                      <Text>{`Document ${index + 1}`}</Text>
                      <Text>{getFriendlyName(document.path)}</Text>
                      <Button
                        style={{ alignSelf: "flex-start" }}
                        title="Download"
                        onPress={() => {
                          /* handle download */
                        }}
                      >
                        Download
                      </Button>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noNotesText}>No notes available.</Text>
              )}
            </List.Accordion>
          </Card.Content>

          <Card.Actions style={styles.cardActions}>
            <View style={styles.actionButtons}>
              <Button
                style={styles.btn}
                title="Add Note"
                mode="contained"
                onPress={() => setAddNoteModalOpen(true)}
              >
                Add Note
              </Button>
              <Button
                style={styles.btn}
                mode="contained"
                onPress={() => {
                  navigation.navigate("Scheduler", { id: caseData._id });
                }}
                title="View Scheduler"
              >
                View Scheduler
              </Button>
            </View>

            <View style={styles.uploadButtons}>
              <Button
                onPress={async () => {
                  const document = await DocumentPicker.getDocumentAsync();
                  setNewDocument(document);
                }}
                style={styles.btn}
                mode="contained"
                title="Add Document"
              >
                Add Document
              </Button>

              <Button
                style={styles.btn}
                mode="contained"
                onPress={handleDocumentUpload}
                disabled={!newDocument}
                title="Upload Document"
              >
                Upload Document
              </Button>
            </View>
          </Card.Actions>
        </Card>

        <Text style={styles.title}>Courts</Text>
        {courtData.map((court) => (
          <Card key={court._id} style={styles.card}>
            <Card.Content>
              <Text style={styles.caseId}>Case ID: {court.caseId}</Text>
              <Text style={styles.description}>{court.description}</Text>
              <Text style={styles.initiator}>
                <Text style={styles.bold}>Initiator:</Text>{" "}
                {`${court.initiator.first_name} ${court.initiator.second_name} ${court.initiator.third_name} ${court.initiator.last_name}`}
              </Text>
              <Text style={styles.time}>
                <Icon name="access-time" size={16} style={styles.icon} />
                {new Date(court.time).toLocaleString()}
              </Text>
              <View style={styles.status}>
                {!court.hasStarted && !court.hasFinished && (
                  <Chip mode="flat" style={styles.chipPrimary}>
                    Upcoming
                  </Chip>
                )}
                {court.hasStarted && !court.hasFinished && (
                  <Chip mode="flat" style={styles.chipSecondary}>
                    In Progress
                  </Chip>
                )}
                {court.hasFinished && (
                  <Chip mode="flat" style={styles.chipDefault}>
                    Finished
                  </Chip>
                )}
              </View>
              <View style={styles.judges}>
                <Text style={styles.judgesTitle}>Judges:</Text>
                <List.Section>
                  {court.admins.length === 0 ? (
                    <Text style={styles.noAdmins}>No admins assigned.</Text>
                  ) : (
                    court.admins.map((admin) => (
                      <View key={admin}>
                        <List.Item
                          title={
                            courtAdmins[admin]
                              ? `${courtAdmins[admin].first_name} ${courtAdmins[admin].last_name}`
                              : "Admin not found"
                          }
                        />
                        <Divider />
                      </View>
                    ))
                  )}
                </List.Section>
              </View>
              <Text style={styles.guests}>
                <Text style={styles.bold}>Guests:</Text> {court.guests.length}{" "}
                participants
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      <View style={{ flex: 1 }}>
        {/* Add Note Modal */}
        <Modal
          visible={addNoteModalOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setAddNoteModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Note</Text>
                <IconButton
                  icon="close"
                  onPress={() => setAddNoteModalOpen(false)}
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Note"
                value={newNote}
                onChangeText={setNewNote}
                multiline
                numberOfLines={4}
              />
              <Button
                style={{
                  backgroundColor: "#ffbf00",
                }}
                mode="contained"
                onPress={handleAddNote}
              >
                Add Note
              </Button>
            </View>
          </View>
        </Modal>

        {/* Feedback Modal */}
        <Modal
          visible={feedbackModalOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setFeedbackModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Feedback</Text>
                <IconButton
                  icon="close"
                  onPress={() => setFeedbackModalOpen(false)}
                />
              </View>
              <View style={styles.ratingContainer}>
                <Text style={styles.bodyText}>Rate your experience:</Text>
                <Rating
                  type="star"
                  ratingCount={5}
                  imageSize={30}
                  onFinishRating={setRating}
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Your Feedback"
                value={newFeedback}
                onChangeText={setNewFeedback}
                multiline
                numberOfLines={4}
              />
              <Button
                style={{
                  backgroundColor: "#ffbf00",
                }}
                mode="contained"
                onPress={submitFeedback}
              >
                Submit Feedback
              </Button>
            </View>
          </View>
        </Modal>
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { padding: 16 },
  cardActions: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 350,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  ratingContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 8,
  },
  container: { flex: 1, paddingTop: 32 },
  rating: { margin: 0, padding: 0 },
  card: {
    width: "100%",
    borderRadius: 8,
    marginVertical: 16,
    paddingTop: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  caseType: { fontSize: 18, fontWeight: "bold" },
  caseDescription: { fontSize: 14, color: "gray" },
  caseDetails: { fontSize: 14, color: "gray" },
  boldText: { fontWeight: "bold" },
  detailsText: { fontSize: 14, color: "gray" },
  divider: { marginVertical: 16 },
  lawyerCard: { flexDirection: "row", marginBottom: 16 },
  lawyerImage: { width: 80, height: 80, borderRadius: 40 },
  lawyerInfo: { marginLeft: 16, flex: 1 },
  lawyerName: { fontSize: 16, fontWeight: "bold" },
  lawyerEmail: { fontSize: 14, color: "gray" },
  lawyerSpecialization: { fontSize: 14, color: "gray" },
  feedbackButton: {
    backgroundColor: "transparent",
    color: "#ffbf00",
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffbf00",
    width: "50%",
  },
  cheader: {
    height: 80,
    width: "100%",
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    flexDirection: "row",
  },
  buttonText: { color: "#ffbf00" },
  judgeCard: { flexDirection: "row", marginBottom: 16 },
  judgeImage: { width: 100, height: 100, borderRadius: 50 },
  judgeInfo: { marginLeft: 16, flex: 1 },
  judgeName: { fontSize: 16, fontWeight: "bold" },
  judgeLocation: { fontSize: 14, color: "gray" },
  judgePhone: { fontSize: 14, color: "gray" },
  judgeEmail: { fontSize: 14, color: "gray" },
  judgeExperience: { fontSize: 14, color: "gray" },
  lawyerHeader: { fontSize: 18, fontWeight: "bold" },
  judgeHeader: { fontSize: 18, fontWeight: "bold" },
  accordion: { marginVertical: 16 },
  documentItem: { marginVertical: 8 },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  uploadButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    width: "50%",
    backgroundColor: "#ffbf00",
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginVertical: 8,
  },
  card: {
    marginVertical: 8,
    width: 400,
    alignSelf: "center",
  },
  caseId: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    color: "gray",
    marginVertical: 4,
  },
  initiator: {
    color: "gray",
    marginVertical: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  time: {
    color: "gray",
    marginVertical: 4,
  },
  icon: {
    marginRight: 4,
    verticalAlign: "middle",
  },
  status: {
    flexDirection: "row",
    marginVertical: 8,
  },
  chipPrimary: {
    backgroundColor: "#4CAF50",
    color: "white",
    marginRight: 4,
  },
  chipSecondary: {
    backgroundColor: "#FF5722",
    color: "white",
    marginRight: 4,
  },
  chipDefault: {
    backgroundColor: "#BDBDBD",
    color: "white",
    marginRight: 4,
  },
  judges: {
    marginTop: 16,
  },
  judgesTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  noAdmins: {
    color: "gray",
  },
  guests: {
    marginTop: 16,
    color: "gray",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#ffbf00",
  },
  noteContainer: {
    padding: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 14,
    color: "#555",
  },
  noNotesText: {
    padding: 16,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});

export default CaseCard;
