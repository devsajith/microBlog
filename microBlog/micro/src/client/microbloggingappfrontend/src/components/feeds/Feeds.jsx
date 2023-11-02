import React, { useCallback, useEffect, useState } from "react";
import "./feeds.css";
import CreatePost from "../../components/modal/createPost/CreatePost";
import PostList from "../../components/posts/postList/PostList";
import ChatBar from "../../components/chat/chatBar/ChatBar";
import { Card, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { listPost } from "../../Service/PostService";
import downarrow from "../../assets/image/down-arrow.png";
import { styled, alpha } from "@mui/material/styles";
import HexaLoader from "../../components/hexaloader/Hexaloader";

const Feeds = () => {
 
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [showLoader, setShowLoader] = useState(true);

  const [openModals, setOpenModals] = useState(false);
  const [sort, setSort] = useState();
  
 

  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 4,
      marginTop: theme.spacing(0),
      minWidth: 180,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  const userDetails = useSelector((state) => state.user.userDetails);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [state, setState] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    message: "",
  });

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const handleClick = (message) => {
    if (open === true) {
      setState({ ...state, open: false });
    } else {
      setState({ ...state, open: true });
    }
    setState({ ...state, message, open: true });
  };
  const handleCloseHoverModal = () => {
    setAnchorEl(null);
  };
  const handleClickHoverModal = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleCloseModals() {
    setOpenModals(false);
  }
  function handleOpen() {
    setOpenModals(true);
  }
  const [posts, setPosts] = useState([]);
  const [skipId, setSkipId] = useState("");
  const [pagenateLoading, setPaginateLoading] = useState(false);

  const fetchlistPost = useCallback(
    (skipId) => {
      let pageNumber = skipId;
      let limit = 10;

      listPost(pageNumber, limit, sort)
        .then((data) => {
          setPaginateLoading(false);

          if (data?.data?.message === "no data found") {
            setPosts([]);
          }

          if (data.data.result.length > 0) {
            if (data.data.result.length > 9) {
              setSkipId(data.data.skip);
            }
            if (pageNumber) {
              const tempReponseArray = data.data.result;
              const filteredArray = tempReponseArray?.filter((tempImageUrl) => {
                let { imageUrl } = tempImageUrl || {};
                const allowedExtensions = [".png", ".jpeg", ".jpg",".gif"];
                if (
                  imageUrl &&
                  !allowedExtensions.some((ext) =>
                    imageUrl.toLowerCase().includes(ext)
                  )
                ) {
                  tempImageUrl.imageUrl = null;
                }

                return tempImageUrl;
              });
              setPosts([...posts, ...filteredArray]);
            } else {
              const tempReponseArray = data.data.result;
              const filteredArray = tempReponseArray?.filter((tempImageUrl) => {
                const { imageUrl } = tempImageUrl || {};
                const allowedExtensions = [".png", ".jpeg", ".jpg", ".gif"];

                if (
                  imageUrl &&
                  !allowedExtensions.some((ext) =>
                    imageUrl.toLowerCase().includes(ext)
                  )
                ) {
                  tempImageUrl.imageUrl = null;
                }

                return tempImageUrl;
              });

              setPosts(filteredArray);
              setTimeout(() => {
                setShowLoader(false);
              }, 1500);
            }
          } else {
            setPosts([]);
          }
        })
        .catch((error) => {
          setPaginateLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [skipId, sort]
  );

  // Close the dropdown if the user clicks outside of it
  window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  };
  const handleFilter = (filterValue) => {
    setAnchorEl(null);
    setSkipId(null);
    setSort(filterValue);
  };
  useEffect(() => {
    fetchlistPost("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);
  return (
    <div>
      <div id="userdashboard">
        <div className="feedsContainer">
        {posts?.length !== 0 && showLoader && <HexaLoader />}
          <div style={{ display: "flex" }}>
            <div
              style={{
                flex: 2,
                marginTop: "-3.6rem",
                padding: "0px 16px 0px 16px",
              }}
            ><div className="qwerty">
              <Card className="StartPost"  style={{}}>
                <img
                  src={
                    (userDetails?.user?.photo && userDetails?.user?.photo) || "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"
                  }
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
                    feedsPage={true}
                    handleCloseModals={handleCloseModals}
                    openModals={openModals}
                    showSuccessSnackBar={handleClick}
                    fetchlistPost={fetchlistPost}
                  />
                )}
              </Card></div><br/><br/><br/><br/><br/><br/><br/>
<div className="qwertyy">
              <div className="sortBy" style={{}}>
                <hr />
                <p onClick={handleClickHoverModal} className="dropbtn">
                  Sort by:{" "}
                  <span>
                    {(sort && sort?.charAt(0).toUpperCase() + sort?.slice(1)) ||
                      "Recommendations"}
                    <img src={downarrow} alt="" />
                  </span>
                </p>
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseHoverModal}
                >
                  <MenuItem
                    onClick={() => handleFilter("recommendations", Event)}
                  >
                    <Typography
                      sx={{ p: 1, cursor: "pointer", fontSize: "medium" }}
                    >
                      Recommendations
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleFilter("friends")}>
                    <Typography
                      sx={{ p: 1, cursor: "pointer", fontSize: "medium" }}
                    >
                      Friends
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleFilter("global")}>
                    <Typography
                      sx={{ p: 1, cursor: "pointer", fontSize: "medium" }}
                    >
                      Global
                    </Typography>
                  </MenuItem>
                </StyledMenu>
                </div>  </div><br/><br/><br/>
              <div className="PostLists" style={{}}>
  {posts?.length > 0 ? (
    <PostList
      fetchlistPost={fetchlistPost}
      showSuccessSnackBar={handleClick}
      posts={posts}
      pagenateLoading={pagenateLoading}
      setPaginateLoading={setPaginateLoading}
      skipId={skipId}
    />
  ) : (
    <div
      style={{
        color: "black",
        fontSize: "25px",
        textAlign: "center",
        fontFamily: "sans-serif",
        fontWeight: "bolder",
      }}
    >
No Posts Available
    </div>
  )}
</div>

            </div>
            <ChatBar style={{ marginTop: "-1.1rem" }} />
            <Snackbar
              anchorOrigin={{
                vertical: state.vertical,
                horizontal: state.horizontal,
              }}
              open={state.open}
              autoHideDuration={2000}
              onClose={handleClose}
            >
              <Alert severity="success">
                <Typography>{state.message}</Typography>
              </Alert>
            </Snackbar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feeds;
