/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
// import  from "../../../assets/image/outlineavatar.png";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db, auth } from "../../../Firebase";
import classes from "./chatbox.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { getRelativeDateTime } from "../../../utils/helper";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SendIcon from "@mui/icons-material/Send";
import AlwaysScrollToBottom from "../../../utils/scrolltobottom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { IconButton } from "@mui/material";
import jwt_decode from "jwt-decode";
import {chatNotification} from "../../../Service/PostService";

const ChatComponent = ({ userNameObj }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const scroll = useRef(null);
  let recipientId = "";
  let senderName = "";
  let email = "";
  recipientId = userNameObj?.uid;
  
  senderName = userNameObj?.userName;
  const userEmail = localStorage.getItem("userEmail");
  email = userEmail;
  const userName = localStorage.getItem("UserName");
  const uid = localStorage.getItem("uid");
  const photo = location?.state?.photo;
  const [input, setInput] = useState("");

  const accessToken = localStorage.getItem("accessToken");
  let decodedToken = jwt_decode(accessToken);
  const currentUserEmail = decodedToken.email;
const currentUserId=decodedToken.id;
localStorage.setItem("uidof",currentUserId)
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("uid", "in", [uid, recipientId]),
      where("recipientId", "in", [uid, recipientId]),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [recipientId, uid]);

  const convertDate = (createdAt) => {
    const messageDate = moment
      .unix(createdAt?.seconds)
      .add(createdAt?.nanoseconds / 1000000, "milliseconds");
    const Fordate = messageDate.format("YYYY-MM-DD HH:mm:ss.SSS");
    let convertedDate = getRelativeDateTime(Fordate);
    return convertedDate;
  };
  const sendMessage = () => {
    // Get the current user's details
    const { uid, displayName, photoURL } = auth.currentUser;
  
    addDoc(collection(db, "messages"), {
      text: input,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid: uid,
      userName: userName,
      senderName: senderName,
      recipientId: recipientId,
    })
      .then(() => {
        setInput("");
  
        return addDoc(collection(db, "chatlist"), {
          uid: uid,
          recipientId: recipientId,
          userName: userName,
          senderName: senderName,
          email: email,
          currentUserEmail: currentUserEmail,
        }).then(()=>{
           chatNotification({"sender":currentUserId,"email":email,"senderFirebase":recipientId,"message":input})
        })
      })
      .catch((error) => {
       return error
      });
  };
  
  return (
    <div className={classes.chatBox} ref={scroll}>
      <div className={classes["name-flex"]}>
        <div className={classes.nameContainer}>
          <div>
            <IconButton onClick={() => navigate(-1)}>
              <KeyboardBackspaceIcon />
            </IconButton>
          </div>
          <div className={classes["post-author"]}>
            <img src={photo || "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"} alt="" />
          </div>
          <div className={classes.senderName}>
            <h6>{senderName}</h6>
          </div>
        </div>
      </div>
      <div className={classes.topMessageDiv}>
        <div className={classes.messageDiv}>
          {messages?.map((data, index) => {
            return (
              <div key={data.id}>
                {data.uid === uid ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "right",
                      padding: "10px",
                    }}
                  >
                    <div className={classes.messagesRight}>
                      {data.text}
                      <div className={classes.messagesTime}>
                        {data?.createdAt && (
                          <small>{convertDate(data?.createdAt)}</small>
                        )}
                        <DoneAllIcon
                          style={{
                            fontSize: "18px",
                            color: "rgb(145 172 195)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      padding: "10px",
                    }}
                  >
                    <div className={classes.messagesLeft}>
                      {data.text}
                      <div className={classes.messagesTime}>
                        {data?.createdAt && (
                          <small>{convertDate(data?.createdAt)}</small>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <AlwaysScrollToBottom />
        </div>
        <div className={classes.messageInputContainer}>
          <input
            style={{ borderRadius: "2rem" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            onChange={(e) => setInput(e.target.value)}
            className={classes.formInput}
            value={input}
            placeholder="Type something"
            autoFocus
          />

          <IconButton
            size="small"
            disabled={input.trim().length <= 0}
            onClick={sendMessage}
            variant="contained"
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
      <span></span>
    </div>
  );
};
export default ChatComponent;
