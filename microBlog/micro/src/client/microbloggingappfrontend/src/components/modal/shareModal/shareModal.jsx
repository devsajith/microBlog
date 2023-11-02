import React from "react";
import classes from "./sharemodal.module.css";
import infinityScrollComment from "../../posts/post/functions/infinityScrollComment/InfinityScrollComment";
import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { sharePost } from "../../../Service/PostService";

const shareModal = ({openShareModal, handleCloseModals, postId,showSuccessSnackBar, setOpenShareModal}) => {


  const sharePostfun=()=>{
    sharePost(postId).then((response)=>{
      showSuccessSnackBar(response?.data)
      setOpenShareModal(false)
    })
  }
  return (
    <div>
      <Modal open={openShareModal} onClose={handleCloseModals} center>
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
            
              <div className={classes.title}>Repost
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
                    float: "Right"

                  }}
                />
              </span>
              </div>
            
            <div style={{ marginTop: "50px" }}>
              <p> Share This Post<button  className={classes.buttonStyle} style={{ float: "Right" }} onClick={sharePostfun}> Share </button></p>
            </div>

            <div className={classes.listLine} />
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default shareModal;
