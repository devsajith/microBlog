/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Avatar, Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {  globalSearch } from "../../../Service/friendsService";
import "../friendsCard/friendscard.css";
import { useNavigate } from "react-router-dom";


function PeoplesCard(props) {
  const navigate = useNavigate();
  const [pagenateLoading, setPaginateLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [skip, setSkip] = useState('');
  const [count, setCount] = useState("");
  const searchText = props?.searchText;
  const lessCount = count < 99;
  const graterCount = count > 99;
  const recent = [searchText];

 
  useEffect(() => {
    let history = [];
    history = JSON.parse(localStorage.getItem("recent"));
    if (history?.length) {
      if (searchText) {
        if (!history.includes(searchText)) history.push(searchText);
        localStorage.setItem("recent", JSON.stringify(history));
      }
    } else {
      localStorage.setItem("recent", JSON.stringify(recent));
    }
  }, []);

  useEffect(() => {
    setSkip(props?.skipId);
    searchUser(searchText);
    reSearch(searchText);
  }, [props]);
  const about = (data) => {
    const about = data?.about;
    if (about) {
      return about?.length > 20 ? about?.slice(0, 190) : about;
    }
  };
  const searchUser = (searchText, skip) => {
    const filter = "page";
    const limit = 10;
    globalSearch(searchText, skip, filter, limit).then((response) => {
      setPaginateLoading(false);
      if (response && response.data && response.data.pages) {
        setSearchResult([...searchResult, ...response.data.pages]);
        setSkip(response?.data?.skip);
        setCount(response?.data?.count);
      }
    });
  };
  
  const reSearch = (searchText, skip) => {
    const filter = "page"; 
    globalSearch(searchText, skip,filter).then((response) => {
      setPaginateLoading(false);
      if (response && response.data && response.data.users) {
        setSearchResult(response.data.users);
  
        setCount(response?.data?.count);
      }
    });
  };
  const listInnerRef = useRef();
  const lastFriendElementRef = useCallback(
    (node) => {
      if (listInnerRef.current) listInnerRef.current.disconnect();
      listInnerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!pagenateLoading && skip) {
            setPaginateLoading(true);
            searchUser(searchText, skip);
          }
        }
      });
      if (node) listInnerRef.current.observe(node);
    },
    [skip, searchText]
  );
 
const pageprofile=(pageID)=>{
  navigate(`/pages/${pageID}`, {
    
    state: { id: pageID},
  });
 
}
  return (
    <Card
      style={{
        borderRadius: "10px",
        marginTop: "83px",
        height: "fit-content",
        marginLeft: "15px",
        marginRight: "15px",
        marginBottom: "15px",
        fontFamily: "sans-serif",
      }}
    >
      <CardContent style={{ paddingBottom: "7px", fontWeight: "bold" }}>
        <div style={{ display: "flex", paddingBottom: 16, paddingTop: 16 }}>
          <Typography sx={{ flex: 1 }} variant="h5" component="h2">
            <div className="Friends">
              Pages
              <sup>
                <div className="supDiv">
                  <div className="countDiv">
                    {lessCount && count}
                    {graterCount && "99+"}
                  </div>
                </div>
              </sup>
            </div>
          </Typography>
        </div>
        <div
          style={{ height: ".6px", backgroundColor: "#ebebeb", width: "100%" }}
        />

        {searchResult?.map((data, index) => {
          const PeopleCard = (
            <>
          
              <Box
                key={data._id}
                sx={{
                  display: "flex",
                  padding: "5px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "50px",
                }}
              >
                <Box   onClick={()=>pageprofile(data._id)} style={{cursor:'pointer'}}
                  className="Name"
                  sx={{ display: "flex", alignItems: "center", width: "70%" }}
                >
                  {data && data?.photo ? (
                    <img className="profile" alt="" src={data?.photo} />
                  ) : (
                    <Avatar alt="Remy Sharp" />
                  )}
                 
      
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        float: "left",
                        paddingLeft: "5px",
                        textIndent: "3px",
                      }}
                    >
                      {data?.page_name}
                    </div>
                    <div className="about"> {about(data)}</div>
                  </div>
                </Box>
              </Box>
              <div
                style={{
                  height: ".6px",
                  backgroundColor: "#ebebeb",
                  width: "100%",
                }}
              />
            </>
          );
          if (index + 1 === searchResult.length) {
            return (
              <Box key={data._id} ref={lastFriendElementRef}>
                {PeopleCard}
              </Box>
            );
          }
          return PeopleCard;
        })}
      </CardContent>
    </Card>
  );
}
export default PeoplesCard;
