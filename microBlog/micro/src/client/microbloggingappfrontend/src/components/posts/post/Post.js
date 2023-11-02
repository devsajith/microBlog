/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import classes from "../postList/postlist.module.css";
import moment from "moment";
import thumpsup from "../../../assets/image/thumpsup.png";
import share from "../../../assets/image/share.png";
import { BsThreeDots } from "react-icons/bs";
import { Button, Tooltip } from "@mui/material";
import CreatePost from "../../modal/createPost/CreatePost";
import deletePostFunction from "../post/functions/delete/DeletePost";
import { useSelector } from "react-redux";
import commentInputBox from "../post/functions/commentAddBox/CommentAddBox";
import styledMenuFunction from "../post/functions/styledMenu/StyledMenu";
import infinityScrollComment from "../post/functions/infinityScrollComment/InfinityScrollComment";
import {addComment, likedUsers,likePost, dislike,listComments, replayComment,} from "../../../Service/PostService";
import LikesModal from "../../modal/likesModal/LikesModal";
import ShareModal from "../../modal/shareModal/shareModal";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { CommentList } from "../../comments/commentList/CommentList";
import StyledFunction from "./functions/styledFunction/StyledFunction";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import SortComment from "./functions/sortcomment/SortComment";
const Post = ({ post,  index, posts,  lastPostElementRef,  fetchlistPost,  showSuccessSnackBar,  userId,}) => {
  const [likes, setLikes] = useState([]);
  const [likePageLimit, setLikePageLimit] = useState(10);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [sort, setSort] = useState();
  const [openModals, setOpenModals] = useState(false);
  const [openLikeModal, setOpenLikeModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false)
  const [shareId, setshareId] = useState('')
  const [sharedLength, setSharedLength] = useState(null)
  const [isLike, setIsLike] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [comments, setComments] = React.useState([]);
  const [replycommentId, setReplycommentId] = useState("");
  const initialValue = { open: false, _id: null, post_id: null };
  const [replyData, setReplyData] = useState(initialValue);
  const [Id, setID] = useState("");
  const [arrayProp, setArrayProp] = useState(0)
  const [shared, setShared] = useState(false)
  const [sharedBy, setsharedBy] = useState([])
const navigate = useNavigate()
const CurrentUserProfile = () =>{
  navigate('/profile')}
  const fetchlistLike = useCallback(
    (k) => {
      likedUsers(post._id)
        .then((data) => {
          setLikes(data.data);
          k && data?.data?.result?.length > 0 && setOpenLikeModal(true);    })
        .catch((error) => {});  },
    [post._id]);
  const toNextPage = () => {
    const currentLimit = likePageLimit;
    setLikePageLimit(currentLimit + 5); };
  const StyledMenu = styledMenuFunction();
  const openLkes = () => {
    fetchlistLike(true);};
  useEffect(() => {
    fetchlistLike(false);
  }, [fetchlistLike]);
  const handleLikePost = async (postId) => {
    try {
      const response = await likePost(postId);
      if (response?.data) {
        setIsLike(true);
        fetchlistLike(false);    }
    } catch (error) {
      return error;   }};
  const handleDislikePost = async (postId) => {
    try {
      const response = await dislike(postId);
      if (response?.data) {
        fetchlistLike(false);
        setIsLike(false);}
    } catch (error) {
      return error;   }  };
  const {register,  handleSubmit,  reset,  setValue,  formState: { errors },
  } = useForm({ mode: "onChange" });
  const handleClickHoverModal = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleShare =()=>{
    setsharedBy(post.sharedBy)
    const length = sharedBy.length;
    if (length>0){
      setShared(true)
      setSharedLength(length)}
  }
  useEffect(() => {
    handleShare()
  }, [])
  const handleCloseHoverModalEdit = () => {
    setAnchorEl(null);};
  useEffect(() => {
    if (post?.likes?.includes(userId)) {
      setIsLike(true);
    } else {
      setIsLike(false);}
  }, [post, userId]);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [seeMore, setSeeMore] = useState(false);
  const handleClick = () => {
    setSeeMore(!seeMore); };
  function handleCloseModals() {
    setOpenModals(false);
    setOpenLikeModal(false);
    setCommentModal(false);
    setOpenShareModal(false);}
  const [limit, setlimit] = useState(5);
  const commentOverflow = infinityScrollComment(  setlimit,  limit,  Id,  sort,  setComments  );
  const handleDeletePost = deletePostFunction(  setAnchorEl,  post,  showSuccessSnackBar,  fetchlistPost  );
  const editPost = () => {
    setOpenModals(true);
    setAnchorEl(null);};
  const handleCommentPost = (id) => {
    setID(id);
    listComments(id, limit, sort).then((response) => {
      setComments(response?.data?.result);
    });};
  const handleAddComent = (data) => {
    if (data.comment.trim() === "") return;
    addComment(data.comment, post._id).then((response) => {
      reset();
      handleCommentPost(post._id);  });
  };
  const userDetails = useSelector((state) => state.user.userDetails);
  useEffect(() => {
    if (openLikeModal)
      likedUsers(post._id, likePageLimit)
        .then((data) => {
          setLikes(data.data);  })
        .catch((error) => {});
  }, [likePageLimit, openLikeModal, post._id]);
  const commentBox = commentInputBox(handleSubmit, handleAddComent, register, errors,userDetails);
   const handleSharePost =(postId) =>{
    setOpenShareModal(true)
    setshareId(postId)
   }
  useEffect(()=>{
    if(Id){
      handleCommentPost(Id)
    }
  },[sort,Id])
  return (
    <>
      <div     key={post._id}  ref={index + 1 === posts.length ? lastPostElementRef : null}
        className={classes["post"]} >
          {post?.sharedBy?.length>1&&(<p>{post.sharedBy[0].userName} Reposted this</p>)}        
          <div className={classes["post-author"]} ><br></br>

        {userId === post?.user_id?._id ? (
  <img
    src={post?.user_id?.photo || "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"}
    alt=""
    onClick={CurrentUserProfile}
    style={{ cursor: 'pointer' }}
  />
) : (
  <Link to={`/fprofile/${post?.user_id?._id}`}>
  <img
    src={post?.user_id?.photo || "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"}
    alt=""
    style={{ cursor: 'pointer' }}
  />
</Link>
)}
          <div className={classes.user} >
            <div className={classes.nameTime}>
            {userId === post?.user_id?._id ? (
              <div onClick={CurrentUserProfile} style={{cursor:'pointer'}}>{post?.user_id.userName}</div>):(
                <Link to={`/fprofile/${post?.user_id?._id}`} style={{ textDecoration: 'none',color:'black' }}>
  <div style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>
    {post?.user_id.userName}
  </div>
</Link>   )}
              <div className={classes.date}>         {" "}
                {moment(new Date(post?.created_date), "YYYYMMDD").fromNow()}
              </div> </div>
              <div className={classes.dot}>
                <Button aria-describedby={id} onClick={handleClickHoverModal}>
                  <BsThreeDots color="black" size={20} />
                </Button>
              </div>
          </div>
        </div>
        {post.text.replace(/\s+/g, " ").length -
          (post.text.split("\n").length - 1) >
        300 ? (
          <p className={classes["seeMore"]} style={{ wordBreak: "break-all" }}>
            {seeMore ? (
              <p>
                {post.text}{" "}
                <button onClick={handleClick} className={classes["seemore"]}>
                  {" "}
                  See Less...
                </button>{" "}  </p>
            ) : (
              <p>
                {post.text
                  .replace(/\s+/g, " ")
                  .replace(/\n+/g, null)
                  .slice(0, 300)}
                <button onClick={handleClick} className={classes["seemore"]}>
                  See More...
                </button>
              </p>
            )}
          </p>
        ) : (
          <p style={{ wordBreak: "break-all" }}>{post.text}</p>
        )}
        <img src={post?.imageUrl} alt="" width="100%" />
        <div className={classes["post-stats"]}>
          <div>
            <img
              src={thumpsup}
              alt=""
              onClick={() => {
                openLkes();
              }}
            />
            <span
              className={classes["liked-users"]}
              onClick={() => {
                openLkes();
              }}
            >
              {likes?.count}{" "}
            </span>
          </div>
          <div>
            <span
              className={classes["liked-users"]}
              onClick={() => {
                openLkes();
              }}
            >
              {post && post.comment_score / 5} Comments{" "}
            </span>
          </div>
          {shared && (<div>{sharedLength} Shares </div>)}
        </div>
        <div className={classes["post-activity"]}>
          <div className="like-dislike" style={{ cursor: "pointer" }}>
            {isLike ? (
              <ThumbUpIcon onClick={() => handleDislikePost(post._id)}>
                Like
              </ThumbUpIcon>
            ) : (
              <ThumbUpOffAltIcon onClick={() => handleLikePost(post._id)}>
                Dislike
              </ThumbUpOffAltIcon>
            )}
          </div>
          <div
            className={classes["post-activity-link"]}
            onClick={() => {   handleCommentPost(post._id); setCommentModal(!commentModal);  setArrayProp(0);}}>
            <CommentIcon style={{ height: "18px" }} />
            <span>Comment</span>
          </div>
          <div  onClick={()=>{handleSharePost(post._id)}} className={classes["post-activity-link"]}>
            <img src={share} alt="" /> <span>Share</span>
          </div>
        </div>
       

        {StyledFunction(StyledMenu, anchorEl, open, handleCloseHoverModalEdit, userId, post, editPost, handleDeletePost,setAnchorEl)}
    

        {openModals && (
          <CreatePost      feedsPage={true}  postId={post._id}  handleCloseModals={handleCloseModals}  defaultImage={post?.imageUrl ? post?.imageUrl : null}
            defaultText={post.text}  openModals={openModals}  showSuccessSnackBar={showSuccessSnackBar}  fetchlistPost={fetchlistPost}  edit={true}  version={post.version}  />  )}
        {openLikeModal && (
          <LikesModal
            nextPage={toNextPage}  openModals={openLikeModal}  handleCloseModals={handleCloseModals}  />
        )}
        {commentModal && (
          <>
            {arrayProp===0&& commentBox}
          <SortComment setSort={setSort} sort={sort}/>
            <div className={classes["comment-box"]} id="comment-list" onScroll={commentOverflow}>
              {comments?.slice(0).map((data) => {
                return (
                  <CommentList  data={data}  userId={userId}  post={post}  setReplyData={setReplyData}  setReplycommentId={setReplycommentId}
                    replycommentId={replycommentId}  key={data._id}  showSuccessSnackBar={showSuccessSnackBar}  handleCommentPost={handleCommentPost}  replayComment={replayComment}
                    addComment={addComment}       setValue={setValue}  setArrayProp={setArrayProp}/>
                );
              })}
            </div>
            {replyData.open && (
              <div className={classes.commentBoxContainer}>
                <div className={classes.commentBox}>{commentBox}</div>
                <div
                  onClick={() => {
                    setReplyData(initialValue);
                  }}
                >
                  <Tooltip title="close">
                    <CloseIcon />
                  </Tooltip>
                </div>
              </div>
            )}
          </>
        )}
        {openLikeModal && (
          <LikesModal
            nextPage={toNextPage}openModals={openLikeModal} handleCloseModals={handleCloseModals} likes={likes}
          />
        )}
        { openShareModal&&(
        <ShareModal openShareModal={openShareModal}  setOpenShareModal={setOpenShareModal}  handleCloseModals={handleCloseModals} postId={shareId}   showSuccessSnackBar={showSuccessSnackBar}/>
        )}
      </div>
    </>
  );
};
export default Post;


