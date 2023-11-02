/* eslint-disable react/prop-types */

import React, { useEffect, useRef, useState } from "react";
import classes from "./createGroupModal.module.css";
import infinityScrollComment from "../../posts/post/functions/infinityScrollComment/InfinityScrollComment";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { friendlist } from "../../../Service/friendsService";
import jwt_decode from "jwt-decode";
import { createGroup, getUserDetails } from "../../../Service/userService";
import { Photo } from "@mui/icons-material";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { collection} from "firebase/firestore";
import { db } from "../../../Firebase";
import { addDoc } from "firebase/firestore";


const CreateGroupModal = ({ openModal, handleCloseModals, setCreateGroupModal, listAllGroups }) => {
  const profileInput = useRef();
  const [searchTextValue, setSearchTextValue] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [friends, setFriends] = useState([]);
  const [profileError, setProfileError] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [members, setMembers] = useState([]);
  const [groupInputValue, setGroupInputValue] = useState("");
  const [uids, setUids] = useState([])
  const accessToken = localStorage.getItem("accessToken");


  let decodedToken = jwt_decode(accessToken);
  const userId = decodedToken.id;

  useEffect(() => {
    friendsList();
    setMembers([userId]);
    setPageNumber("");
    setSearchTextValue("");
  }, []);

  const friendsList = () => {
    friendlist(searchTextValue, pageNumber).then((data) => {
      setFriends(data.data.result);
    });
  };
  const addMember = (id,email) => {
    const data = {email:email}
    getUserDetails(data).then((response)=>{
      setUids([...uids,response?.data?.uid])
      

    })
    setMembers([...members, id]);
  };
  const removeMember = (id) => {
    const updatedMembers = members.filter(memberId => memberId !== id);
  setMembers(updatedMembers);
  };
  const handleCreateGroup =  async () => {
    const groupName = groupInputValue;  
    let profilePhotoUrl = await  profilePhotoUpload();
    const data = { groupName: groupName, members: members, imageUrl:profilePhotoUrl,uid:uids };
    createGroup(data).then((response) => {});
    setCreateGroupModal(false)
    listAllGroups()
    addGroupChat(groupName,members)
      };
  const addGroupChat = async(groupName,memebers)=>{ 
       addDoc(collection(db,groupInputValue),{
          groupName,
          memebers,
        })
  }    
  const vaildateProfilephoto = (file) => {
    let fileFormat = file.name.split(".");
    fileFormat = fileFormat[fileFormat.length - 1];
    fileFormat = fileFormat.toUpperCase();
    if (
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type) &&
      ["JPG", "PNG", "JPEG"].includes(fileFormat)
    ) {
      const fileSize = file.size / 1024 / 1024; // in MiB
      if (fileSize > 5) {
        setProfileError("Maximum file size allowed is 5 MB");
        return null;
      } else {
        setProfileError("");
        return file;
      }
    } else {
      setProfileError("Please select a PNG, JPG, or JPEG file");
      return null;
    }
  };
  const handleProfilePhoto = (e) => {
    let file = e?.target?.files[0];

    setProfilePhoto(vaildateProfilephoto(file));
  };


  const profilePhotoUpload = async () => {
    if (profilePhoto) {
      const storage = getStorage();
      const storageRef = ref(storage, `Profilephoto/${profilePhoto.name}`);

      try {
        const uploaded = await uploadBytes(storageRef, profilePhoto, {
          contentType: profilePhoto.type,
        });
        if (uploaded) {
          return getDownloadURL(storageRef);
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }
    return false;
  };


  return (
    <div>
      <Modal open={openModal} onClose={handleCloseModals} center>
        <div className={classes.createPostModal}>
          <Box
            onScroll={infinityScrollComment}
            style={{ maxHeight: "90vh" }}
            sx={{
              bgcolor: "background.paper",
              borderRadius: "10px",
              boxShadow: 24,
              paddingLeft: "30px",
              minWidth: "40%",
              marginTop: "9px !important",
              overflowY: "auto",
              px: 4,
              paddingTop: 0,
            }}
          >
            <div className={classes.title}>
              Create Group
              <span
                onClick={handleCloseModals}
                style={{
                  cursor: "pointer",
                  padding: "0px 0px",
                }}
              >
                <CloseIcon
                  style={{
                    marginTop: "16px",
                    color: "grey",
                    float: "Right",
                  }}
                />
              </span>
            </div>
            <form>
              <div className={classes.groupName}>
                <TextField
                  id="outlined-basic"
                  label="Group Name *"
                  variant="outlined"
                  value={groupInputValue}
                  onChange={(e) => setGroupInputValue(e.target.value)}
                />
              </div>

              {profilePhoto ? (
                <div className={classes.imageBox}>
                  <img
                    onClick={() => {
                      profileInput.current.click();
                    }}
                    style={{ height: "200px", width: "200px" }}
                    src={URL.createObjectURL(profilePhoto)}
                    alt=""
                  />
                </div>
              ) : (
                <>
                  <div
                    className={classes.photoDiv}
                    onClick={() => {
                      profileInput.current.click();
                    }}
                  >
                    <div className={classes.PhotoIcon}>
                      <Photo className={classes.PhotoIconHere} />
                    </div>
                    <div className={classes.photoName}>
                      <span>Upload Group Image</span>
                    </div>
                  </div>
                  <span style={{ color: "red", fontSize: "13px" }}>
                    {profileError}
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                ref={profileInput}
                style={{ display: "none" }}
                onChange={handleProfilePhoto}
              />
              <div style={{ marginTop: "50px" }}>
                {friends.map((friend, index) => {
                  const friendDetails = friend.requested_user
                    ? friend.requested_user?._id === userId
                      ? friend.reciever_user
                      : friend.requested_user
                    : friend.reciever_user;
                  return (
                    <>
                      <div className={classes.likesContainer}>
                        <img
                          src="https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"
                          className={classes.likedImg}
                          alt=""
                        ></img>
                        <Typography className={classes.likesName}>
                          {friendDetails.userName}
                        </Typography>
                        {members.includes(friendDetails._id) ? (
                        <Button className="remove"
                        style={{ marginLeft: '20px', color: 'red' }}
                        onClick={() => removeMember(friendDetails._id)}
                      >
                        Remove
                      </Button>
                        ) : (
                          <Button 
                          style={{marginLeft: '20px'}}
                          className="textButton"
                          onClick={() => addMember(friendDetails._id, friendDetails.email)}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </form>
            <div style={{ marginTop: "50px" }}>
              <p>
                {" "}
                <button
                  className={classes.buttonStyle}
                  style={{ float: "Right" }}
                  onClick={handleCreateGroup}
                  
                >
                  {" "}
                  Create{" "}
                </button>
              </p>
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default CreateGroupModal;
