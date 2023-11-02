/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import classes from "./groupdetails.module.css";
import CloseIcon from "@mui/icons-material/Close";
const GroupdetailModal =(props) => {

    const {openModal,handleCloseModals,members}= props;
 
  return (
    <div>
    <Modal open={openModal} onClose={handleCloseModals} center>
      <div className={classes.createPostModal}>
        <Box
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
          <div className={classes.createPostHeadingContaianer}>
            <div className={classes.title}>Members</div>
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
                  marginLeft: "85px",
                }}
              />
            </span>
          </div>
          <div style={{ marginTop: "50px" }}>
            {members?.map((data) => {
              return (
                <>
                  <div className={classes.likesContainer}>
                    <img
                      src="https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"
                      className={classes.likedImg}
                      alt=""
                    ></img>
                    <Typography className={classes.likesName}>
                      {data?.userName}
                    </Typography>
                  </div>
                </>
              );
            })}
          </div>

        </Box>
      </div>
    </Modal>
  </div>
  );
};
export default GroupdetailModal;
