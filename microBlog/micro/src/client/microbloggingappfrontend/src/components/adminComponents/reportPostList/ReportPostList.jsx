import React, { useEffect, useState } from "react";
import style from "./reportPostList.module.scss";
import { listReportPost } from "../../../Service/PostService";

const ReportPostList = () => {
  const [reports, setReports] = useState([]);
  const [seeMore, setSeeMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await listReportPost();
        setReports(response?.data?.result);
      } catch (error) {
        return error
      }
    };

    fetchData();
  }, []);
  const handleClick = () => {
    setSeeMore(!seeMore);
  };
  return (
    <>
      <table className={style["table-report"]}>
<div className={style["tableHeight"]}  >

        <thead>
          <tr>
            <th className={style["table-head"]}>Post Image</th>
            <th className={style["table-head"]}>Text</th>
            <th className={style["table-head"]}>Reported Users</th>
            <th className={style["table-head"]}>Comment</th>
          </tr>
        </thead>
        <tbody className={style["table-body"]}>
          {reports?.map((report, index) => (
            <tr key={index}>
              <td className={style["table-row"]}>
                <img
                  className={style["avatar"]}
                  src={
                    report?.post?.post_image ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
                  }
                  alt="post"
                />
              </td>
              <td className={style["table-text"]}>
                <p>{report?.post?.post_text || "Nill"}</p>
              </td>
              <td className={style["table-row"]}>
                {report?.post?.reported_user_name ||"Nill"}
              </td>

              <td className={style["table-comment"]}>
                {report?.post?.comment?.replace(/\s+/g, " ")?.length -
                  (report?.post?.comment?.split("\n")?.length - 1) >
                100 ? (
                  <p
                    className={style["seeMore"]}
                    style={{ wordBreak: "break-all" }}
                  >
                    {seeMore ? (
                      <p>
                        {report?.post?.comment||"Nill"}
                        <button
                          onClick={handleClick}
                          className={style["seemore"]}
                        >
                          See Less...
                        </button>
                      </p>
                    ) : (
                      <p>
                        {report?.post?.comment
                          ?.replace(/\s+/g, " ")
                          ?.replace(/\n+/g, null)
                          ?.slice(0, 100) ||"Nill"}
                        <button
                          onClick={handleClick}
                          className={style["seemore"]}
                        >
                          See More...
                        </button>
                      </p>
                    )}
                  </p>
                ) : (
                  <p style={{ wordBreak: "break-all" }}>
                    {report?.post?.comment ||"Nill"}
                  </p>
                )}

              </td>
            </tr>
          ))}
        </tbody>
        </div>
      </table>
    </>
  );
};

export default ReportPostList;
