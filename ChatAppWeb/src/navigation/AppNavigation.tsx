import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginScreen } from "../screens/login/LoginScreen";
import { ChatScreen } from "../screens/chat/ChatScreen";
import { RegisterScreen } from "../screens/register/RegisterScreen";
import { PrivateNavigation } from "./PrivateNavigation";
import { PublicNavigation } from "./PublicNavigation";

export const AppNavigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicNavigation>
              <LoginScreen />
            </PublicNavigation>
          }
        />

        <Route
          path="/register"
          element={
            <PublicNavigation>
              <RegisterScreen />
            </PublicNavigation>
          }
        />

        <Route
          path="/register"
          element={
            <PublicNavigation>
              <RegisterScreen />
            </PublicNavigation>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateNavigation>
              <ChatScreen />
            </PrivateNavigation>
          }
        />
        <Route
          path="/"
          element={
            <PublicNavigation>
              <LoginScreen />
            </PublicNavigation>
          }
        />
        <Route
          path="*"
          element={
            <PublicNavigation>
              <LoginScreen />
            </PublicNavigation>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
