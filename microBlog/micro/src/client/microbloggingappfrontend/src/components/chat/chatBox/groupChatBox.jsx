import React, { useEffect, useState } from "react";
import classes from "./chatbox.module.css";
import { IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SendIcon from "@mui/icons-material/Send";
import { deleteGroup, groupDetails } from "../../../Service/userService";
import InfoIcon from "@mui/icons-material/Info";
import GroupdetailModal from "../../modal/groupDetailsModal/groupdetailModal";
import EditIcon from "@mui/icons-material/Edit";
import GroupEditModal from "../../modal/createGroup/groupEditModal/groupEditModal";
import { Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { db, auth } from "../../../Firebase";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import AlwaysScrollToBottom from "../../../utils/scrolltobottom";
import moment from "moment";
import { getRelativeDateTime } from "../../../utils/helper";
import { useSelector } from "react-redux";

const GroupChatBox = () => {
  const [input, setInput] = useState("");
  const [group, setGroup] = useState([]);
  const location = useLocation();
  const [editModal, setEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const uid = localStorage.getItem("uid");
  const [grpName, setGrpName] = useState("");
  const [admin, setAdmin] = useState(false);
  const groupName = location?.state?.groupName;
  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(accessToken);
  const userId = decodedToken.id;
  const userDetails = useSelector((state) => state.user.userDetails);

  const id = location?.state?.id;

  const navigate = useNavigate();

  useEffect(() => {
    groupData();
    const q = query(collection(db, groupName), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let message = [];
      querySnapshot.forEach((doc) => {
        message.push({ ...doc.data(), id: doc.id });
      });
      setMessages(message);
    });

    return () => {
      unsubscribe(); // Unsubscribe from the snapshot listener when the component unmounts
    };
  }, []);

  const groupData = async () => {
    groupDetails(id).then((response) => {
      setGroup(response?.data);
      setMembers(response?.data?.members);
      setGrpName(response?.data?.group_name);
      if (response?.data?.admin === userId) {
        setAdmin(true);
      }
    });
  };
  const sendMessage = () => {
    const { uid } = auth.currentUser;
    const messageData = {
      senderName: userDetails?.user?.userName,
      text: input,
      uid: uid,
      createdAt: serverTimestamp(),
    };
    //Get the sender user details
    addDoc(collection(db, grpName), messageData, {}).then((docRef) => {
      setInput("");
      return addDoc(collection(db, "groupChatList"), {
        uid: uid,
        senderName: userDetails?.user?.userName,
      });
    });
  };
  const handleDetailModal = () => {
    setOpenDetailModal(true);
  };
  function handleCloseModals() {
    setOpenDetailModal(false);
    setEditModal(false);
  }
  const handleEdit = () => {
    setEditModal(true);
  };
  const handleDelate = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete group",
      showCancelButton: true,
      icon: "warning",
      buttons: ["No, cancel it!", "Yes, I am sure!"],
      dangerMode: true,
    }).then((data) => {
      if (data.isConfirmed) {
        deleteGroup(id).then((response) => {
          navigate(-1);
        });
      }
    });
  };

  const convertDate = (createdAt) => {
    const messageDate = moment
      .unix(createdAt?.seconds)
      .add(createdAt?.nanoseconds / 1000000, "milliseconds");
    const Fordate = messageDate.format("YYYY-MM-DD HH:mm:ss.SSS");
    let convertedDate = getRelativeDateTime(Fordate);
    return convertedDate;
  };
  return (
    <div className={classes.chatBox}>
      <div className={classes["name-flex"]}>
        <div className={classes.nameContainer}>
          <div className={classes.nameContainerInner}>
            <div>
              <IconButton onClick={() => navigate(-1)}>
                <KeyboardBackspaceIcon />
              </IconButton>
            </div>
            <div className={classes["post-author"]}>
              <img
                src={
                  group?.image_url ||
                  "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"
                }
                alt=""
              />
            </div>
            <div className={classes.senderName}>
              <h6>{group?.group_name}</h6>
            </div>
          </div>
          <div className={classes.sideButtons}>
            {" "}
            <InfoIcon onClick={handleDetailModal}> </InfoIcon>
            <EditIcon onClick={handleEdit}></EditIcon>
            {admin && <Delete onClick={handleDelate}> </Delete>}
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
                      <div className={classes.userName}>{data?.senderName}</div>
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
      {openDetailModal && (
        <GroupdetailModal
          openModal={openDetailModal}
          handleCloseModals={handleCloseModals}
          members={members}
        ></GroupdetailModal>
      )}
      {editModal && (
        <GroupEditModal
          openModal={editModal}
          handleCloseModals={handleCloseModals}
          setEditModal={setEditModal}
          id={group?._id}
          grpName={grpName}
          groupData={groupData}
        ></GroupEditModal>
      )}
    </div>
  );
};
export default GroupChatBox;
