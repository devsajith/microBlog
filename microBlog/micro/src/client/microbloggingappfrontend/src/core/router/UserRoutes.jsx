import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatBox from "../../components/chat/chatBox/ChatBox";
import Feeds from "../../components/feeds/Feeds";
import Friends from "../../components/friends/Friends";
import SearchResult from "../../components/seachResult/SearchResult";
import Messages from "../../components/chat/chatModule/Messages";
import Profile from "../../components/profile/Profile";
import FProfile from "../../components/profile/Freindsprofile/Fprofile";
import Pages from "../../components/Pages/pages/Pages";
import ProfilePage from "../../components/Pages/profilepage/ProfilePage";
import GroupChatBox from "../../components/chat/chatBox/groupChatBox";

const UserRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/pages" element={<Pages />} />
        <Route path="/pages/:id" element={<ProfilePage />} />
        <Route path="/pages" element={<Pages />} />
        <Route path="/feeds" element={<Feeds />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/searchResult" element={<SearchResult />} />
        <Route path="/chat/:id" element={<ChatBox />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:id" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/fprofile/:id" element={<FProfile />} />
        <Route path="/groups/:id"  element={<GroupChatBox/>}/>
        {/* <Route path="/Dashboard"  element={<AdminDashboard/>}/> */}

      </Routes>
    </>
  );
};

export default UserRouter;
