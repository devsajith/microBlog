/* eslint-disable react/prop-types */
import React from "react";
import styles from "./button.module.css";
const CommonButton = ({ onClick, buttonText }) => {
  return (
    <button type="submit" onClick={onClick} className={styles.buttonReg}>
      <h3 className={styles.LoginButton}>{buttonText}</h3>
    </button>
  );
};

export default CommonButton;
