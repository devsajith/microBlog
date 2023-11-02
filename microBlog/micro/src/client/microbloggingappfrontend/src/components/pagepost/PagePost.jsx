import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import CreatePost from "../modal/createPost/CreatePost";
// import profileIcon from "../../assets/image/outlineavatar.png";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { listPost } from "../../Service/pages";
import jwt_decode from "jwt-decode";
import Post from "../posts/post/Post";

const PagePost = () => {
  const [openModals, setOpenModals] = useState(false);
  const pageId = useLocation().state.id;
  const userDetails = useSelector((state) => state.user.userDetails);
  const [postList, setPostList] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  let decodedToken = jwt_decode(accessToken);

  function handleCloseModals() {
    setOpenModals(false);
  }
  function handleOpen() {
    setOpenModals(true);
  }
  const getPostList = () => {
    listPost(pageId).then((res) => {
      setPostList(res.data.result);
    });
  };

  const handleClick = (data) => {};
  useEffect(() => {
    getPostList();
  }, []);

  return (
    <>
      <Card className="StartPost" style={{ marginBottom: "12px" }}>
        <img
          src={(userDetails?.photo && userDetails?.photo) || "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"}
          alt=""
          className="avatar"
        />
        <input
          placeholder="Start a post"
          className="post"
          readOnly
          onClick={handleOpen}
        />
        {openModals && (
          <CreatePost
            feedsPage={false}
            handleCloseModals={handleCloseModals}
            openModals={openModals}
            pageId={pageId}
            showSuccessSnackBar={handleClick}
            fetchlistPost={getPostList}
          />
        )}
      </Card>
      {postList?.map((post, index) => (
        <Post
          fetchlistPost={getPostList}
          post={post}
          index={index}
          posts={postList}
          showSuccessSnackBar={handleClick}
          userId={decodedToken?.id}
          key={decodedToken?.id}
        />
      ))}
    </>
  );
};
export default PagePost;
