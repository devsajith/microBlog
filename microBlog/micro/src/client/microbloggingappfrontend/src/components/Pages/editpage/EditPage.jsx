/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import classes from "./editPage.module.css";
import { Modal, Box, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Photo, Delete } from "@mui/icons-material";
import { uploadBytes, getStorage, ref, getDownloadURL } from "firebase/storage";
import { editPage, deletePage } from "../../../Service/pages";
import PropTypes from "prop-types";
import Edit from "@mui/icons-material/Edit";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const style = {position: "absolute",
  top: "50%",left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,bgcolor: "background.paper",
  border: "none !important", boxShadow: 24,
  p: 4, borderRadius: "10px",
  maxHeight: "100%",
};

const EditPage = ({ handleRefresh, pageid, pageUser, pageDetails }) => {
  const profileInput = useRef();
  const coverInput = useRef();
  const [open, setOpen] = React.useState(false);
  const [profileError, setProfileError] = useState("");
  const [coverError, setCoverError] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loading, setIsLoading] = useState(false);
  // const [pageDetails, setPageDetails] = useState()
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  let decodedToken = jwt_decode(accessToken);
  const currentUserId = decodedToken.id;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleDelete = () => {
    setOpen(false);
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      dangerMode: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        deletePage(pageid);
        navigate("/pages");
      }
      result.isConfirmed &&
        Swal.fire({
          icon: "success",
          title: "delete!",
          timer: 1000,
          showConfirmButton: false,
        });
    });
  };
  const handleClose = () => {
    setOpen(false);
    setCoverError("");
    setProfileError("");
    setCoverPhoto(null);
    setProfilePhoto(null);
    reset();
  };
  const submit = async (data) => {
    setIsLoading(true);

    let profilePhotoUrl = await profilePhotoUpload();
    let coverPhotoUrl = await coverPhotoUpload();
    let finalData = {
      ...data,
      profilePhotoUrl: profilePhotoUrl,
      coverPhotoUrl: coverPhotoUrl,
    };
    editPage(finalData, pageid)
      .then((res) => {
        handleClose();
        handleRefresh();
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
    window.location.reload();
  };
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
  const vaildateCoverPhoto = (file) => {
    let fileFormat = file.name.split(".");
    fileFormat = fileFormat[fileFormat.length - 1];
    fileFormat = fileFormat.toUpperCase();
    if (
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type) &&
      ["JPG", "PNG", "JPEG"].includes(fileFormat)
    ) {
      const fileSize = file.size / 1024 / 1024; // in MiB
      if (fileSize > 5) {
        setCoverError("Maximum file size allowed is 5 MB");
        return null;
      } else {
        setCoverError("");
        return file;
      }
    } else {
      setCoverError("Please select a PNG, JPG, or JPEG file");
      return null;
    }
  };
  const profilePhotoUpload = async () => {
    if (profilePhoto) {
      const storage = getStorage();
      const storageRef = ref(storage, `Profilephoto/${profilePhoto.name}`);
      setIsLoading(true);

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
        setIsLoading(false);
        return false;
      }
    }
    return false;
  };
  const coverPhotoUpload = async () => {
    if (coverPhoto) {
      const storage = getStorage();
      const storageRef = ref(storage, `Coverphoto/${coverPhoto.name}`);
      try {
        const uploaded = await uploadBytes(storageRef, coverPhoto, {
          contentType: coverPhoto.type,
        });
        if (uploaded) {
          return getDownloadURL(storageRef);
        } else {
          return false;
        }
      } catch (error) {
        setIsLoading(false);
        return false;
      }
    }
    return false;
  };
  const handleProfilePhoto = (e) => {
    let file = e?.target?.files[0];

    setProfilePhoto(vaildateProfilephoto(file));
  };
  const handleCoverPhoto = (e) => {
    let file = e?.target?.files[0];

    setCoverPhoto(vaildateCoverPhoto(file));
  };
  const isDisabled = loading ? true : false;

  return (
    <div>
      {currentUserId === pageUser && (<Edit className={classes["edit-icon"]} onClick={handleOpen} /> )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className={classes.closeWrap}>
            <CloseIcon onClick={handleClose} className={classes.closeIcon} />
          </div>
          <h3 className={classes.title}>Edit Page </h3>
          <div className={classes.modalbody}>
            <div className={classes.fields}>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Title *"
                  multiline
                  defaultValue={pageDetails?.page_name}
                  {...register("pageName", {
                    required: "Title is required",
                    maxLength: {
                      value: 50,
                      message: "Maximum length is 50 characters",
                    },
                  })}
                />
                {errors.pageName && <small>{errors?.pageName.message}</small>}
              </div>
              <div>
                <TextField
                  id="outlined-multiline-static"
                  label="About *"
                  defaultValue={pageDetails?.about}
                  multiline
                  {...register("description", {
                    required: "About is required",
                    maxLength: {
                      value: 500,
                      message: "Maximum length is 500 characters",
                    },
                  })}
                />
                {errors.description && (
                  <small>{errors?.description.message}</small>
                )}
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
                      <span>Upload Profile Photo</span>
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
              {coverPhoto ? (
                <img
                  onClick={() => {
                    coverInput.current.click();
                  }}
                  style={{ height: "200px", width: "300px" }}
                  src={URL.createObjectURL(coverPhoto)}
                  alt=""
                />
              ) : (
                <>
                  <div
                    className={classes.photoDiv}
                    onClick={() => {
                      coverInput.current.click();
                    }}
                  >
                    <div className={classes.PhotoIcon}>
                      <Photo className={classes.PhotoIconHere} />
                    </div>
                    <div className={classes.photoName}>
                      <span>Upload Cover Photo</span>
                    </div>
                  </div>
                  <span style={{ color: "red", fontSize: "13px" }}>
                    {coverError}
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                ref={coverInput}
                style={{ display: "none" }}
                onChange={handleCoverPhoto}
              />
              <div className={classes["button-danger"]}>
                <button onClick={handleDelete}><Delete />Delete page</button>
              </div>
            </div>
          </div>
          <div className={classes.bottomSection}>
            <div className={classes.listLine} />
            <button
              className={classes.PostButtonInner}
              disabled={isDisabled || loading}
              onClick={handleSubmit(submit)}
              style={{ backgroundColor: isDisabled ? "gray" : "#0a66c2" }}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
EditPage.propTypes = {
  handleRefresh: PropTypes.func.isRequired,
};

export default EditPage;