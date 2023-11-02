/* eslint-disable react/prop-types */
import { Delete, Edit } from "@mui/icons-material";
import { Button,IconButton,Popover, Typography, Tooltip,} from "@mui/material";
import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsThreeDots } from "react-icons/bs";
import Swal from "sweetalert2";
import { deleteComment, editComment ,likeComment,dislikeComment} from "../../../Service/PostService";
import classes from "../../posts/postList/postlist.module.css";
import SendIcon from "@mui/icons-material/Send";
import ReplyCommentList from "../replyCommentList/ReplyCommentList";
// import img1 from '../../../assets/image/outlineavatar.png'
import {useSelector } from "react-redux";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import moment from "moment";
export const CommentList = ({
  data,
  userId,
  showSuccessSnackBar,
  post,
  setReplycommentId,
  handleCommentPost,
  replayComment,
  setValue,
  setArrayProp,
}) => {
  const [commentEditor, setCommentEditor] = useState(false);
  const [commentEdit, setCommentEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteId, setDeleteId] = useState("");
  const [replyBox, setReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyCommentId, setReplyCommentId] = useState(null);
  const initialValue = { open: false, _id: null, post_id: null };
  const [replyData, setReplyData] = useState(initialValue);
  const [commentOpen, setCommentOpen] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(data?.likes.length || 0);
  const userDetails = useSelector((state) => state.user.userDetails);
  function rplyBtn(commentId) {
    if (showReplies && replyCommentId === commentId) {

      setShowReplies(false);
      setReplyCommentId(null);
    } else {
      setShowReplies(true);
      setReplycommentId(commentId);
      setReplyCommentId(commentId);
    }
  }
  function closeRplyBtn() {
    setShowReplies(false);
    setReplyCommentId(null);
  }

// like and dislike of comment
const handleLikeComment = async (commentId) => {
  try {
    const response = await likeComment(commentId);
    if (response?.data) {
      setIsLike(true);
      setLikeCount(likeCount + 1);  }
  } catch (error) {
    return error;   }};
const handleDislikeComment = async (commentId) => {
  try {
    const response = await dislikeComment(commentId);
    if (response?.data) {
      setIsLike(false);
      setLikeCount(likeCount - 1);
      }
  } catch (error) {
    return error;   }  };
    useEffect(()=>{
      
    })
    useEffect(() => {
      if (data?.likes?.includes(userId)) {
        setIsLike(true);
      } else {
        setIsLike(false);}
    }, [data, userId]);
  const {
    register,
    handleSubmit,
    reset,
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
        deleteComment(deleteId).then(() => {
          setAnchorEl(null);
          showSuccessSnackBar("Comment Deleted Successfully");
          handleCommentPost(post._id);
        });
      } else {
        setAnchorEl(null);
      }
    });
  };
  const handleEditCommentPost = (comment) => {
    editComment(data?._id, comment?.comment, data?.version).then((response) => {
      setCommentEditor(false);
      handleCommentPost(post._id);
    });
  };
  const commentModalOpen = (event, idOfComment) => {
    setValueOfcomment("comment", data?.comment);
    setCommentEdit((e) => !e);
    setAnchorEl(event.currentTarget);
    setDeleteId(idOfComment);
  };
  const commentModalClose = () => {
    setAnchorEl(null);
    setCommentEdit(false);
  };
  // replybox
  const handleReplyBox = () => {
    setReplyBox((el) => !el);
  };
  const handleAddComent = (data) => {
    if (data.comment.trim() === "") return;
    if (replyData._id) {
      replayComment(replyData?._id, replyData?.post_id, data.comment).then(
        (response) => {
          setValue("comment", "");
          setReplyData(initialValue);
          handleCommentPost(post._id);
          reset();
          setReplyBox(false);

          setArrayProp((el) => el - 1);
          setCommentOpen(false);
        }
      );
    }
  };
  const open = Boolean(anchorEl);
  const idOfPopOver = open ? "simple-popover" : undefined;
  return (
    <>
      <Popover
        id={idOfPopOver} open={commentEdit}
        anchorEl={anchorEl} onClose={commentModalClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right", }}
        className={classes.editPopup}>
        <div className={classes.editIcon}>
          <IconButton onClick={editCommentModal}><Edit /></IconButton>
          <Typography sx={{
              p: 1, cursor: "pointer",
              fontSize: "large", fontFamily: "serif",}} onClick={editCommentModal} >
            Edit </Typography></div>
        <div className={classes.deleteIcon} onClick={handleDeleteComment}>
          <IconButton><Delete /></IconButton>
          <Typography sx={{
              p: 1, cursor: "pointer",
              fontSize: "large",fontFamily: "serif",}}
            onClick={handleDeleteComment}> Delete </Typography></div>
      </Popover>
      <div key={data?._id} className={classes["comments-here"]}>
        <div className={classes["first-comment"]}>
          <img src={data?.user_id?.photo || "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360" } alt="" className={classes["comment-avatar"]} />
          <div className={classes["comments-subdiv1"]}>
            <div className={classes["comment-man"]}>
              <div className={classes["commenter-name"]}>
                {data?.user_id?.userName}
                <span></span></div>
              <div className={classes.dot}>
                {userId === data?.user_id?._id && (
                  <Button aria-describedby={idOfPopOver}
                    onClick={(e) => commentModalOpen(e, data?._id)}>
                    <BsThreeDots color="black" size={20} />
                  </Button>
                )} </div>
            </div>
            {commentEditor ? (
              <>
                <form onSubmit={handleSubmit(handleEditCommentPost)} className={classes["comment-form"]}>
                  <div className={classes["comment-formflex"]}>
                    <input type="text" placeholder="comment"
                      {...register("comment", {
                        maxLength: {
                          value: 1000,
                          message: "Maxlength 500 characters",
                        }, })} />
                    <button type="submit"><SendIcon /></button>
                  </div>
                </form>
              </>
            ) : ( <div className={classes["the-comment"]}>{data?.comment}</div> )}
            {data?.version !== 1 && (<div className={classes["the-edited"]}>Edited</div>)}
               <div className={classes["like-dislike"]} >
                {isLike ? ( <ThumbUpIcon className={classes["icon-thumps"]} onClick={() =>  handleDislikeComment(data?._id)}>
                Like </ThumbUpIcon>) : ( <ThumbUpOffAltIcon className={classes["icon-thumps"]} onClick={() => handleLikeComment(data?._id)}>
                Dislike </ThumbUpOffAltIcon> )}
            {likeCount > 0 && <div>{likeCount}</div>}
          </div>
          </div>
        </div>
        <div className={classes["replyFlex"]}>
          <div className={classes["reply"]}>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowReplies(true);
                setValueOfcomment("comment", "");
                let newData = {
                  open: true,
                  _id: data?._id,
                  post_id: post._id,
                };
                setReplyData(newData);
                handleReplyBox();
                if (!commentOpen) {
                  setArrayProp((el) => el + 1);
                  setCommentOpen(true);
                } else {
                  setArrayProp((el) => el - 1);
                  setCommentOpen(false);
                }
              }}
            >
              Reply
            </span>
          </div>
          <span>|</span>
          <span className={classes["comment-time"]}>
            {moment(new Date(data?.created_date), "YYYYMMDD").fromNow()}
          </span>
        </div>
        <div className={classes["ViewHide"]}>
          {data?.reply_comment?.length > 0 && (
            <>
              {showReplies ? (
                <span
                  className={classes["reply"]}
                  onClick={closeRplyBtn}
                  style={{ cursor: "pointer" }}
                >
                  Hide replies
                </span>
              ) : (
                <span
                  className={classes["reply"]}
                  style={{ cursor: "pointer" }}
                  onClick={() => rplyBtn(data?._id)}
                >
                  View replies
                </span>
              )}
            </>
          )}
        </div>

        {showReplies ? (
          <>
            {data?.reply_comment?.length > 0 &&
              data?.reply_comment?.map((reComment) => {
                return (
                  <ReplyCommentList
                    reComment={reComment}
                    key={reComment._id}
                    userId={userId}
                    showSuccessSnackBar={showSuccessSnackBar}
                    handleCommentPost={handleCommentPost}
                    postId={post?._id}
                  />
                );
              })}
          </>
        ) : (
          ""
        )}
        {replyBox && (
          <div className={classes["comment-input-flex"]}>
            <div className={classes["comment-input"]}>
              <img
                src={userDetails?.user?.photo || "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360" } alt=""  className={classes["comment-avatar"]} />
              <form
                onSubmit={handleSubmit(handleAddComent)}
                className={classes["form"]}
              >
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
                {/* <p>{errors?.maxLength?.message}</p> */}
                <Button type="submit" value="submit">
                  <Tooltip title="Send">
                    <SendIcon />
                  </Tooltip>
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};