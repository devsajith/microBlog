/* eslint-disable no-useless-escape */
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import React from "react";
import { FaUserAlt } from "react-icons/fa";
import styles from "./resetpassword.module.css";
import { useForm } from "react-hook-form";
import bg from "../../../assets/image/changepassword.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../Service/userService";
import Swal from "sweetalert2";
import CommonButton from "../../../components/buttons/buttons";
import staticStrings from "../../../constants/ststic";

const patternForNewPassword = staticStrings.patternForNewPassword;
const Resetpassword = () => {
  const {
    register,
    formState: { errors },
    getValues,
    handleSubmit,
    watch,
  } = useForm();
  const [showPassword01, setShowPassword01] = React.useState(false);
  const [showpassword02, setShowPassword02] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClickShowPassword01 = () => setShowPassword01((show) => !show);
  const handleMouseDownPassword01 = (event) => {
    event.preventDefault();
  };
  const handleClickShowPassword02 = () => setShowPassword02((show) => !show);
  const handleMouseDownPassword02 = (event) => {
    event.preventDefault();
  };

  const onFormSubmit = (data) => {
    const tempToken = location?.state?.tempToken;
    const datas = {
      newPassword: data.newPassword,
      tempToken: tempToken,
    };
    resetPassword(datas)
      .then((response) => {
        if (response.status === 200) {
          localStorage.clear();
          Swal.fire({
            title: staticStrings.passwordResetSuccess,
            icon: staticStrings.success,
            timer: 2500,
            showConfirmButton: false,
          });
          navigate("/login");
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: staticStrings.timeOut,
        });
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
            <div className={styles.loginform}>
              <h1 className={styles.Heading}>Reset Password</h1>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.message}>
                  <label
                    htmlFor="username"
                    style={{ visibility: "hidden" }}
                    className={styles.usernameMargin}
                  >
                    <FaUserAlt />
                  </label>
                  <div className={styles.password}>
                    <div className={styles.formsdiv}>
                      <FormControl
                        sx={{ m: 1, width: "25ch" }}
                        variant="outlined"
                      >
                        <InputLabel htmlFor="outlined-adornment-new-password">
                          {staticStrings.newPassword}
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-new-password"
                          label="New Password--"
                          inputProps={{
                            style: {
                              height: 14,
                              width: 240,
                              textDecoration: "none",
                            },
                          }}
                          type={showpassword02 ? "text" : "password"}
                          name="New-Password"
                          {...register("newPassword", {
                            required: true,
                            validate: (value) =>
                              value !== getValues("currentPassword"),
                            pattern: patternForNewPassword,
                          })}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword02}
                                onMouseDown={handleMouseDownPassword02}
                                edge="end"
                              >
                                {showpassword02 ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                      <p className={styles.err}>
                        {errors.newPassword?.type === "required" &&
                          staticStrings.newPasswordRequired}
                        {errors.newPassword?.type === "pattern" &&
                          staticStrings.newPasswordValidation}
                      </p>
                      <FormControl
                        sx={{ m: 1, width: "25ch" }}
                        variant="outlined"
                      >
                        <InputLabel htmlFor="outlined-adornment-confirm-password">
                          {staticStrings.confirmPassword}
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-confirm-password"
                          label="Confirm-Password--"
                          inputProps={{
                            style: {
                              height: 14,
                              width: 250,
                              textDecoration: "none",
                            },
                          }}
                          type={showPassword01 ? "text" : "password"}
                          name="confirm-password"
                          {...register("renewPassword", {
                            required: true,
                            validate: (value) =>
                              value === getValues("newPassword"),
                          })}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword01}
                                onMouseDown={handleMouseDownPassword01}
                                edge="end"
                              >
                                {showPassword01 ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                      <p className={styles.err}>
                        {errors.renewPassword?.type === "required"
                          ? staticStrings.confirmPasswordRequired
                          : watch("newPassword") !== watch("renewPassword")
                          ? staticStrings.passwordMissmatch
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <CommonButton
                  onClick={handleSubmit(onFormSubmit)}
                  buttonText={"Save"}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Resetpassword;
