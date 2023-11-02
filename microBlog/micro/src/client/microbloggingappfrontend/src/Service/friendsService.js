import { CommonGet ,CommonPut} from "./services";
import { CommonPost } from "./services";

export async function requestlist() {
  return CommonGet(`/user/friend-requests`);
}
export async function friendlist(searchText = "", pageNumber = "") {
  return CommonGet(`/user/?search=${searchText}&skip=${pageNumber}`);
}
export async function friendacceptReject(friendReqId, userId, status) {
  const url = `/user/friendrequest/?friend_request_id=${friendReqId}&userId=${userId}`;
  return CommonPost(url, { status });
}
export async function block(id){
  const url = `/user/${id}/block`
  return CommonPost(url)
}

export async function unblock(id){
  return CommonPut(`/user/${id}/unblock`)
}
export async function globalSearch(searchText, pageNumber="", filter = "", limit = "") {
  return CommonGet(`/?search=${searchText}&skip=${pageNumber}&limit=${limit}&filter=${filter}`);
}

export async function friendRequest(recieverUser) {
  const url = `/user/addFriend`;
  return CommonPost(url, { recieverUser: recieverUser });
}
