import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./navigation/AuthStack";
import MainStack from "./navigation/MainStack";
import { BottomTabs } from "./navigation/MainStack";
import { AuthProvider, AuthContext } from "./src/shared/context/auth";
import { PaperProvider } from "react-native-paper";
const AppContent = () => {
  const { user, type } = React.useContext(AuthContext);
  console.log(process.env.API_URL);

  return (
    <NavigationContainer>
      {user ? <BottomTabs userType={type} /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <PaperProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
