import React from "react";
import style from "./adminSidebar.module.scss";
import { Link } from "react-router-dom";
import { FaFontAwesomeFlag } from "react-icons/fa";
const MENUS = [
  {
    title: "Lists",
    id: "1",
    links: [
      {
        title: "Report List",
        link: "/dashboard",
        icon: <FaFontAwesomeFlag />,
      },
    ],
  },
];
const AdminSidebar = () => {
//   const location = useLocation();
  return (
    <div className={style["sidebar"]}>
      <div className={style["sidebarWrapper"]}>
        {MENUS.map((menu) => {
          return (
            <div className={style["sidebarMenu"]} key={menu.id}>
              <h3 className={style["sidebarTitle"]}>{menu.title}</h3>
              <ul className={style["sidebarList"]}>
                {menu.links.map((item) => {
                  return (
                    <Link
                      key={item.title}
                      to={item.link}
                      className={style["link"]}
                    >
                      <li className={style["sidebarListItem"]} >
                        {/* className={`sidebarListItem ${
                          location.pathname == item.link ? "active" : ""
                        }`} */}

                        <span className={style["item-icon"]}>{item.icon}</span>
                        {item.title}
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSidebar;
