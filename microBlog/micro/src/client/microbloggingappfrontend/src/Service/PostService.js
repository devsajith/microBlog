import { CommonGet, CommonPost, CommonPut } from "./services";

export async function addPost(imageUrl, text) {
  const url = `/post/create`;
  return CommonPost(url, { imageUrl: imageUrl ? imageUrl : "", text });
}
export async function listPost(
  pageNumber = "",
  limit = 20,
  sort = "recommendations"
) {
  return CommonGet(
    `/post/list/?skip=${pageNumber}&limit=${limit}&sort=${sort}`
  );
}
// notification of chat
export async function chatNotification(data) {
  return CommonPost(`/chat/notification`,data);
}

// report post
export async function reportPost(id,comment) {
  const data={
comment:comment,
  }
  return CommonPost(`/post/${id}/report`,data);
}

export async function listReportPost() {
  return CommonGet(
    `/posts/reported/lists`
  );
}

export async function dislike(id) {
  return CommonPost(`/post/${id}/undo-like`);
}

export async function deletePost(id) {
  return CommonPut(`/post/${id}/delete`);
}

export async function updatePost(imageUrl, text, id, version) {
  const url = `/post/${id}`;
  const data = {
    imageUrl: imageUrl ? imageUrl : "",
    text: text,
    version: version.toString(),
  };
  return CommonPut(url, data);
}

export async function getPost(id) {
  return CommonGet(`/post/${id}`);
}
export async function PostOfCurrentUser(id){
    return CommonGet(`/post/user/${id}/list`)
}
export async function likePost(id) {
  return CommonPost(`/post/${id}/like`);
}

// comment like
export async function likeComment(id) {
  return CommonPost(`/post/comment/${id}/like`);
}
// dislike comment
export async function dislikeComment(id) {
  return CommonPost(`/post/comment/${id}/undo-like`);
}
export async function listComments(id, limit,sort="latest") {
  return CommonGet(`/post/comment/${id}/list?limit=${limit}&sort=${sort}`);
}

export async function addComment(comment, id) {
  const data = {
    comment: comment,
  };
  return CommonPost(`/post/${id}/comment`, data);
}

export async function editComment(id, comment, ver) {
  const version = JSON.stringify(ver);
  const data = { comment: comment, version: version };
  return CommonPut(`/post/comment/${id}`, data);
}
export async function editReComment(id, comment, ver, pId) {
  const version = JSON.stringify(ver);
  const data = { comment: comment, version: version, parentComment: pId };
  return CommonPut(`/post/comment/${id}`, data);
}

export async function replayComment(commentId, pId, data) {
  const datas = { parentComment: commentId, comment: data };
  return CommonPost(`/post/${pId}/comment`, datas);
}
export async function deleteComment(id) {
  return CommonPut(`/post/comment/${id}/delete`);
}
export async function deleteReComment(id) {
  return CommonPut(`/post/comment/${id}/delete`);
}
export async function likedUsers(id, limit, skip = "") {
  let pageLimit = "";
  if (limit > 0) {
    pageLimit = limit;
  }
  return CommonGet(`/post/${id}/liked-users?skip=${skip}&limit=${pageLimit}`);
}
export async function sharePost(id){
  return CommonPost(`/post/${id}/share`)
}
export async function sharedList(id){
  return CommonGet(`/post/${id}/sharedusers`)
}
