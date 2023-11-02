import "./pages.css";
import PagesCreate from "../pagesCreate/PagesCreate";
import FollowedPage from "../followedPage/FollowedPage";
import React, { useState } from "react";
import CreatePage from "../../createpage/CreatePage";

const Pages = () => {
  const [activeTab, setActiveTab] = useState("createpage");
  const [callRefresh, setCallRefresh] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleRefresh = () => {
    if (activeTab === "createpage") {
      setCallRefresh(true);
    }
  };

  return (
    <div>
      <div>
        <br />
        <br />
        <br />

        <div>
          <CreatePage handleRefresh={handleRefresh} />
        </div>
        <div className="aa" style={{ display: "flex" }}>
          <div>
            <span
              className={`menu-item ${
                activeTab === "createpage" ? "active" : ""
              }`}
              onClick={() => handleTabClick("createpage")}
            >
              Pages Created
            </span>
          </div>
          <div>
            <span
              className={`menu-item ${
                activeTab === "followedpage" ? "active" : ""
              }`}
              onClick={() => handleTabClick("followedpage")}
            >
              Followed Page
            </span>
          </div>
        </div>
      </div>

      <div className="friendlist">
        {activeTab === "createpage" && (
          <div style={{ marginLeft: "4%", marginTop: "-4%", maxWidth: "90%" }}>
            <PagesCreate callRefresh={callRefresh} />
          </div>
        )}
        {activeTab === "followedpage" && (
          <div style={{ width: "90%", marginLeft: "4%", marginTop: "-4%" }}>
            <FollowedPage />
          </div>
        )}
      </div>
    </div>
  );
};
export default Pages;
