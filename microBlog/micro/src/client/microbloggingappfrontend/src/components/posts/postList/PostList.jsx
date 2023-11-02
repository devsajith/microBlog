/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useRef, useCallback } from "react";
import classes from "./postlist.module.css";
import Post from "../post/Post";
import jwt_decode from "jwt-decode";

const PostList = ({
  posts,
  pagenateLoading,
  skipId,
  setPaginateLoading,
  fetchlistPost,
  showSuccessSnackBar,
}) => {
  const accessToken = localStorage.getItem("accessToken");
  let decodedToken = jwt_decode(accessToken);

  const listInnerRef = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (listInnerRef.current) listInnerRef.current.disconnect();
      listInnerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!pagenateLoading && skipId) {
            setPaginateLoading(true);
            fetchlistPost(skipId);
          }
        }
      });
      if (node) listInnerRef.current.observe(node);
    },
    [skipId]
  );

  return (
    <div className={classes["post-main"]}>
      <div className={classes["column"]}>
        {posts?.map((post, index) => (
          <Post
            fetchlistPost={fetchlistPost}
            showSuccessSnackBar={showSuccessSnackBar}
            post={post}
            index={index}
            posts={posts}
            lastPostElementRef={lastPostElementRef}
            userId={decodedToken?.id}
            key={decodedToken?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default PostList;
