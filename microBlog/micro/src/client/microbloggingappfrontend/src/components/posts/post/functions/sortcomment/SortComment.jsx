/* eslint-disable react/prop-types */
import React from 'react'
import downarrow from "../../../../../assets/image/down-arrow.png";
import { Typography } from "@mui/material";
import styledMenuFunction from "../../../post/functions/styledMenu/StyledMenu";
import MenuItem from "@mui/material/MenuItem";

const SortComment = ({setSort,sort}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const StyledMenu = styledMenuFunction();
  const handleClickHoverModal = (event) => {
    setAnchorEl(event.currentTarget);
  };
 const handleCloseHoverModal = () => {
        setAnchorEl(null);
      };
 const handleFilter = (filterValue) => {
        setAnchorEl(null);
        setSort(filterValue);
      };
      const open = Boolean(anchorEl);
      const id = open ? "simple-popover" : undefined;
  return (
    <>     
    <div className="sortBy">
    <hr />
    <p onClick={handleClickHoverModal} className="dropbtn"  aria-describedby={id}>Sort by:
    <span>{(sort && sort?.charAt(0).toUpperCase() + sort?.slice(1)) ||"latest"}
     <img src={downarrow} alt="" /></span></p>
    <StyledMenu id="demo-customized-menu"
      MenuListProps={{ "aria-labelledby": "demo-customized-button",}}
      anchorEl={anchorEl}
      open={open}
      onClose={handleCloseHoverModal}>
      <MenuItem onClick={() => handleFilter("latest")}><Typography sx={{ p: 1, cursor: "pointer", fontSize: "medium" }}>latest</Typography> </MenuItem>
      <MenuItem onClick={() => handleFilter("oldest")}><Typography sx={{ p: 1, cursor: "pointer", fontSize: "medium" }}>Oldest</Typography></MenuItem>
      <MenuItem onClick={() => handleFilter("mostreply")}><Typography sx={{ p: 1, cursor: "pointer", fontSize: "medium" }}>Most Reply</Typography> </MenuItem>
    </StyledMenu>
  </div>

  </>
  )
}

export default SortComment