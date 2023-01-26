import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, Container, ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import SidebarNavigation from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import RecordCreateForm from "./scenes/record-create-form";
import RecordsList from "./scenes/records-list";
import Record from "./scenes/record";

import Login from "./scenes/login/Login";
import { ProtectedRoute } from "./utils/routeGuard";

import firebase from "./services/firebase";

import {
  setSignedIn,
  setUserProfile,
  setUserCondition,
  selectUser,
  selectSignedIn,
} from "./store/slices/users.slice";

import { logIn } from "./store/actions/users.actions";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, colorMode] = useMode();
  const [sidebarOpen, setSidebarOpen] = useState(
    JSON.parse(localStorage.getItem("sidebar")) || false
  );

  const user = useSelector(selectUser);
  const customSidebarOption = JSON.parse(localStorage.getItem("sidebar"));

  console.log(sidebarOpen);

  const validatedRedirect = () => {
    console.log("SIPE");
    dispatch(setUserCondition(""));
    navigate("/");
  };

  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // useEffect(() => {
  //   if (user.condition !== "verified" && user.isSignedIn) {
  //     firebase.auth().onAuthStateChanged((firebaseUser) => {
  //       if (firebaseUser) {
  //         const { accessToken, email } = firebaseUser.multiFactor.user;
  //         dispatch(logIn(email));
  //         localStorage.setItem("token", accessToken);
  //         localStorage.setItem("signedIn", true);
  //       }
  //     });
  //   }
  // }, [user["condition"]]);

  useEffect(() => {
    localStorage.setItem("sidebar", sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    if (location.pathname !== "/login" && user.condition === "validated") {
      dispatch(setUserCondition(""));
      navigate("/", { replace: true });
      setSidebarOpen(true);
    }
    if (
      location.pathname === "/login" &&
      user.condition !== "verified" &&
      user.signedIn
    ) {
      navigate("/", { replace: true });
    }
    if (location.pathname === "/login") {
      setSidebarOpen(false);
    }
  }, [user.signedIn, user.condition, location.pathname]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="grid"
          gridTemplateColumns={`${sidebarOpen ? "30%" : ""} ${
            sidebarOpen ? "70%" : "1fr"
          }`}
          className="app"
        >
          <Box display={sidebarOpen ? "initial" : "none"}>
            <SidebarNavigation />
          </Box>

          <Box width="100%">
            <main className="content">
              <Topbar
                user={user}
                sidebarOpen={sidebarOpen}
                handleSidebar={handleSidebar}
              />
              <Container>
                <Routes>
                  <Route path="*" element={<Navigate to="/" replace />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute isSignedIn={user.signedIn}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/crear-expediente"
                    element={
                      <ProtectedRoute isSignedIn={user.signedIn}>
                        <RecordCreateForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/listado-expedientes"
                    element={
                      <ProtectedRoute isSignedIn={user.signedIn}>
                        <RecordsList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/expedientes/:id"
                    element={
                      <ProtectedRoute isSignedIn={user.signedIn}>
                        <Record />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={<Login validatedRedirect={validatedRedirect} />}
                  />
                </Routes>
              </Container>
            </main>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
