import { CommonGet, CommonPut} from './services';
import { axiosInstance } from "./interceptor";

export const refreshToken = () => {
  let refreshToken = localStorage.getItem("refreshToken");
  return axiosInstance.put("/auth/refreshaccesstoken", {
    refreshToken: refreshToken,
  });
};

export async function userLogin(data) {
  return await axiosInstance.post(`/login`, { fireBaseToken: data });
}

export async function googleSignIn(data) {
  axiosInstance.post(`/login`, { fireBaseToken: data }).then((response) => { });
}

export async function userreg(data) {
  axiosInstance.post(`/user/register`, data);
}

export async function updateUser(id, data, token) {
  return await axiosInstance.put("/users/" + id, data);
}
export async function editUser(id, data) {
  return await axiosInstance.put("/users/" + id, data)

}
export async function forgotPasswordRequest(email) {
  return await axiosInstance.post("/user/forgot-password", email);
}
export async function vrifyotp(datas) {
  return await axiosInstance.post("/user/password-otpverify", datas);
}

export async function resetPassword(datas) {
  return await axiosInstance.post("/user/reset-success", datas);
}
export async function logoutAll() {
  return await axiosInstance.post("/logout-all");
}

export async function logoutFromADevice() {
  return await axiosInstance.post("/logout");
}

export async function userVieww(userid) {
  return CommonGet(`/user/${userid}`);
}

export async function getUserDetails(data) {
  const email = data?.email;
  const body = { email: email };
  return await axiosInstance.post("/auth/userdetails", body);
}

export async function createGroup (data){
  const groupName = data.groupName;
  const members = data.members;
  const imageUrl = data.imageUrl;
  const body = {groupName:groupName,members: members, imageUrl: imageUrl}
  return await axiosInstance.post('/group/create',body)
}


export async function listGroup(){
  return await CommonGet(`/group/list`) 
}

export async function groupDetails(id){
  return await CommonGet(`/group/${id}/details`) 
}
export async function updateGroup(data){
  const id = data?.id;
  const groupName = data?.groupName;
  const imageUrl = data?.imageUrl;
  const body = {groupName:groupName,imageUrl:imageUrl}
  return await CommonPut(`group/${id}/edit`,body)


}

export async function deleteGroup(id){
  return await CommonPut(`/group/${id}/delete`)
}
