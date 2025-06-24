import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Groups from "../pages/Groups";
import Features from "../pages/Features";
import Profile from "../pages/Profile";
import GroupDetails from "../pages/GroupDetails";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import Otp from "../pages/Otp";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/groups"
      element={
        <ProtectedRoute>
          <Groups />
        </ProtectedRoute>
      }
    />
    <Route path="/features" element={<Features />} />
    <Route path="/otp" element={<Otp />} />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />

    <Route
      path="/groups/:groupId"
      element={
        <ProtectedRoute>
          <GroupDetails />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
