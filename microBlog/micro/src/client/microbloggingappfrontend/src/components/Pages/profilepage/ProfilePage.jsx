import React, { useEffect, useState } from "react";
import classes from "./profilePage.module.css";
import { Avatar, Button } from "@mui/material";
import ProfileTabs from "../../profiletabs/ProfileTabs";
import { useLocation } from "react-router-dom";
import { detailedView, followPage, unFollowPage } from "../../../Service/pages";
import defaultCover from "../../../assets/image/bg1.jpg";
import EditPage from "../editpage/EditPage"
import jwt_decode from "jwt-decode";

const ProfilePage = () => {
  const [pageDetails, setPageDetails] = useState();
  const [followStatus, setFollowStatus] = useState(null)
  const location = useLocation().state.id;
  const [pageid, setPageid] = useState("")
  const [pageUser, setPageuser] = useState("")
  const accessToken = localStorage.getItem("accessToken");
  let decodedToken = jwt_decode(accessToken);
  const currentUserId = decodedToken.id;



  const getDetailedView = (id) => {
    detailedView(id).then((res) => {
      setPageDetails(res.data.result.result);
      setFollowStatus(res.data.result.follow)
      setPageid(id)
      setPageuser(res?.data?.result?.result?.creator)    
    });
  };

  useEffect(() => {
    getDetailedView(location);
  }, []);

  const follow = (id)=>{
    followPage(id).then((response) => {
      detailedView(id).then((res) => {
        setPageDetails(res.data.result.result);
        setFollowStatus(res.data.result.follow)
      });

  })
}
const unfollow = (id)=>{
  unFollowPage(id).then((response) => {
    detailedView(id).then((res) => {
      setPageDetails(res.data.result.result);
      setFollowStatus(res.data.result.follow)
    });

})
}



  return (
    <>
      <div className={classes.pageContainer}>
        <div>
          {pageDetails?.cover_photo==="false" ? (
            <img className={classes.imagewrap} src={defaultCover} alt="" />
            ) : (
            <img
              className={classes.imagewrap}
              src={pageDetails?.cover_photo}
              alt=""
            />
          )}

          <div className={classes.avatar}>
            <div className={classes.imgwrap}>
              <Avatar
                alt=""
                sx={{ height: "200px", width: "200px" }}
                src={pageDetails?.profile_photo}
              />
            </div>
          </div>
          <div className={classes.userData}>
            <h3>{pageDetails?.page_name}</h3>
           
          {followStatus === 2 &&currentUserId !== pageUser && (<Button
                    className={classes.addButton}
                    variant="outlined"
                    onClick={() => follow(location)}
                  >
                  Follow{" "}
                  </Button>)}
                  {followStatus === 1 &&(<Button
                    className={classes.addButton}
                    variant="outlined"
                    onClick={() => unfollow(location)}
                  >
                  UnFollow{" "}
                  </Button>)}
              
            
            <span>
              <EditPage pageid={pageid} pageUser={pageUser} pageDetails={pageDetails}/>
            </span>
          </div>
        </div>
        <div className={classes.followButton}>
        
                    </div>
        <div>
        
          <ProfileTabs about={pageDetails?.about} />
          
        </div>
        

      </div>
    </>
  );
};
export default ProfilePage;
