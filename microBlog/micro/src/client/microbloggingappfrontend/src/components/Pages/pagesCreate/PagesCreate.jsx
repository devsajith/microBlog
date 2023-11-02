import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Divider,
} from "@mui/material";
import classes from "./pagesCreate.module.css";
import { getCreatedPage } from "../../../Service/pages";
import {  NavLink } from "react-router-dom";

const PagesCreate = ({callRefresh}) => {
  const [pageList, setPageList] = useState([]);

  const getCreatedPages = () => {
    getCreatedPage().then((res) => {
      setPageList(res?.data?.result);
    });
  };

  useEffect(() => {
    getCreatedPages();
  }, [callRefresh]);
  return (
    <Card className={classes.createCard}>
      <CardContent style={{ paddingBottom: "7px", fontWeight: "bold" }}>
        <Typography variant="h5" component="h2">
          <div className={classes.heading}>Pages Created</div>
        </Typography>
        <br />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {pageList?.map((page) => {
            return (
              <>
                <Divider variant="middle" />
                <NavLink
                  style={{ color: "black" }}
                  state={{ id: page._id }}
                  to={`/pages/${page._id}`}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      alt=""
                      src={
                        page?.profile_photo
                          ? page?.profile_photo
                          : page?.page_name
                      }
                    />

                    <div className={classes.gName}>
                      {page.page_name}
                      <div className={classes.about}>{page.about}</div>
                    </div>
                  </Box>
                </NavLink>
              </>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
PagesCreate.propTypes = {
  callRefresh: PropTypes.func.isRequired,
};

export default PagesCreate;
