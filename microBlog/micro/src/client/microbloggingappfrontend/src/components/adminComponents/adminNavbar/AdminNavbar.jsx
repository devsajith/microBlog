import React, { useCallback } from "react";
import style from "./adminNavbar.module.scss";
import LogoutIcon from "@mui/icons-material/Logout";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const openNav = useCallback(() => {
    document.getElementById("mySidebarMobile").style.width = "250px";
  }, []);

  const closeNav = useCallback(() => {
    document.getElementById("mySidebarMobile").style.width = "0";
    document.getElementById("MainMobile").style.marginLeft = "0";
  }, []);
  const handleLogout = useCallback(() => {
    Swal.fire({
      title: "Logout",
      text: "Are sure want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location = "/adminLogin";
      }
    });
  }, []);

  return (
    <div className={style["topbar"]} >
      <div id={style["mySidebarMobile"]} className={style["sidebarMobile"]}>
        <a
          href="javascript:void(0)"
          className={style["closebtnMobile"]}
          onClick={closeNav}
        >
          ×
        </a>
        <Link to="/reportlist" onClick={closeNav}>
          Report List
        </Link>
      </div>
      <div className={style["topbarWrapper"]}>
        <div className={style["topLeft"]}>
          <Link to="/admin" className={style["href"]}>
            <span className={style["logo"]}>MicroBlog</span>
          </Link>
        </div>
        <div className={style["mobileSidebar"]} id={style["MainMobile"]}>
          <button className={style["openbtnMobile"]} onClick={openNav}>
            ☰
          </button>{" "}
        </div>
        <div className={style["topRight"]}>
          <div className={style["topbarIconContainer"]}>
            <LogoutIcon onClick={handleLogout} id={style["logout"]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
