import React, { useState } from "react";
import Chat from "devextreme-react/chat";
import { AzureOpenAI } from "openai";
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import { loadMessages } from "devextreme/localization";
import {
  user,
  assistant,
  AzureOpenAIConfig,
  REGENERATION_TEXT,
  CHAT_DISABLED_CLASS,
  ALERT_TIMEOUT,
} from "./data.js";
import Message from "./Message.js";
import {
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const store = [];
const messages = [];

loadMessages({
  en: {
    "dxChat-emptyListMessage": "Chat is Empty",
    "dxChat-emptyListPrompt": "AI Assistant is ready to answer your questions.",
    "dxChat-textareaPlaceholder": "Enter your message...",
  },
});

const chatService = new AzureOpenAI(AzureOpenAIConfig);

async function getAIResponse(messages) {
  const params = {
    messages,
    model: AzureOpenAIConfig.deployment,
    max_tokens: 1000,
    temperature: 0.7,
  };
  const response = await chatService.chat.completions.create(params);
  console.log(response);
  const data = { choices: response.choices };
  return data.choices[0].message?.content;
}

function updateLastMessage(text = REGENERATION_TEXT) {
  const items = dataSource.items();
  const lastMessage = items.at(-1);
  dataSource.store().push([
    {
      type: "update",
      key: lastMessage.id,
      data: { text },
    },
  ]);
}

function renderAssistantMessage(text) {
  const message = {
    id: Date.now(),
    timestamp: new Date(),
    author: assistant,
    text,
  };
  dataSource.store().push([{ type: "insert", data: message }]);
}

const customStore = new CustomStore({
  key: "id",
  load: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([...store]);
      }, 0);
    }),
  insert: (message) =>
    new Promise((resolve) => {
      setTimeout(() => {
        store.push(message);
        resolve(message);
      });
    }),
});

const dataSource = new DataSource({
  store: customStore,
  paginate: false,
});

export default function ChatBot() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [classList, setClassList] = useState("");

  function alertLimitReached() {
    setAlerts([
      {
        message: "Request limit reached, try again in a minute.",
      },
    ]);
    setTimeout(() => {
      setAlerts([]);
    }, ALERT_TIMEOUT);
  }

  function toggleDisabledState(disabled, event = undefined) {
    setClassList(disabled ? CHAT_DISABLED_CLASS : "");
    if (disabled) {
      event?.target.blur();
    } else {
      event?.target.focus();
    }
  }

  async function processMessageSending(message, event) {
    toggleDisabledState(true, event);
    messages.push({ role: "user", content: message.text });
    setTypingUsers([assistant]);
    try {
      const aiResponse = await getAIResponse(messages);
      setTimeout(() => {
        setTypingUsers([]);
        messages.push({ role: "assistant", content: aiResponse });
        renderAssistantMessage(aiResponse);
      }, 200);
    } catch {
      setTypingUsers([]);
      messages.pop();
      alertLimitReached();
    } finally {
      toggleDisabledState(false, event);
    }
  }

  async function regenerate() {
    toggleDisabledState(true);
    try {
      const aiResponse = await getAIResponse(messages.slice(0, -1));
      updateLastMessage(aiResponse);
      messages.at(-1).content = aiResponse;
    } catch {
      updateLastMessage(messages.at(-1).content);
      alertLimitReached();
    } finally {
      toggleDisabledState(false);
    }
  }

  function onMessageEntered({ message, event }) {
    dataSource
      .store()
      .push([{ type: "insert", data: { id: Date.now(), ...message } }]);
    if (!alerts.length) {
      processMessageSending(message, event);
    }
  }

  function onRegenerateButtonClick() {
    updateLastMessage();
    regenerate();
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* AppBar with Back Button */}
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
          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
            Back
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Chat Section */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          margin: "16px",
          padding: "16px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <Chat
          className={classList}
          dataSource={dataSource}
          reloadOnChange={false}
          showAvatar={false}
          showDayHeaders={false}
          user={user}
          height="100%"
          onMessageEntered={onMessageEntered}
          alerts={alerts}
          typingUsers={typingUsers}
          messageRender={(data) => Message(data, onRegenerateButtonClick)}
        />
      </Paper>
    </Box>
  );
}
