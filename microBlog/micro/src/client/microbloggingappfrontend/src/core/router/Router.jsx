/* eslint-disable react/prop-types */
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../auth/loginpage/Login";
import Registration from "../auth/registration/Registration";
import Messages from "../../components/chat/chatModule/Messages";
import ErrorPage from "../../pages/404 Page/Errorpage";
import Changepassword from "../auth/changepassword/Changepassword";
import Forgotpassword from "../auth/forgotpassword/Forgotpassword";
import Resetpassword from "../auth/resetPassword/Resetpassword";
import Verifyotp from "../auth/verifyOTP/Verifyotp";
import UserLayout from "../../components/layouts/UserLayout";
import Feeds from "../../components/feeds/Feeds";
import Friends from "../../components/friends/Friends";
import UpdateProfile from "../../components/updateprofile/UpdateProfile";
import SearchResult from "../../components/seachResult/SearchResult";
import ChatComponent from "../../components/chat/chatBox/ChatBox";
import Profile from "../../components/profile/Profile";
import FriendsProfile from "../../components/profile/Freindsprofile/Fprofile";
import Pages from "../../components/Pages/pages/Pages";
import ProfilePage from "../../components/Pages/profilepage/ProfilePage";
import GroupChatBox from "../../components/chat/chatBox/groupChatBox";
import AdminLogin from "../auth/adminLogin/AdminLogin";
import AdminDashboard from "../../components/adminComponents/adminDashboard/AdminDashboard";
const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/Changepassword" element={<Changepassword />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/resetpassword" element={<Resetpassword />} />
        <Route path="/verifyotp" element={<Verifyotp />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/resetpassword" element={<Resetpassword />} />
        <Route path="/verifyotp" element={<Verifyotp />} />
        <Route path="/dashboard"  element={<AdminDashboard/>}/>

        <Route
          path="/register"
          element={
            <LoginGuard redirectTo="/login">
              <Registration />
            </LoginGuard>
          }
        />
        <Route
          path="/login"
          element={
            <LoginGuard redirectTo="/feeds">
              <Login />
            </LoginGuard>
          }
        />
         <Route
          path="/adminLogin"
          element={
            <LoginGuard redirectTo="/dashboard">
              <AdminLogin />
            </LoginGuard>
          }
        />

        <Route
          path="/updateprofile"
          element={
            <UpdateProfileGuard redirectTo="/feeds">
              <UpdateProfile />
            </UpdateProfileGuard>
          }
        />
        <Route
          path="/"
          element={
            <AuthGuard redirectTo="/login">
              <UserLayout />
            </AuthGuard>
          }
        >
          <Route path="/pages" element={<Pages />} />

          <Route path="/pages/:id" element={<ProfilePage />} />
          <Route path="/feeds" element={<Feeds />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/fprofile/:id" element={<FriendsProfile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/searchResult" element={<SearchResult />} />
          <Route path="/chat/:id" element={<ChatComponent />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<Messages />} />
          <Route path="/groups/:id"  element={<GroupChatBox/>}/>
        </Route>
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default Router;

function LoginGuard({ children, redirectTo }) {
  let isAuthenticated = localStorage.getItem("accessToken");
  return isAuthenticated ? <Navigate to={redirectTo} /> : children;
}
function UpdateProfileGuard({ children, redirectTo }) {
  let status = localStorage.getItem("status");
  return status === "2" ? children : <Navigate to={redirectTo} />;
}
function AuthGuard({ children, redirectTo }) {
  let isAuthenticated = localStorage.getItem("accessToken");
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}
