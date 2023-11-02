/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { friendRequest, globalSearch } from "../../../Service/friendsService";
import "../friendsCard/friendscard.css";
import { getUserDetails } from "../../../Service/userService";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from "@mui/material";
import CryptoJS from "crypto-js"
import { block, unblock } from '../../../Service/friendsService';

function PeoplesCard(props) {
  const navigate = useNavigate();
  const [pagenateLoading, setPaginateLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [skip, setSkip] = useState('');
  const [count, setCount] = useState("");
  const searchText = props?.searchText;
  const lessCount = count < 99;
  const graterCount = count > 99;
  const recent = [searchText];
  const [anchorEl, setAnchorEl] = useState(null);
  const [a, setA] = useState('')
  const secretKey = process.env.REACT_APP_CRYPTO;


  useEffect(() => {
    let history = [];
    history = JSON.parse(localStorage.getItem("recent"));
    if (history?.length) {
      if (searchText) {
        if (!history.includes(searchText)) history.push(searchText);
        localStorage.setItem("recent", JSON.stringify(history));
      }
    } else {
      localStorage.setItem("recent", JSON.stringify(recent));
    }
  }, []);

  useEffect(() => {
    setSkip(props?.skipId);
    searchUser(searchText);
    reSearch(searchText);
  }, [props, searchText]); 
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setA('2')
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleBlockClick = async (fid) => {
    try {
      await block(fid);
    } catch (error) {return(error)
    }
  }
  const handleUnblockClick = async (fid) => {
    try {
      await unblock(fid);
    } catch (error) {return(error)
    }
  };
  const about = (data) => {
    const about = data?.about;
    if (about) {
      return about?.length > 20 ? about?.slice(0, 190) : about;
    }
  };
  const searchUser = (searchText, skip) => {
    const filter = "user";
    const limit = 10;
    globalSearch(searchText, skip, filter, limit).then((response) => {
      setPaginateLoading(false);
      if (response && response.data && response.data.users) {
        setSearchResult([...searchResult, ...response.data.users]);
        setSkip(response?.data?.skip);
        setCount(response?.data?.count);
      }
    });
  };
  
  const reSearch = (searchText, skip) => {
    globalSearch(searchText, skip).then((response) => {
      setPaginateLoading(false);
      if (response && response.data && response.data.result) {
        setSearchResult(response.data.users);

        setCount(response?.data?.count);
      }
    });
  };
  const listInnerRef = useRef();
  const lastFriendElementRef = useCallback(
    (node) => {
      if (listInnerRef.current) listInnerRef.current.disconnect();
      listInnerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!pagenateLoading && skip) {
            setPaginateLoading(true);
            searchUser(searchText, skip);
          }
        }
      });
      if (node) listInnerRef.current.observe(node);
    },
    [skip, searchText]
  );

  const addFriend = (reciverId) => {
    friendRequest(reciverId).then((response) => {
      // reSearch(searchText, skip)
      let peoples = [];

      searchResult?.map((item) => {
        if (item._id === reciverId) {
          peoples.push({ ...item, friend: 0 });
        } else {
          peoples.push(item);
        }
        return item;
      });
      setSearchResult(peoples);
    });
  };

  const chat = (email, photo) => {
    const accessToken = localStorage?.getItem("accessToken");
    const data = { email: email, accessToken: accessToken };
    getUserDetails(data).then((response) => {
      const userName = response?.data?.userName;
      const uid = response?.data?.uid;
      const ciphertext = encodeURIComponent(CryptoJS.AES.encrypt(uid, secretKey).toString());

      navigate(`/messages/${ciphertext}`, {
        state: { uid: ciphertext, userName: userName, photo: photo, email: email },
      });
    });
  };
  const friendsprofile = (id) => {
    navigate(`/fprofile/${id}`)
  }
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
              Peoples
              <sup>
                <div className="supDiv">
                  <div className="countDiv">
                    {lessCount && count}
                    {graterCount && "99+"}
                  </div>
                </div>
              </sup>
            </div>
          </Typography>
        </div>
        <div
          style={{ height: ".6px", backgroundColor: "#ebebeb", width: "100%" }}
        />

        {searchResult?.map((data, index) => {
          const PeopleCard = (
            <>

              <Box
                key={data._id}
                sx={{
                  display: "flex",
                  padding: "5px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "50px",
                }}
              >
                <Box onClick={() => friendsprofile(data._id)} style={{ cursor: 'pointer' }}
                  className="Name"
                  sx={{ display: "flex", alignItems: "center", width: "70%" }}
                >
                  {data && data?.photo ? (
                    <img className="profile" alt="" src={data?.photo} />
                  ) : (
                    <Avatar alt="Remy Sharp" />
                  )}


                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        float: "left",
                        paddingLeft: "5px",
                        textIndent: "3px",
                      }}
                    >
                      {data?.userName}
                    </div>
                    <div className="about"> {about(data)}</div>
                  </div>
                </Box>

                <Box sx={{ float: "right" }} className="button">
                  {data.friend === 0 && (
                    <Button
                      disabled
                      className="pendingButton"
                      variant="outlined"
                    >
                      Pending{" "}
                    </Button>
                  )}
                  {data?.friend === 2 && (
                    <Button
                      className="addButton"
                      variant="outlined"
                      onClick={() => addFriend(data._id)}
                    >
                      Add Friend{" "}
                    </Button>
                  )}

                  {data?.friend === 1 && (
                    <div>
                      <Button className="unfriendButton" variant="text">
                        Unfriend
                      </Button>
                      <Button
                        className="messageButton"
                        variant="outlined"
                        onClick={() => {
                          chat(data?.email);
                        }}
                      >
                        Message
                      </Button>
                      <MoreVertIcon style={{ color: '#00bb7d', marginTop: '5px', float: 'right', cursor: 'pointer' }} onClick={handleMenuClick}
                      />
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        {a === 1 ? (
                          <MenuItem onClick={() => handleBlockClick(data._id)}>Block</MenuItem>
                        ) : (
                          <MenuItem onClick={() => handleUnblockClick(data._id)}>Unblock</MenuItem>
                        )}
                        {/* Add more menu items as needed */}
                      </Menu>
                    </div>
                  )}

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
          if (index + 1 === searchResult.length) {
            return (
              <Box key={data._id} ref={lastFriendElementRef}>
                {PeopleCard}
              </Box>
            );
          }
          return PeopleCard;
        })}
      </CardContent>
    </Card>
  );
}
export default PeoplesCard;
