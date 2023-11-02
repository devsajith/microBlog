import React, { useState, useEffect } from "react";
import PeoplesCard from "../../components/cards/peopleCard/PeoplesCard";
import { useLocation } from "react-router-dom";
import PageCard from '../../components/cards/pageCard/pageCard'
import { Button } from "@mui/material";
import ChatBar from "../../components/chat/chatBar/ChatBar";

const SearchResult = () => {
  const location = useLocation();
  const searchValue = location?.state?.searchValue;
  const searchText = location?.state?.searchText;
  const skipId = location?.state?.skipId;
  const [filter, setFilter] = useState("user");
  const [hasResults, setHasResults] = useState(true);

  useEffect(() => {
    if (searchText && searchValue === undefined) {
      setHasResults(false);
    } else {
      setHasResults(true);
    }
  }, [searchText, searchValue]);

  return (
    
    <div style={{  display: "flex" }}>
      <div style={{ flex: 2 ,width:'1px',marginTop:'2rem'}}>
        {!hasResults ? (
          <div
            style={{
              height: "100vh",
              backgroundColor: "white",
              overflow: "hidden",
            }}
          >
            <h2>Sorry, no results found </h2>
          </div>
        ) : (
          <>
            <Button
              onClick={() => setFilter("user")}
              variant={filter === "user" ? "contained" : "outlined"}
            >
              Filter: Peoples
            </Button>
            <Button
              onClick={() => setFilter("page")}
              variant={filter === "page" ? "contained" : "outlined"}
            >
              Filter: Page
            </Button>
        
            {filter === "user" ? (
              <PeoplesCard
                searchValue={searchValue}
                skipId={skipId}
                searchText={searchText}
              />
            ) : (
              <PageCard
                searchValue={searchValue}
                skipId={skipId}
                searchText={searchText}
              />
            )}
          </>
        )}
      </div>
      <div style={{ marginTop:'-2.7rem',width:'31.3rem'}}>
        <ChatBar />
      </div>
    </div>
  );
};

export default SearchResult;
