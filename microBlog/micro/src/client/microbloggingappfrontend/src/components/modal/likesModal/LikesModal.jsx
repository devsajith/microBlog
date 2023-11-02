/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/prop-types */
import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./LikesModal.module.css";
// import profileIcon from "../../../assets/image/outlineavatar.png";

const LikesModal = (props) => {
  const { openModals, handleCloseModals, likes, nextPage } = props;

  const infinityScroll = (e) => {
    if (
      e.target.scrollTop + 50 >=
      e.target.scrollHeight - e.target.clientHeight
    ) {
      nextPage();
    }
  };

  return (
    <div>
      <Modal open={openModals} onClose={handleCloseModals} center>
        <div className={classes.createPostModal}>
          <Box
            onScroll={infinityScroll}
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
              <div className={classes.title}>Likes</div>
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
              {likes?.result.map((data) => {
                return (
                  <>
                    <div className={classes.line} />
                    <div className={classes.likesContainer}>
                      <img
                        src="https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"
                        className={classes.likedImg}
                        alt=""
                      ></img>
                      <Typography className={classes.likesName}>
                        {data.userName}
                      </Typography>
                    </div>
                  </>
                );
              })}
            </div>

            <div className={classes.listLine} />
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default LikesModal;
