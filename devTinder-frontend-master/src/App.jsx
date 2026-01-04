import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Body from "./Components/Body";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import EditProfile from "./Components/EditProfile";
import { Provider, useSelector } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./Components/Feed";
import Connections from "./Components/Connections";
import Requests from "./Components/Requests";
import Navbar from "./Components/Navbar";
import ProfileSetup from "./Components/ProfileSetup"; // ✅ ADD THIS LINE

// ✅ Private Route wrapper
const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* ========= AUTH-PROTECTED ROUTES ========= */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Body />
            </PrivateRoute>
          }
        >
          <Route index element={<Feed />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile-setup" element={<ProfileSetup />} />
          {/* ✅ NEW ROUTE */}
          <Route path="connections" element={<Connections />} />
          <Route path="requests" element={<Requests />} />
        </Route>

        <Route path="/edit-profile" element={<EditProfile />} />

        {/* ========= PUBLIC ROUTE ========= */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
