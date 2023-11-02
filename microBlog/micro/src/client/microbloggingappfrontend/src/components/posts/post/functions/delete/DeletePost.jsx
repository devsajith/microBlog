import {deletePost} from "../../../../../Service/PostService";
import Swal from "sweetalert2";
function deletePostFunction(setAnchorEl, post, showSuccessSnackBar, fetchlistPost) {
    return () => {
      setAnchorEl(null);
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete post",
        showCancelButton: true,
        icon: "warning",
        buttons: ["No, cancel it!", "Yes, I am sure!"],
        dangerMode: true,
      }).then((data) => {
        if (data.isConfirmed) {
          deletePost(post._id).then(() => {
            setAnchorEl(null);
            showSuccessSnackBar("Post Deleted Successfully");
            fetchlistPost();
          });
        } else {
          setAnchorEl(null);
        }
      });
    };
  }
  
  export default deletePostFunction;