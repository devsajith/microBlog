import { TextField } from "@mui/material";
import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./forgotpassword.module.css";
import { useForm } from "react-hook-form";
import bg from "../../../assets/image/changepassword.jpg";
import { forgotPasswordRequest } from "../../../Service/userService";
import Swal from "sweetalert2";
import CommonButton from "../../../components/buttons/buttons";
import staticStrings from "../../../constants/ststic";

const Forgotpassword = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();
  const onFormSubmit = (data) => {
    forgotPasswordRequest(data)
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            title: staticStrings.otpsendMessage,
            icon: staticStrings.success,
            timer: 2500,
            showConfirmButton: false,
          });
          const tempToken = response?.data?.tempToken;
          navigate("/verifyotp", {
            state: { tempToken: tempToken, data: data },
          });
        } else {
          Swal.fire({
            title: "Not Found",
            icon: "error",
          });
        }
      })
      .catch((error) => {
        if (error?.response?.data?.erroCode === 2210) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: staticStrings.tooSoonMessage,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: staticStrings.invalidUser,
          });
        }
      });
  };
  return (
    <div className={styles.body}>
      <div className={styles.loginMainDiv}>
        <div className={styles.img}>
          <div className={styles.loginIcon}>
            <div className={styles.imagediv}>
              <img src={bg} className={styles.bg} alt="" />
              <div className={styles.micro}>
                <p>{staticStrings.titleName}</p>
              </div>
            </div>
            <div className={styles.microBlogin1}>{staticStrings.titleName}</div>
            <div className={styles.loginForm}>
              <h1 className={styles.heading}>Forgot Password</h1>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.message}>
                  <label
                    htmlFor="username"
                    style={{ visibility: "hidden" }}
                    className={styles.usernameMargin}
                  >
                    <FaUserAlt />
                  </label>
                  <div className={styles.formsdiv}>
                    <TextField
                      id="outlined-basic"
                      inputProps={{
                        style: {
                          height: 14,
                          width: 240,
                          marginLeft: 1,
                          textDecoration: "none",
                        },
                      }}
                      label="Email"
                      variant="outlined"
                      {...register("email", {
                        required: true,
                        pattern: staticStrings.emailPattern,
                      })}
                    />
                    <p className={styles.err}>
                      {errors.email?.type === "required" &&
                        staticStrings.emailRequired}
                      {errors.email?.type === "pattern" &&
                        staticStrings.emailValidation}
                    </p>
                  </div>
                </div>
                <CommonButton
                  onClick={handleSubmit(onFormSubmit)}
                  buttonText={"Send OTP"}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Forgotpassword;
