import * as React from 'react';
import { Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useState, useEffect, useCallback } from 'react';
import './profile.css';
import { People } from "@mui/icons-material";
import EditProfile from './Editprofile/Editprofile'
import {useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import PostList from "../../components/posts/postList/PostList";
import { PostOfCurrentUser } from "../../Service/PostService";
import { friendlist } from '../../Service/friendsService';
import { userVieww } from '../../Service/userService'
import jwt_decode from "jwt-decode";
import bg from '../../assets/image/bg1.jpg'
import HexaLoader from '../hexaloader/Hexaloader';
// import img1 from '../../assets/image/outlineavatar.png';
import { IconButton } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
export default function Profile() {
  const navigate = useNavigate()
  const userDetails = useSelector((state) => state.user.userDetails);
  const [pagenateLoading, setPaginateLoading] = useState(false);
  const [skipId, setSkipId] = useState("");
  const [u_id, setId] = useState('')
  const [showLoader, setShowLoader] = useState(true);
  const [open] = React.useState(false);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('Posts');
  const [fcount, setFcount] = useState('')
  const [name, setUserName] = useState('')
  const [about, setAbout] = useState('')
  const [isScrolled, setIsScrolled] = useState(false);

  const flist = (searchTextValue, pageNumber) => {
    friendlist(searchTextValue, pageNumber).then((data) => {
      count = data.data.count
      setFcount(count)
    })
  }
  const handleScroll = () => {
    const scrollTop = window.scrollY;
  
    if (scrollTop > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  
    document.documentElement.style.setProperty('--scroll-offset', `${scrollTop}px`);
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
    
  const fetchlistPost = useCallback((skipId) => {
    let pageNumber = skipId;
    PostOfCurrentUser(u_id)
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
            setPosts([...posts, ...filteredArray].reverse()); // Reverse the array before setting it
          } else {
            const tempReponseArray = data.data.result;
            const filteredArray = tempReponseArray?.filter((tempImageUrl) => {
              const { imageUrl } = tempImageUrl || {};
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
  
            setPosts(filteredArray.reverse()); // Reverse the array before setting it
            // setTimeout(() => {
            //   setShowLoader(false);
            // }, 1500);
          }
        } else {
          setPosts([]);
        }
      })
      .catch((error) => {
        setPaginateLoading(false);
      });
  }, [skipId, u_id]);
  
  //   const handleBioHover = () => {
  //     return true
  //   };
  
  //   const maxBioLength = 100;
  // const truncatedAbout = about.length > maxBioLength ? `${about.slice(0, maxBioLength)}...` : about;
  
  const fetchUserDetials = async (id) => {
    try {
      const response = await userVieww(id)
      setUserName(response.data.result.user.userName)
      setAbout(response.data.result.user.about)
      setShowLoader(false);

    } catch (error) {
return(error)
    }
  }
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  let count = localStorage.getItem('countFriends')
  const Navtofriends = () => {
    navigate('/friends')
  }
  const handleCloseSnackBar = () => {
    setState({ ...state, open: false });
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [state, setState] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    message: "",
  });

  const handleClick = (message) => {
    if (open === true) {
      setState({ ...state, open: false });
    } else {
      setState({ ...state, open: true });
    }
    setState({ ...state, message, open: true });
  };

  useEffect(() => {
    flist();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const decodedToken = jwt_decode(accessToken);
      const decryptedId = decodedToken.id;
      setId(decryptedId)
      fetchUserDetials(decryptedId);
    }
  }, [fetchUserDetials(u_id)]);

  useEffect(() => {
    if (u_id)

      fetchlistPost();
  }, [u_id]);
  const coverPhotoUrl = userDetails?.user?.cover_photo || bg;
  return (
    <div>
      <div className="user-profile">
      {showLoader && <HexaLoader />}
      <div className="cover-photoo1" style={{
  width: "100%",
  height: "200px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}}>
  {coverPhotoUrl && (
    <img
      src={coverPhotoUrl}
      alt="Cover Photo"
      style={{
        objectFit: "cover",
        width: "100%",
        height: "100%",
      }}
    />
  )}


          {/* Cover photo content */}
        </div>
        <div className="profile-info">
          <img
            className="profile-picture"
            src={userDetails?.user?.photo || "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"
            } alt="Profile"
            style={{backgroundColor:'white'}}
          />
          <div>
          </div>
          <h1 className="name">    {name}   </h1>
          {/* <div>
      <Tooltip title={about.length > 100 ? about : ''} placement="bottom">
        <Typography
          className="bio"
          variant="body1"
          component="p"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '700px',
            cursor: 'pointer',
          }}
          onMouseEnter={handleBioHover}
        >
          {truncatedAbout}
        </Typography>
      </Tooltip>
    </div> */}
          <p className="bio" style={{padding:'2rem'}}>{about}</p>
          <>
            {fcount && fcount !== '0' ? (
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' ,marginTop:'-4%' }} onClick={Navtofriends}>
                <div style={{ marginRight: '5px' }}>{fcount}</div>
                <People />
              </div>
            ) : (

              <div className="no-friends-animation">No Friends available!</div>
            )}
          </>

          <br />
          <br />

          <div className="menu" style={{ cursor: 'pointer',marginBottom:'11%'}}>
            <span
              className={`menu-item ${activeTab === 'Posts' ? 'active' : ''}`}
              onClick={() => handleTabClick('Posts')}
            >
              Posts
            </span>
            <span
              className={`menu-item ${activeTab === 'Details' ? 'active' : ''}`}
              onClick={() => handleTabClick('Details')}
            >
              Details
            </span>
          </div>
     <br/>
        </div>
      </div>
      <div>
    {/* Rest of your component code */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'fixed', top: '', right: '2px' }}>
    <IconButton
        className={`scroll-to-top ${isScrolled ? 'show' : ''}`}
        onClick={scrollToTop}
        color="primary"
        aria-label="Scroll to top"
      >
        <ArrowCircleUpIcon />
      </IconButton>
</div>
  </div>
        <div>
    {/* Rest of your component code */}


  </div>
      <div className="friendlist">
        {activeTab === 'Posts' && (
          <div style={{ marginLeft: '6%', marginTop: '-2%', maxWidth: '85%', border: '1px solid #efefef', padding: '10px',borderRadius:'10px',backgroundColor:'#f3f3f3' }}>
            <div >
              {posts?.length > 0 ? (
                <PostList
                  fetchlistPost={fetchlistPost}
                  posts={posts}
                  showSuccessSnackBar={handleClick}
                  pagenateLoading={pagenateLoading}
                  setPaginateLoading={setPaginateLoading}
                  skipId={skipId}
                />)
                : (
                  <div
                    style={{
                      color: "grey",
                      fontSize: "25px",
                      textAlign: "center",

                    }} className="no-friends-animation"
                  >
                  
                    No Posts Available!
                  </div>
                )}
            </div>
          </div>
        )}
        {activeTab === 'Details' && (
          <div style={{ width: '90%', marginLeft: '4%', marginTop: '-4%' }}>
            <EditProfile />
          </div>
        )}
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: state.vertical,
          horizontal: state.horizontal,
        }}
        open={state.open}
        autoHideDuration={1000}
        onClose={handleCloseSnackBar}
      >
        <Alert severity="success">
          <Typography>{state.message}</Typography>
        </Alert>
      </Snackbar>
    </div>
  );
}
