/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./messages.css";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import {
  getUserDetails,
  groupDetails,
  listGroup,
} from "../../../Service/userService";
import ChatBox from "../chatBox/ChatBox";
// import profileIcon from "../../../assets/image/outlineavatar.png";
import chatIcon from "../../../assets/image/zero_state_chats_1x.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import CreateGroupModal from "../../modal/createGroup/createGroupModal";
import { Button } from "@mui/material";

const Messages = () => {
  const [recentchat, setRecentchat] = useState([]);
  const [chatBoxDisplay, setChatBoxDisplay] = useState(false);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [userNameObj, setUserNameObj] = useState({ uid: 0, userName: "" });
  const currentUserUID = localStorage.getItem("uid");
  const [groups, setsGroups] = useState([]);
  const { id } = useParams();
  const secretKey = process.env.REACT_APP_CRYPTO;
  const name = localStorage.getItem("userName");

  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getUserDetails().then((res) => {});
  };

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

        const updatedRecentChat = Array.from(uniqueUsers.values()).map(
          (item) => {
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
              // If there are no recent messages, set an empty string for the recentMessage field
              return {
                ...item,
                recentMessage: "",
                recentMessageCreatedAt: null,
              };
            }
          }
        );

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

  useEffect(() => {
    if (id && name) {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(id), secretKey);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      setUserNameObj({ uid: originalText, userName: name });
      setChatBoxDisplay(true);
    } else {
      setChatBoxDisplay(false);
    }
  }, []);

  useEffect(() => {
    listAllGroups();
  }, []);

  const sendMessage = async (email) => {
    const accessToken = localStorage?.getItem("accessToken");
    const data = { email: email, accessToken: accessToken };
    localStorage.setItem("userEmail", data?.email);
    try {
      const response = await getUserDetails(data);
      const userName = response?.data?.userName;
      const uid = response?.data?.uid;
      const ciphertext = encodeURIComponent(
        CryptoJS.AES.encrypt(uid, secretKey).toString()
      );
      navigate(`/messages/${ciphertext}`, {
        state: { uid: uid, userName: userName },
      });

      setUserNameObj({ uid: uid, userName: userName });
      setChatBoxDisplay(true);
    } catch (error) {
      return error;
    }
  };

  const listAllGroups = async () => {
    listGroup().then((response) => {
      setsGroups(response?.data);
    });
  };

  const handleCreateGroup = () => {
    setCreateGroupModal(true);
  };

  function handleCloseModals() {
    setCreateGroupModal(false);
  }

  const intoGroup = async (id) => {
    groupDetails(id).then((response) => {
      navigate(`/groups/${id}`, { state: { id: id, groupName: response?.data?.group_name } });
    });
  };

  return (
    <>
      <div className="wrapper">
        <div className="chat">
          <div className="left">
            <div className="createGroup">
              <Button onClick={handleCreateGroup}>New Group</Button>
            </div>

            {recentchat?.length === 0 ? (
              <div className="persona-container-1">
                <span>
                  <SpeakerNotesOffIcon />
                  You have no chat list
                </span>
              </div>
            ) : (
              recentchat.map((data, index) => {
                const isLatestMessage =
                  index === 0 && data.recentMessage !== null;
                return (
                  <div className="persona-container" key={data.name}>
                    <div
                      className="persona box"
                      onClick={() => {
                        sendMessage(data?.email);
                      }}
                    >
                      <img
                        src="https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"
                        alt=""
                      />
                      <div className="info-section">
                        <span className="info-name">{data?.senderName}</span>
                        <span
                          className={`${
                            isLatestMessage && data.isUnread
                              ? "info-message"
                              : ""
                          } ${data.isUnread ? "info-message-bold" : ""}`}
                        >
                          <span>{data?.recentMessage}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {groups?.map((data, index) => {
              return (
                <div className="persona-container" key={data?._id}>
                  <div
                    className="persona box"
                    onClick={() => {
                      intoGroup(data?._id);
                    }}
                  >
                    <img
                      src="https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"
                      alt=""
                    />
                    <div className="info-section">
                      <span className="info-name">{data?.group_name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rightOne">
            {chatBoxDisplay ? (
              <ChatBox userNameObj={userNameObj} />
            ) : (
              <div className="right">
                <div className="rightFlex">
                  <img src={chatIcon} alt="" />
                  <h2>
                    <Link to="/friends">Choose a friend for conversation</Link>
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>
        {createGroupModal && (
          <CreateGroupModal
            openModal={createGroupModal}
            handleCloseModals={handleCloseModals}
            setCreateGroupModal={setCreateGroupModal}
            listAllGroups={listAllGroups}
          ></CreateGroupModal>
        )}
      </div>
    </>
  );
};

export default Messages;
