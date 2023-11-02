import { CommonGet,CommonPut } from "./services";

// useEffect(() => {
//   if (token) {
//     const socket = socketIOClient(BASE_URL);
//     const user = getUserPermission();
//     socket.on("connection", );
//     socket.emit("userConnected", user.email);
//     socket.on("notificationCount", () => {
//       getNotificationCount();
//     });
//     return () => {
//       socket.off("connection");
//       socket.off("notificationCount");
//     };
//   }
// }, [BASE_URL, token]);
export async function listPost(
    // pageNumber = "",
    limit = 100
  ) {
    return CommonGet(
      `/notification/list/?limit=${limit}`
    );
  }
  export async function updateStatus(data) {
    const url = `/notification/edit`;
    return CommonPut(url,data);
  }
  export async function deleteNotification(data) {
    const url = `/notification/delete`;
    return CommonPut(url,data);
  }
  export async function updateDelivery(data) {
    const url = `/notification/delivery`;
    return CommonPut(url,data);
  }
