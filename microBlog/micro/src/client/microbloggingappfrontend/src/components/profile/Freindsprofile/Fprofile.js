import Button from '@mui/material/Button';
import * as React from 'react';
import './Fprofile.css';
import { useState, useCallback, useEffect } from "react";
import { PostOfCurrentUser } from "../../../Service/PostService";
import PostList from "../../../components/posts/postList/PostList";
import SettingsIcon from '@mui/icons-material/Settings';
import { userVieww } from '../../../Service/userService'
import { Menu, MenuItem } from "@mui/material";
import { friendRequest } from '../../../Service/friendsService'
import bg from '../../../assets/image/bg1.jpg'
// import Fpro from '../../../assets/image/outlineavatar.png'
import { block, unblock } from '../../../Service/friendsService';
import HexaLoader from '../../hexaloader/Hexaloader';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { IconButton } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
export default function Fprofile() {
  const [pagenateLoading, setPaginateLoading] = useState(false);
  const [skipId, setSkipId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [a, setA] = useState('')
  const [friendName, setFriendName] = useState('')
  const [friendProPicture, setFriendProfilePicture] = useState('')
  const [coverImg, setCoverImage] = useState('')
  const { id } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [fid, setUserid] = useState(id)
  const [showLoader, setShowLoader] = useState(true);
  const [eMail, setFriendEmail] = useState('')
  const [fStatus, friendStatuss] = useState('')
  const [fBstatus, setBlockStatus] = useState('')
  const [fAccess,setFAccess] = useState('')
  const [fabout,setFAbout] = useState('')
  const userDetails = useSelector((state) => state.user.userDetails);
  const userEmail = userDetails?.user?.email;
const [flistCount,setFlistCount] = useState('')
  const fview = (fid) => {
    userVieww(fid).then((Res) => {
      let dTails = Res?.data?.result?.user
      let FriendNamee = dTails?.userName
      let friendStatus = dTails?.friendDetail
      let friedBlockStatus = dTails?.blockDetail
      let fAccess = dTails?.access
      let fAboutt = dTails?.about
      setFAbout(fAboutt)
      setFAccess(fAccess)
      setBlockStatus(friedBlockStatus)
      friendStatuss(friendStatus)
      setFriendName(FriendNamee)
      setFriendEmail(dTails?.email)
      let fProPic = dTails?.photo
      setFriendProfilePicture(fProPic)
      let CImg = dTails.cover_photo
      setCoverImage(CImg)
      setShowLoader(false);

    })
  }
  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
  
    if (scrollTop > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
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

  useEffect(() => {
    setUserid(id);

  }, [id, fBstatus]);
  useEffect(() => {
    Neww((id) => {
      fetchlistPost(id);
      fview(id)

    });
  }, [fid, fStatus, fBstatus]);
  const coverPhotoUrl = coverImg ? coverImg : bg;
  const [posts, setPosts] = useState([]);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setA(1)
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleBlockClick = async (fid) => {
    try {
      await block(fid);
      fview(id)
      setAnchorEl(null);

    } catch (error) {
      return (error)
    }
  }
  const handleUnblockClick = async (fid) => {
    try {

      await unblock(fid);
      fview(id)
    } catch (error) {
      return (error)
    }
  };
  const addFriend = (id) => {
    friendRequest(id).then((response) => {
      if(response.status === 200){
        fview(id)
      }


    });
  };
  // const handleBioHover = () => {
  //   return true
  // };
  // const maxBioLength = 100;
  // const truncatedAbout = userAbout.length > maxBioLength ? `${userAbout.slice(0, maxBioLength)}...` : userAbout;
  const Neww = (callback) => {
    const currentUrl = window.location.href;
    const idStartIndex = currentUrl.lastIndexOf("/fprofile/") + 10; // Add 10 to skip "/fprofile/"
    const id = currentUrl.substring(idStartIndex);
    setUserid(id);
    callback(id);
  };
  const fetchlistPost = useCallback(
    (skipId) => {
      Neww((id) => {
        let pageNumber = skipId;
        PostOfCurrentUser(id)
          .then((data) => {
            setFlistCount(data?.data?.message =="no data found" )
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
                  const allowedExtensions = [".png", ".jpeg", ".jpg"];
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
                setPosts([...posts, ...filteredArray].reverse());
              } else {
                const tempReponseArray = data.data.result;
                const filteredArray = tempReponseArray?.filter((tempImageUrl) => {
                  const { imageUrl } = tempImageUrl || {};
                  const allowedExtensions = [".png", ".jpeg", ".jpg"];

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

                setPosts(filteredArray.reverse());
                setTimeout(() => {
                }, 1500);
              }
            } else {
              setPosts([]);
            }
          })
          .catch((error) => {
            setPaginateLoading(false);
          });
      });
    },
    [setPaginateLoading, setPosts, setSkipId, posts]
  );
  return (
    <div>
      <div className="user-profile">
        {showLoader && <HexaLoader />}
        <div className="cover-photoo1" style={{   width: "100%",  height: "200px",  display: "flex",  justifyContent: "center",
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
        </div>
        <div className="profile-info">
          <img
            className="profile-picture"
            src={friendProPicture ? friendProPicture : "https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"}
            alt="Profile" style={{ backgroundColor: 'white' }}
          />
          <h1 className="name">{friendName}</h1>
          {/* <div>
            <Tooltip title={userAbout.length > 100 ? userAbout : ''} placement="bottom">
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
<p style={{padding:'2rem', wordWrap: 'break-word'}}>{fabout}</p>
<br/>
<br/>
{/* <Tooltip title="Scroll to Top" placement="left"> */}
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
    {/* </Tooltip> */}
          {userEmail === eMail ? (
            <div>
              {/* Render content for when userEmail is equal to eMail */}
            </div>
          ) : (
            <div style={{ display: 'flex',marginTop:'-5%' }}>
              {fBstatus === 0 ? (
                <div className="block-container">
                  <Button onClick={() => handleUnblockClick(fid)}>Unblock</Button>
                </div>
              ) : (
                <React.Fragment>
                  {fStatus === 1 ? (
                    <>
                      <Button className="addButton" variant="outlined" style={{ color: 'green' }} >
                        Friend
                      </Button>
                    </>
                  ) : fStatus === 2 ? (
                    <Button className="addButton" variant="outlined" onClick={() => addFriend(fid)}>
                      Add Friend
                    </Button>
                  ) : fStatus === 0 ? (
                    <Button className="pendingButton" variant="outlined">
                      Pending
                    </Button>
                  ) : null}
                  <div onClick={handleMenuClick} style={{ marginTop: '5%', marginLeft: '8px', cursor: 'pointer' }}>
                    <SettingsIcon />
                  </div>
                </React.Fragment>
              )}
            </div>
          )}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {a === 1 ? (
              <MenuItem onClick={() => handleBlockClick(fid)}>Block</MenuItem>
            ) : (
              <MenuItem onClick={handleUnblockClick}>Unblock</MenuItem>
            )}
          </Menu>
          <br />
          <br />
          <br />
        </div>
      </div>
      <div className="friendlist">
        <div style={{ display: '', marginLeft: '6%', justifyContent: 'center', color: '', fontWeight: 'lighter', fontSize: '500' }}>
          <div>
          </div>
          <br />
          <div style={{ maxWidth: '85%', padding: '10px',borderRadius:'10px',backgroundColor:'#f3f3f3' ,marginLeft:'4%'}}>
            {posts?.length > 0 ? (
              <PostList
                fetchlistPost={fetchlistPost}
                posts={posts}
                pagenateLoading={pagenateLoading}
                setPaginateLoading={setPaginateLoading}
                skipId={skipId}
              />
            ) : (
              <div className="no-friends-animation"
                style={{
                  color: "grey",
                      fontSize: "25px",
                      textAlign: "center",
                }}
              >
              {fStatus === 2 && fAccess === 0 && <p>Account is private</p>}
              {fStatus === 0 && fAccess === 0 && <p>Account is private</p>}
      {flistCount  &&<p>No Posts Available</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
