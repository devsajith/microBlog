/* eslint-disable react/prop-types */
import { Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Popover, Typography } from "@mui/material";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import classes from "../../posts/postList/postlist.module.css";
import SendIcon from "@mui/icons-material/Send";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
// import img1 from '../../../assets/image/outlineavatar.png'
import {useSelector } from "react-redux";
import { deleteReComment, editReComment } from "../../../Service/PostService";
import moment from "moment";
const ReplyCommentList = ({
  reComment,
  userId,
  showSuccessSnackBar,
  handleCommentPost,
  postId,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [commentEdit, setCommentEdit] = useState(false);
  const [commentEditor, setCommentEditor] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const userDetails = useSelector((state) => state.user.userDetails);
  const {
    register,
    handleSubmit,
    setValue: setValueOfcomment,
  } = useForm({
    mode: "onChange",
  });

  const editCommentModal = () => {
    setCommentEditor(true);
    setCommentEdit(false);
  };
  const handleDeleteComment = () => {
    commentModalClose();
    setAnchorEl(null);
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete comment",
      showCancelButton: true,
      icon: "warning",
      buttons: ["No, cancel it!", "Yes, I am sure!"],
      dangerMode: true,
    }).then((data) => {
      if (data.isConfirmed) {
        deleteReComment(deleteId).then(() => {
          setAnchorEl(null);
          showSuccessSnackBar("Comment Deleted Successfully");
          handleCommentPost(postId);
        });
      } else {
        setAnchorEl(null);
      }
    });
  };
  const handleEditCommentPost = (comment) => {
    editReComment(reComment?._id, comment?.comment, reComment?.version).then(
      (response) => {
        setCommentEditor(false);
        handleCommentPost(postId);
      }
    );
  };
  const commentModalOpen = (event, idOfComment) => {
    setValueOfcomment("comment", reComment?.comment);
    setCommentEdit((e) => !e);
    setAnchorEl(event.currentTarget);
    setDeleteId(idOfComment);
  };
  const commentModalClose = () => {
    setAnchorEl(null);
    setCommentEdit(false);
  };

  const open = Boolean(anchorEl);
  const idOfPopOver = open ? "simple-popover" : undefined;
  return (
    <>
      <Popover
        id={idOfPopOver}
        open={commentEdit}
        anchorEl={anchorEl}
        onClose={commentModalClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        className={classes.editPopup}
      >
        <div className={classes.editIcon}>
          <IconButton onClick={editCommentModal}>
            <Edit />
          </IconButton>
          <Typography
            sx={{
              p: 1,
              cursor: "pointer",
              fontSize: "large",
              fontFamily: "serif",
            }}
            onClick={editCommentModal}
          >
            Edit
          </Typography>
        </div>
        <div className={classes.deleteIcon} onClick={handleDeleteComment}>
          <IconButton>
            <Delete />
          </IconButton>
          <Typography
            sx={{
              p: 1,
              cursor: "pointer",
              fontSize: "large",
              fontFamily: "serif",
            }}
            onClick={handleDeleteComment}
          >
            Delete
          </Typography>
        </div>
      </Popover>
      <div className={classes["second-comment"]}>
        <img
          src={userDetails?.user?.photo || "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"
          }
          alt=""
          className={classes["comment-avatar"]} style={{marginRight:'.8rem'}}
        />
        <div className={classes["flex-reply"]}>
          <div className={classes["comments-subdiv2"]}>
            <div className={classes["comment-man"]}>
              {" "}
              <div className={classes["commenter-name"]}>
                {reComment.user_id?.userName}
              </div>
              <div className={classes.dot}>
                {userId === reComment?.user_id?._id && (
                  <Button
                    aria-describedby={idOfPopOver}
                    onClick={(e) => commentModalOpen(e, reComment?._id)}
                  >
                    <BsThreeDots color="black" size={20} />
                  </Button>
                )}
              </div>
            </div>
            {commentEditor ? (
              <>
                <form
                  onSubmit={handleSubmit(handleEditCommentPost)}
                  className={classes["comment-form"]}
                >
                  <div className={classes["comment-formflex"]}>
                    <input
                      type="text"
                      placeholder="comment"
                      {...register("comment", {
                        maxLength: {
                          value: 1000,
                          message: "Maxlength 500 characters",
                        },
                      })}
                    />
                    <button type="submit">
                      <SendIcon />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className={classes["the-comment"]}>{reComment?.comment}</div>
            )}
            {reComment?.version !== 1 && (
              <div className={classes["the-edited"]}>.Edited</div>
            )}
          </div>
          <span className={classes["time"]}>
            {moment(new Date(reComment?.created_date), "YYYYMMDD").fromNow()}
          </span>
        </div>
      </div>
    </>
  );
};

export default ReplyCommentList;
