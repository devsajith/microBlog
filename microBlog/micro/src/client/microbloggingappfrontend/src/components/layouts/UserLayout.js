/* eslint-disable react/prop-types */
import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";
import UserRouter from "../../core/router/UserRoutes";
const UserLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div id="userdashboard">
        <Sidebar />
        <div style={{ marginLeft: 250, marginTop: 50, width: "100%" }}>
          <UserRouter />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
