import React from "react";
import classes from "../../../postList/postlist.module.css";
import { Button, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function commentInputBox(handleSubmit, handleAddComent, register, errors,userDetails) {
    return <div className={classes["comment-input"]}>
      <img
        src={userDetails?.user?.photo}
        alt=""
        className={classes["comment-avatar"]} />
      <form
        onSubmit={handleSubmit(handleAddComent)}
        className={classes["form"]}
      >
        <input
          type="text"
          placeholder="comment"
          {...register("comment", {
            maxLength: { value: 1000, message: "Maxlength 500 characters" },
          })} />
        <p>{errors?.maxLength?.message}</p>
        <Button type="submit" value="submit">
          <Tooltip title="Send">
            <SendIcon />
          </Tooltip>
        </Button>
      </form>
    </div>;
  }
  
export default commentInputBox;