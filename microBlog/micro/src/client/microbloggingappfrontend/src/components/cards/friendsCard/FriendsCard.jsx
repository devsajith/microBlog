/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import React, { useRef, useCallback, useEffect, useState } from "react";
import "./friendscard.css";
// import ProIcon from '../../../assets/image/outlineavatar.png'
import { friendlist } from "../../../Service/friendsService";
import jwt_decode from "jwt-decode";
import { getUserDetails } from "../../../Service/userService";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from "@mui/material";
import { block } from '../../../Service/friendsService';

let timer;

const FriendsCard = React.forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [friends, setfriends] = useState([]);
  const [pagenateLoading, setPaginateLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [skipId, setSkipId] = useState("");
  const [userId, setUserId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [friendIds, setFriendIds] = useState([]);
  const [count, setCount] = useState("");
  const secretKey = process.env.REACT_APP_CRYPTO;
  let nextPage = "0";

  const lessCount = count < 99;
  const graterCount = count > 99;
  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setFriendIds(id)
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleBlockClick = async (fid) => {
    try {
      await block(fid);
    } catch (error) {
      return (error)
    }
  }
  React.useImperativeHandle(ref, () => ({
    fetchFriends() {
      fetchFriendsList(searchText, "");
    },
  }));
  // const [userid, setUserrId] = useState()
  const fetchFriendsList = (searchTextValue, pageNumber) => {
    if (nextPage === 0) return;
    friendlist(searchTextValue, pageNumber)
      .then((data) => {

        localStorage.setItem("countFriends", JSON.parse(data.data.result.length))
        setPaginateLoading(false);
        setCount(data?.data?.count);

        if (data && data?.data && data?.data?.result && data?.data?.result?.length) {

          // let a = data.data.result
          // const b = a.map(data => data._id)
          // setUserrId(b)

          if (data?.data?.result?.length > 19) {
            setSkipId(data?.data?.skip);
          }

          nextPage = data?.data?.skip || 0;
          if (pageNumber) {
            setfriends([...friends, ...data.data.result]);

          } else {
            setfriends(data?.data?.result);
          }
        } else {
          setfriends([]);
        }
      })
      .catch((error) => {
        setPaginateLoading(false);
      });
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    let decodedToken = jwt_decode(accessToken);

    setUserId(decodedToken.id);
    fetchFriendsList("", "");
  }, []);

  const chat = (email, photo) => {
    const accessToken = localStorage?.getItem("accessToken");
    const data = { email: email, accessToken: accessToken };
    localStorage.setItem("userEmail", data?.email)
    getUserDetails(data).then((response) => {
      const userName = response?.data?.userName;
      const uid = response?.data?.uid;
      localStorage.setItem("userName", userName);
      const ciphertext = encodeURIComponent(CryptoJS.AES.encrypt(uid, secretKey).toString());
      navigate(`/messages/${ciphertext}`, {
        state: { uid: ciphertext, userName: userName, photo: photo, email: email },
      });
    });
  };

  const friendSearch = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    setSkipId("");
    clearTimeout(timer);
    timer = setTimeout(() => {
      fetchFriendsList(searchText, "");
    }, 300);
  };

  const listInnerRef = useRef();
  const lastFriendElementRef = useCallback(
    (node) => {
      if (listInnerRef.current) listInnerRef.current.disconnect();
      listInnerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!pagenateLoading && skipId) {
            setPaginateLoading(true);
            fetchFriendsList(searchText, skipId);
          }
        }
      });
      if (node) listInnerRef.current.observe(node);
    },
    [skipId, searchText]
  );
  const displayedFriends = friends;
  return (

    <Card
      style={{
        borderRadius: "10px",
        marginTop: "83px",
        height: "fit-content",
        marginLeft: "15px",
        marginRight: "15px",
        marginBottom: "15px",
        fontFamily: "sans-serif",
      }}
    >
      <CardContent style={{ paddingBottom: "7px", fontWeight: "bold" }}>
        <div style={{ display: "flex", paddingBottom: 16, paddingTop: 16 }}>
          <Typography sx={{ flex: 1 }} variant="h5" component="h2">
            <div className="Friends">
              Friends
              <sup>
                <div className="supDiv">
                  <div className="countDiv">
                    {!count && 0}
                    {lessCount && count}
                    {graterCount && "99+"}
                  </div>
                </div>
              </sup>
            </div>
          </Typography>
          <input
            type="text"
            className="search"
            placeholder="Search Friends"
            onChange={friendSearch}
            value={searchText}
          />
        </div>
        <div
          style={{ height: ".6px", backgroundColor: "#ebebeb", width: "100%" }}
        />
        {displayedFriends.length < 1 ? (
          <div className="noData">No Friends found</div>
        ) : (
          ""
        )}

        {displayedFriends.map((friend, index) => {
          const friendDetails = friend.requested_user
            ? friend.requested_user?._id === userId
              ? friend.reciever_user
              : friend.requested_user
            : friend.reciever_user;
          const FriendCard = (
            <>
              <Box
                sx={{
                  display: "flex",
                  padding: "5px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "50px",
                }}
                ref={index === displayedFriends.length - 1 ? lastFriendElementRef : null}
                key={friendDetails._id} 
              >

                <Box style={{ cursor: 'pointer' }} component={Link}
                  to={{
                    pathname: `/fprofile/${friendDetails._id}`,
                    state: { friendId: friendDetails.id }
                  }}
                  className="Name"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {friendDetails && friendDetails.photo ? (
                    <img className="profile"  key="profile-image" alt="" src={friendDetails.photo} />
                  ) : (
                    <img className="profile"  key="profile-image" alt="" src="https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360" />
                  )}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Link
                      to={{
                        pathname: `/fprofile/${friendDetails._id}`,
                        state: { friendId: friendDetails.id }
                      }} className="a"
                      style={{
                        float: "left",
                        paddingLeft: "5px",
                        textIndent: "3px",
                        color: 'black',
                        textDecoration: 'none'
                      }}
                    >
                      {friendDetails?.userName}
                    </Link>
                    <div
                      style={{
                        float: "left",
                        fontSize: "11px",
                        color: "#6b6b6b",
                        paddingLeft: "5px",
                        textIndent: "3px",
                      }}
                    >
                      {friendDetails?.country}
                    </div>
                  </div>
                </Box>

                <Box sx={{ float: "right" }} className="button">
                  <Button className="unfriendButton" variant="text">
                    Unfriend
                  </Button>
                  <Button style={{ marginRight: '10px', marginTop: '-3%' }}
                    className="textButton"
                    variant="outlined"
                    onClick={() => {
                      chat(friendDetails?.email, friendDetails.photo);
                    }}
                  >
                    Message{" "}
                  </Button>
                  <MoreVertIcon style={{ color: '#00bb7d', marginTop: '5px', float: 'right', cursor: 'pointer' }} onClick={(event) => handleMenuClick(event, friendDetails._id)}
                  />
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleBlockClick(friendIds)}>Block</MenuItem>

                    {/* {a === 1 ? (
                      <MenuItem onClick={() => handleBlockClick(friendIds)}>Block</MenuItem>
                    ) : (
                      <MenuItem onClick={() => handleUnblockClick(friendIds)}>Unblock</MenuItem>
                    )} */}
                    {/* Add more menu items as needed */}
                  </Menu>

                </Box>
              </Box>
              <div
                style={{
                  height: ".6px",
                  backgroundColor: "#ebebeb",
                  width: "100%",
                }}
              />
            </>
          );
          if (index + 1 === displayedFriends.length && friendDetails) {
            return (
              <Box ref={lastFriendElementRef} key={userId}>
                {FriendCard}
              </Box>
            );
          }
          if (friendDetails) {
            return FriendCard;
          }
          return null;
        })}
        <br />
      </CardContent>
    </Card>
  );
});
FriendsCard.displayName = "FriendsCard";
export default FriendsCard;
