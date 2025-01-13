import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./navigation/AuthStack";
import MainStack from "./navigation/MainStack";
import { AuthProvider, AuthContext } from "./src/shared/context/auth";

const AppContent = () => {
  const { user, type } = React.useContext(AuthContext);

  return (
    <NavigationContainer>
      {user ? <MainStack userType={type} /> : <AuthStack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
