import React ,{useState}from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MenuItem from "@mui/material/MenuItem";
import FlagIcon from '@mui/icons-material/Flag';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import style from "./styledFunction.module.scss"
import {reportPost} from "../../../../../Service/PostService";
import Swal from "sweetalert2";

function StyledFunction(StyledMenu, anchorEl, open, handleCloseHoverModalEdit, userId, post, editPost, handleDeletePost,setAnchorEl) {
    const [openReport, setOpenReport] = React.useState(false);
const [error,setError]=useState("")
const [comment,setComment]=useState("")
const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const handleClickOpen = () => {
      setOpenReport(true);
      setAnchorEl(null)
    };
  
    const handleClose = () => {
      setOpenReport(false);
    };
const handletextchange=(event)=>{
  const inputData = event.target.value.trim();
  if(inputData.length >1000||inputData.length===0){
    setError("The text should be between 1 and 1000 characters")
    setIsButtonDisabled(true);
  }
  else{
    setError("")
    setComment(inputData)
    setIsButtonDisabled(false);
  }
}
const handleSubmit =()=>{
  reportPost(post?._id,comment)
  .then((response)=>{
    if(response?.status===200){
    Swal.fire({
      icon: "success",
      text: "Report send successfully",
    });
    setOpenReport(false);
  }
  else{
    setOpenReport(false);
    Swal.fire({
      icon: "error",
      text: response?.response?.data?.error
    });
  }
  })
  .catch((error) => {
    return error
  });
  
}
    return (
    <>
    <StyledMenu
      id="demo-customized-menu"
      MenuListProps={{ "aria-labelledby": "demo-customized-button" }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleCloseHoverModalEdit}>
      {userId === post?.user_id?._id && (
        <div>
          <MenuItem onClick={editPost} disableRipple>
            <EditIcon />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeletePost} disableRipple>
            <DeleteIcon />
            Delete
          </MenuItem>
        </div>
      )}
       {userId !== post?.user_id?._id && (
      <MenuItem onClick={handleClickOpen}>
        <FlagIcon />
        Report
      </MenuItem>
       )}
    </StyledMenu>


    <Dialog open={openReport} onClose={handleClose} id={style["report-post"]}>
<DialogTitle>Report Post</DialogTitle>
<DialogContent className={style["textandfield"]}>
  <DialogContentText className={style["about-report"]}>
  <ThumbDownIcon/>Tell us what you dont like here!
  </DialogContentText>
  <textarea
    autoFocus
    id="name"
    placeholder="Enter your comment"
    type="text"
    className={style["report-field"]}
    onChange={handletextchange}
  />
  {error&&
  <div className={style["error-report"]}>{error}</div>
  }
</DialogContent>
<DialogActions>
  <Button onClick={handleClose} >Cancel</Button>
  <Button onClick={handleSubmit} disabled={isButtonDisabled} style={{ color: isButtonDisabled ? "grey" : "blue" }}>Report</Button>
</DialogActions>
</Dialog>
    </>
    );
  }

  export default StyledFunction