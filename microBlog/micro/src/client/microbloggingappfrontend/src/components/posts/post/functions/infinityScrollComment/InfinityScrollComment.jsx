import {listComments} from "../../../../../Service/PostService";
function infinityScrollComment(setlimit, limit, Id, sort,setComments) {
    return (e) => {
      setlimit(limit + 5);
      //comments
      let nextLimit = limit + 5;
      if (e.target.scrollTop + 50 >=
        e.target.scrollHeight - e.target.clientHeight) {
        listComments(Id, nextLimit,sort).then((response) => {
          setComments(response?.data?.result);
        });
      }
    };
  }
  export default infinityScrollComment;
  