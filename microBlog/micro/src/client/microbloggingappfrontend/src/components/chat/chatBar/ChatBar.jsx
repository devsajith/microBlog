/* eslint-disable react/prop-types */
import classes from "./chatbar.module.css";
// import bg from "../../assets/image/noMessage.png";
import bg from "../../../assets/image/noMessage.png";
import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import { getUserDetails } from "../../../Service/userService";
import { useNavigate } from "react-router-dom";
// import profileIcon from "../../../assets/image/outlineavatar.png";
import CryptoJS from "crypto-js";

const ChatBar = ({ style }) => {
  const [recentchat, setRecentchat] = useState([]);
  const navigate = useNavigate();
  const currentUserUID = localStorage.getItem("uid");
  const secretKey = process.env.REACT_APP_CRYPTO;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const messagesQuery = query(
          collection(db, "messages"),
          orderBy("createdAt", "desc")
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesData = messagesSnapshot.docs.map((doc) => doc.data());
        const chatlistQuery = query(collection(db, "chatlist"));
        const chatlistSnapshot = await getDocs(chatlistQuery);
        const chatlistData = chatlistSnapshot.docs.map((doc) => doc.data());

        const filteredData = chatlistData.filter(
          (item) =>
            item.recipientId === currentUserUID || item.uid === currentUserUID
        );
        const uniqueUsers = new Map();

        filteredData.forEach((item) => {
          const existingItem = uniqueUsers.get(
            item.senderName || item.userName
          );
          if (!existingItem || item.createdAt > existingItem.createdAt) {
            if (item.recipientId === currentUserUID) {
              item.senderName = item.userName;
              item.recipientId = item.uid;
              item.email = item.currentUserEmail;
              uniqueUsers.set(item.userName, item);
            
            } else {
              uniqueUsers.set(item.senderName, item);
            }
          }
        });

        const updatedRecentChat = Array.from(uniqueUsers.values())
          .map((item) => {
            const recentMessages = messagesData.filter(
              (message) =>
                (message.uid === currentUserUID &&
                  message.recipientId === item.recipientId) ||
                (message.uid === item.recipientId &&
                  message.recipientId === currentUserUID)
            );

            const sortedMessages = recentMessages.sort(
              (a, b) => b.createdAt - a.createdAt
            );

            if (sortedMessages.length > 0) {
              const recentMessage = sortedMessages[0];
              return {
                ...item,
                recentMessage: recentMessage.text,
                recentMessageCreatedAt: recentMessage.createdAt,
              };
            } else {
              return {
                ...item,
                recentMessage: "",
                recentMessageCreatedAt: null,
              };
            }
          })
          .slice(0, 5); // Limit the array to the first 5 elements

        const sortedRecentChat = updatedRecentChat.sort((a, b) => {
          if (a.recentMessageCreatedAt && b.recentMessageCreatedAt) {
            return b.recentMessageCreatedAt - a.recentMessageCreatedAt;
          } else if (a.recentMessageCreatedAt) {
            return -1;
          } else if (b.recentMessageCreatedAt) {
            return 1;
          } else {
            return 0;
          }
        });
        setRecentchat(sortedRecentChat);
      } catch (error) {
        return error;
      }
    };

    const unsubscribeMessages = onSnapshot(collection(db, "messages"), () => {
      fetchData();
    });

    const unsubscribeChatlist = onSnapshot(collection(db, "chatlist"), () => {
      fetchData();
    });

    fetchData(); // Fetch data initially to populate the recent chat list

    return () => {
      unsubscribeMessages();
      unsubscribeChatlist();
    };
  }, [currentUserUID]);

  const sendMessage = (email) => {
    const accessToken = localStorage?.getItem("accessToken");
    const data = { email: email, accessToken: accessToken };
    localStorage.setItem("userEmail", data?.email);
    getUserDetails(data).then((response) => {
      const userName = response?.data?.userName;
      const uid = response?.data?.uid;
      const ciphertext = encodeURIComponent(
        CryptoJS.AES.encrypt(uid, secretKey).toString()
      );
      localStorage.setItem("userName", userName);
      navigate(`/messages/${ciphertext}`, {
        state: { uid: uid, userName: userName },
      });
    });
  };

  return (
    <div className={classes.chatBar} style={style}>
      <div className={classes.chatList}>
        <div className={classes.heading}>Messages</div>
        {recentchat.length > 0 ? (
          // Render this div if there are latest messages
          <div>
            {recentchat.map((data, index) => {
              const isLatestMessage =
                index === 0 && data.recentMessage !== null; // Check if it's the latest message and there is a recent message
              return (
                <div
                  key={data.name}
                  onClick={() => {
                    sendMessage(data?.email);
                  }}
                >
                  <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    <ListItem
                      alignItems="flex-start"
                      className={`${
                        isLatestMessage && data.isUnread
                          ? classes.latestMessage
                          : ""
                      } ${data.isUnread ? classes.unreadMessage : ""}`}
                    >
                      <ListItemAvatar>
                        <div className={classes["post-author"]}>
                          <img src={data?.photo || "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"} alt="" />
                        </div>
                      </ListItemAvatar>
                      <ListItemText
                        primary={data?.senderName}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              <p className={classes.paragraph}>
                                {data?.recentMessage}
                              </p>
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </List>
                </div>
              );
            })}
          </div>
        ) : (
          // Render this div if there are no latest messages
          <div>
            <div
              style={{
                height: "300px",
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></div>
            <h3
              style={{
                color: "grey",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 400,
              }}
            >
              Sorry no chats available!
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBar;
