export const GetCurrentPathName = (location) => {
  let url = location.pathname;
  url = url.split("/");
  if (url && url.length) {
    let nwurl = url[1];
    return nwurl;
  } else {
    return "";
  }
};

export function getRelativeDateTime(date) {
  const inputDate = new Date(date);

  const year = inputDate.getFullYear();
  const month = inputDate.toLocaleString("default", { month: "short" });
  const day = inputDate.getDate();
  let hour = inputDate.getHours();
  let period = "am";

  if (hour >= 12) {
    hour -= 12;
    period = "pm";
  }

  if (hour === 0) {
    hour = 12;
  }

  const minute = inputDate.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}, ${hour}:${minute}${period}`;
}
