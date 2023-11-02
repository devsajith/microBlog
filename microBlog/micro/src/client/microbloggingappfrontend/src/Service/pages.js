import { CommonPost, CommonGet, CommonPut } from "./services";

export async function createPage(data) {
  const url = `/pages/create`;
  return CommonPost(url, data);
}

// edit page
export async function editPage(data,id) {
  const url = `/pages/${id}/edit`;
  return CommonPut(url, data);
}

// delete page
export async function deletePage(id) {
  return CommonPut(`/pages/${id}/delete`);
}

export async function getCreatedPage() {
  return CommonGet(`/pages/by-user/list`);
}

export async function listPost(id, pageNumber = "", limit = 20) {
  return CommonGet(
    `post/pages/${id}/list-post/?skip=${pageNumber}&limit=${limit}`
  );
}

export async function detailedView(id) {
  return CommonGet(`/pages/${id}/detailed-view`);
}

export async function followPage(id){
  return CommonPut(`pages/${id}/follow`)
}

export async function unFollowPage(id) {
  return CommonPut(`/pages/${id}/unfollow`);
}

export async function addPagePostApi(data) {
  const url = `/post/create`;
  return CommonPost(url, data);
}

export async function followedPageList(){
  return CommonGet('/pages/list-pages')
}
export async function followersList(id){
  return CommonGet(`pages/${id}/list-followers`)
}