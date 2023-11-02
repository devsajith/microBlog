import React from "react";
import { useNavigate } from "react-router-dom";
import errpage from "./errorpage.module.css";
const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className={errpage.aligncenter}>
        <div className={errpage.fourzerofourbg}>
          <h1>404</h1>
        </div>

        <div className={errpage.contantbox404}>
          <h3 className={errpage.h2}>Look like you are lost</h3>

          <p>the page you are looking for not avaible!</p>

          <h3
            className={errpage.link404}
            onClick={() => {
              navigate("feeds");
            }}
          >
            Go to Home
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
