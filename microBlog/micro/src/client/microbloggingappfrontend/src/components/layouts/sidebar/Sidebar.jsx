import React from "react";
import classes from "./sidebar.module.css";
import ArticleIcon from "@mui/icons-material/Article";
import { People, Home, ChevronRight, Telegram } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { GetCurrentPathName } from "../../../utils/helper";
import { useDispatch } from "react-redux";
import { clearSearchValue } from "../../../actions/searchSlice";
const menuItems = [
  {
    label: "Feeds",
    path: "/feeds",
    pathName: "feeds",

    icon: Home,
  },
  {
    label: "Friends",
    path: "/friends",
    pathName: "friends",
    icon: People,
  },
  {
    label: "Messages",
    path: "/messages",
    pathName: "messages",
    icon: Telegram,
  },
  {
    label: "Pages",
    path: "/pages",
    pathName: "pages",
    icon: ArticleIcon,
  },
];
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectTab = (tab) => {
    navigate(tab.path);
  };
  let activeTab = GetCurrentPathName(location);
  return (
    <div className={classes.sidebar}>
      <div className={classes.sidebarWrapper}>
        <div className={classes.sidebarMenu}>
          <ul className={classes.sidebarList}>
            {menuItems.map((item) => {
              return (
                <li
                  onClick={() => {
                    selectTab(item);
                    dispatch(clearSearchValue());
                  }}
                  key={item.label}
                  className={[classes.sidebarListItem]}
                >
                  <p
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      color: item.pathName === activeTab ? "#00bb7d" : null,
                    }}
                  >
                    <item.icon
                      className={[
                        classes.sidebarIcon,
                        item.pathName === activeTab ? classes.activeIcon : null,
                      ]}
                    />
                    {item.label}
                  </p>
                  {item.pathName === activeTab && (
                    <ChevronRight style={{ color: "#00bb7d" }} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
