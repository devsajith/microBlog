import React from "react";
import AdminNavbar from "../adminNavbar/AdminNavbar";
import AdminSidebar from "../adminSidebar/AdminSidebar";
import ReportPostList from "../reportPostList/ReportPostList";
import style from "./adminDashboard.module.scss";
const AdminDashboard = () => {
  return (
    <div>
      <AdminNavbar />
      <div className={style["adminHome"]}>
        <div className={style["adminSidebar"]}>
          <AdminSidebar />
        </div>
        <div className={style["adminContent"]}>
            <ReportPostList/>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
