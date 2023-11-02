/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./createpost.module.css";
import { Photo, Clear } from "@mui/icons-material";
import { addPost, updatePost } from "../../../Service/PostService";
import { uploadBytes, getStorage, ref, getDownloadURL } from "firebase/storage";
import { useSelector } from "react-redux";
import InputEmoji from "react-input-emoji";
// import profileIcon from "../../../assets/image/outlineavatar.png";
import { addPagePostApi } from "../../../Service/pages";

const CreatePost = ({
  feedsPage,
  openModals,
  handleCloseModals,
  showSuccessSnackBar,
  fetchlistPost,
  defaultImage,
  defaultText,
  postId,
  edit,
  version,
  pageId,
}) => {
  const [image, setImage] = useState(null);
  const [imageView, setImageView] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const userDetails = useSelector((state) => state.user.userDetails);
  const [oldImage, setOldImage] = useState(defaultImage && defaultImage);
  const [dragOver, setDragOver] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const handleAddPost = async () => {
    if (!text.trim() && text.length !== 0) {
      setErrorMessage("");
      return;
    }
    setIsLoading(true);
    let imageStorageUrl = null;
    if (!(image?.type === undefined && image?.startsWith("http"))) {
      imageStorageUrl = await uploadToFirebaseStorage();
    }
    if (feedsPage) {
      onAddPost(imageStorageUrl);
    } else {
      addPagePost(imageStorageUrl);
    }
  };
  const onAddPost = async (imageStorageUrl) => {
    try {
      let response;

      if (postId) {
        const img = imageStorageUrl ? imageStorageUrl : oldImage;
        response = await updatePost(img, text, postId, version);

        if (response && response.status === 200) {
          showSuccessSnackBar("Post Updated Successfully");
          handleCloseModals();
          fetchlistPost();
        }
      } else {
        response = await addPost(imageStorageUrl, text);
        if (response && response.status === 200) {
          showSuccessSnackBar("Post Added Successfully");
          handleCloseModals();
          fetchlistPost();
        } else {
          setError("error");
        }
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const addPagePost = async (imageStorageUrl) => {
    try {
      let body = { imageUrl: imageStorageUrl, text: text, pageId: pageId };
      await addPagePostApi(body);
      fetchlistPost();
    } catch (error) {
      return error;
    }
    handleCloseModals();
  };
  const uploadToFirebaseStorage = async () => {
    const file = image;
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `PostImage/${file.name}`);
      try {
        const uploaded = await uploadBytes(storageRef, image, {
          contentType: image.type,
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
  const handleImageChange = (e) => {
    if (
      e.target &&
      e.target.files &&
      e.target.files.length &&
      e.target.files[0].name
    ) {
      const file = e.target.files[0];
      handleImage(file);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImage(file);
  };
  const handleImage = (file) => {
    const reader = new FileReader();
    let fileFormat = file.name.split(".");
    fileFormat = fileFormat[fileFormat.length - 1];
    fileFormat = fileFormat.toUpperCase();
    if (
      ["image/jpeg", "image/png", "image/jpg","image/gif"].includes(file.type) &&
      ["JPG", "PNG", "JPEG","GIF"].includes(fileFormat)
    ) {
      const fileSize = file.size / 1024 / 1024; // in MiB
      if (fileSize > 5) {
        setErrorMessage("Maximum file size allowed is 5 MB");
        setImage(null);
      } else {
        setErrorMessage("");
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImage(file);
          setImageView(reader.result);
        };
      }
    } else {
      setErrorMessage("Please select a PNG, JPG, JPEG,GIF file");
      setImage(null);
    }
    setIsDisabled(text.length > 3000 || (text.trim().length === 0 && !file));
  };
  const handleRoundClick = () => {
    fileInputRef.current.click();
  };
  const [text, setText] = useState(defaultText);

  useEffect(() => {
    if (defaultText) {
      setText(defaultText);
    }
  }, [defaultText]);

  const handleTextChange = (inputValue) => {
    if (inputValue.length <= 3000) {
      setText(inputValue);
      setError(inputValue.trim() ? "" : "Field cannot be empty");
    } else {
      setError("The text character limit is 3000");
    }

    // Remove the error message when the text is below 3000 characters
    if (inputValue.length <= 3000) {
      setError("");
    }

    setIsDisabled(
      inputValue.length > 3000 || (inputValue.trim().length === 0 && !image)
    );
  };
  const handleDeleteImage = () => {
    fileInputRef.current.value = "";
    setImageView(null);
    setImage(null);
    setOldImage(null);
  };
  // const isDisabled = loading? true: text.length > 3000? true: image? false: text.length < 1;
  // const spaceError = text? text.trim()? "": "White spaces not allowed": "";
  return (
    <div>
      <Modal open={openModals} onClose={handleCloseModals} center>
        <div className={classes.createPostModal}>
          <Box
            style={{ height: "auto" }}
            sx={{
              bgcolor: "background.paper",
              borderRadius: "10px",
              boxShadow: 24,
              paddingLeft: "30px",
              width: { sm: 400, md: 400, lg: 400, xl: 400 },
              minWidth: "700px",
              maxWidth: "500px",
              marginTop: "9px !important",
              p: 4,
            }}
          >
            <div className={classes.createPostHeadingContaianer}>
              <div className={classes.title}>
                {" "}
                {edit ? "Edit Post" : "Create Post"}
              </div>
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
            <div className={classes.line} />
            <div className={classes.user}>
              <img
                src={
                  (userDetails?.user?.photo && userDetails?.user?.photo) ||
                  "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"
                }
                className={classes.avatar}
                alt=""
              />{" "}
              {userDetails.userName}{" "}
            </div>
            <div style={{ overflow: "auto", maxHeight: 430 }}>
              <div
                className={classes.textArea}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <form action="/action_page.php" className={classes.formHere}>
                  <InputEmoji
                    value={text}
                    onChange={handleTextChange}
                    cleanOnEnter
                    placeholder="Type a message"
                  />
                  {error && <div style={{ color: "red" }}>{error}</div>}
                </form>
              </div>
              <div className={classes.uploaderContainer}>
                {(imageView || oldImage) && (
                  <div className={classes.cancelButton}>
                    <Clear
                      onClick={handleDeleteImage}
                      className={classes.cancelHover}
                    />
                  </div>
                )}
                <div
                  className={classes.createPostImageContainer}
                  onClick={handleRoundClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={dragOver ? { border: "2px dashed gray" } : {}}
                >
                  {image ? (
                    <div style={{ width: "100%" }}>
                      <img
                        className={classes.creatPostUploadImagePreview}
                        src={imageView}
                        alt=""
                      />
                    </div>
                  ) : oldImage ? (
                    <div style={{ width: "100%" }}>
                      <img
                        className={classes.creatPostUploadImagePreview}
                        src={defaultImage}
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className={classes.photoDiv}>
                      <div className={classes.PhotoIcon}>
                        <Photo className={classes.PhotoIconHere} />
                      </div>
                      <div className={classes.photoName}>
                        <span>Upload Photo</span>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>
            </div>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            <div className={classes.bottomSection}>
              <div>
                <div className={classes.listLine} />
                <div className={classes.PostButton}>
                  <button
                    className={classes.PostButtonInner}
                    onClick={handleAddPost}
                    disabled={isDisabled}
                    style={{ backgroundColor: isDisabled ? "gray" : "#0a66c2" }}
                  >
                    {loading ? "Posting..." : "Post"}{" "}
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
};
export default CreatePost;
