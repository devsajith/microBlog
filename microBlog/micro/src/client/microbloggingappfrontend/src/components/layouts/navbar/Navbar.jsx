/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./navbar.css";
import {
  Settings,
  ManageAccounts,
  Logout,
  Notifications,
} from "@mui/icons-material";
import { logoutFromADevice } from "../../../Service/userService";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { globalSearch } from "../../../Service/friendsService";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getSearchValue, searchInput } from "../../../actions/searchSlice";
import { userView } from "../../../actions/userSlice";
import {
  listPost,
  updateStatus,
  deleteNotification,
  updateDelivery,
} from "../../../Service/webSocketService";
import socketIOClient from "socket.io-client";
import jwt_decode from "jwt-decode";

const Navbar = () => {
  const socketport = process.env.REACT_APP_WEBSOCKET_PORT;
  let socket = socketIOClient(socketport, { path: "/socket.io" });
  const searchData = useSelector(getSearchValue);
  const navigate = useNavigate();
  const [provider, setProvider] = useState("");
  const [searchValue, setSearchValue] = useState([]);
  const [skipId, setSkipId] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [keyWord, setKeyWord] = useState("");
  const [recent, setRecent] = useState([]);
  const [isRecent, setIsRecent] = useState(false);
  const [requests, setRequests] = useState([]);
  const [count, setCount] = useState();
  const userDetails = useSelector((state) => state.user.userDetails);
  let history = new Set();
  const avatarRef = useRef(null);
  const dropdwnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  let decodedToken = jwt_decode(accessToken);
  const userId = decodedToken.id;
  const [openNotification, setOpenNotification] = useState(false);
  // SOCKET
  useEffect(() => {
    if (userId) { socket.on("connect", () => { socket.emit("userConnected", userId); });
      socket.on("notificationCount", () => { fetchData(); });
      return () => {
        socket.off("connect");
        socket.off("notificationCount");
      };
    }
  }, [userId]);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpenNotification(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  // request list
  const lessCount = count < 99;
  const graterCount = count > 99;
  async function fetchData() {
    try {
      const limit = 100;
      const response = await listPost(limit);
      setRequests(response?.data?.result);
      setCount(response?.data?.count);
    } catch (error) {
      return error;
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const MAX_FRIENDS_TO_DISPLAY = 10; // Number of friends to display initially
  const displayResult = searchValue?.slice(0, MAX_FRIENDS_TO_DISPLAY);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchUserDetails();
    recentSearch();
  }, []);
  const new1 = (id) => {
    navigate(`/fprofile/${id}`);
  };
  const fetchUserDetails = async () => {
    dispatch(userView());
  };

  useEffect(() => {
    setProvider(localStorage.getItem("provider"));
    const handleClickOutside = (event) => {
      if (
        dropdwnRef.current &&
        !dropdwnRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) { setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {}, [searchResult]);

  const searchFunction = (e) => {
    const searchText = e.target.value;
    dispatch(searchInput(searchText));

    if (searchText) {
      setIsRecent(true);
    } else {
      recentSearch();
      setIsRecent(false);
    }
    searchGlobal(searchText);
    setKeyWord(searchText);
    setshowModal(true);
  };
  const recentSearch = () => {
    history = JSON.parse(localStorage.getItem("recent"));
    setRecent(history?.reverse());
  };
  const searchGlobal = (searchText) => {
    if (searchText.trim().length > 0) {
      setSkipId("");
      globalSearch(searchText, "", "", "").then((resp) => {
        setSearchResult(resp?.data?.users);
        const searchData = resp;
        setSearchValue(searchData?.data);
        setSkipId(searchData?.data?.skip);
      });
    } else {
      setSkipId("");
      setSearchResult([]);
      setSearchValue(null);
    }
  };
  const logout = () => {
    const token = localStorage.getItem("accessToken");
    logoutFromADevice(token)
      .then((response) => {
        localStorage.clear();
        navigate("/login");})
      .catch((err) => {});
  };
  let myFunction = () => {
    setOpen(!open);
  };
  const notificationUpdate = () => {
    setOpenNotification(!openNotification);
    const updata = {};
    updateStatus(updata);
    fetchData();
  };
  const deleteHere = () => {
    const deletehere = {};
    deleteNotification(deletehere);
    setOpenNotification(false);
    fetchData();
  };
  const routeHere = (friend) => {
    if (friend?.type === 2) {
      navigate(`/friends`);
    } else if (friend?.type === 1) {
      navigate(`/messages`);
    }
    const routehere = {};
    updateDelivery(routehere);
    setOpenNotification(false);
    fetchData();
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbarWrapper">
          <div className="topLeft">
            <NavLink className="logo" to="/feeds">
              <span>Microblog</span>
            </NavLink>
          </div>
          <div className="firstDiv">
            <input type="search" value={searchData}
              className="searchBar" placeholder="Search"
              onChange={searchFunction}/>
          </div>
          {showModal && (
            <div
              className="searchDiv"
              onClick={() => {setshowModal(false); }} >
              {keyWord?.length > 0 && isRecent && (
                <div className="searchModal">
                  {displayResult?.map((data, index) => {
                    return (
                      <div key={data?._id} className="resultdata">
                        <div className="profImage">
                          {data && data?.photo ? (
                            <Link to={`/fprofile/${data?._id}`}
                              className="profile-link" >
                              <img className="profile"
                                alt="" src={data.photo}/>
                            </Link>
                          ) : (
                            <Avatar alt="Remy Sharp" />
                          )}
                          </div>
                        <div className="profName"
                          style={{ color: "black", textDecoration: "none" }}
                          onClick={() => new1(data?._id)}>
                          {data?.userName || data?.page_name}
                        </div></div>
                    );
                  })}
                  <div className="seeAll">
                    <NavLink
                      to="/searchResult"
                      state={{searchValue: searchValue,
                        skipId: skipId,searchText: keyWord,
                      }} >
                      See all results </NavLink></div></div>
              )}
              {recent?.length > 0 && !isRecent && (
                <div className="searchModal">
                  <div className="recent"> <b>Recent</b> </div>
                  {recent?.reverse().map((data, index) => {
                    return (
                      <div key={data._id} className="resultdata">
                        <div className="profName"> {data}</div>
                      </div> ); })}</div>
              )}{" "} </div>
          )}
          <div className="topRight">
            <div className="notifications">
              <div className="menu-container" ref={menuRef}>
                <div className="menu-trigger" onClick={notificationUpdate}>
                  <Notifications />
                  {count > 0 && (
                    <span className="notification-count">
                      {" "}
                      {lessCount && count}
                      {graterCount && "99+"}
                    </span>)}</div>
                <div className={`dropdown-menu ${
                    openNotification ? "active" : "inactive"}`}>
                  <div className="notification-heads">
                    <span className="new-notification">New notifications</span>
                    <span className="clearall" onClick={deleteHere}>
                      Clear all
                    </span>
                  </div>
                  {requests?.length ? (
                    requests.map((friend) => (
                      <div className="notification-requests" key={friend?._id}>
                        <div onClick={() => routeHere(friend)}>
                          <span
                            style={{
                              fontWeight:
                                friend?.delivery === 0 ? "bold" : "normal",
                            }}
                          >
                            {friend?.type === 2
                              ? `${friend?.getuser_name} sent you a friend request`
                              : `${friend?.getuser_name} sent you a message`}
                          </span></div></div>
                    ))
                  ) : (
                    <p className="no-notifications">No notifications</p>
                  )} </div></div></div>
            <div className="dropdown">
              <div style={{ display: "flex", alignItems: "center" }}
                ref={avatarRef}><p style={{ marginRight: 8, fontWeight: "500" }}>{userDetails?.user?.userName}</p>
                <img
                  src={userDetails?.user?.photo ||"https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"}
                  alt="" className="topAvatar"onClick={myFunction}/>
              </div>
              {open === true ? (
                <div id="myDropdown"
                  className="dropdown-content shows"
                  ref={dropdwnRef} >
                  <div className={"profContainer"}>
                    <div className={"iconDiv"}>
                      <img alt="" src={userDetails?.user?.photo ||"https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360" }
                        className={"profileIcon"}
                        style={{
                          width: "70px",margin: "auto",
                          borderRadius: "38px",
                        }} />
                      <p title={userDetails?.user?.userName}
                        style={{fontSize: "14px",
                          fontWeight: "600",margin: "2px",}} >
                        {userDetails?.user?.userName}{" "}</p>
                      <p title={userDetails?.user?.email}
                        style={{fontSize: "14px",fontWeight: "400",
                          marginTop: "3px", marginBottom: 0, }}>
                        {userDetails?.user?.email}
                      </p>{" "}
                    </div>
                  </div>
                  <a href="/profile"><ManageAccounts />{" "}<span id="drop-cont">Manage Profile</span></a>
                  {!provider && (
                    <a href="/changepassword"><Settings /> <span id="drop-cont">Change Password</span>{" "}</a>
                  )}
                  <a href onClick={logout}>
                    <Logout />
                    <span id="drop-cont">Logout</span>
                  </a>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
