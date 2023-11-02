/* eslint-disable no-useless-escape */
import React from "react";
import styles from "./changepassword.module.css";
import FormControl from "@mui/material/FormControl";
import { FaLock } from "react-icons/fa";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import bg from "../../../assets/image/changepassword.jpg";
import { changepassword } from "../../../Firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CommonButton from "../../../components/buttons/buttons";
import staticStrings from "../../../constants/ststic";

const patternForNewPassword = staticStrings.patternForNewPassword;
const Changepassword = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    getValues,
    handleSubmit,
    watch,
  } = useForm();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [showPassword01, setShowPassword01] = React.useState(false);
  const [showpassword02, setShowPassword02] = React.useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPassword01 = () => setShowPassword01((show) => !show);
  const handleMouseDownPassword01 = (event) => {
    event.preventDefault();
  };
  const handleClickShowPassword02 = () => setShowPassword02((show) => !show);
  const handleMouseDownPassword02 = (event) => {
    event.preventDefault();
  };
  const onFormSubmit = (data) => {
    const newPassword = data.newPassword;
    const currentPassword = data.currentPassword;
    try {
      changepassword(currentPassword, newPassword)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Password changed successfully",
            text: "Redirecting to login..",
            allowOutsideClick: false,
          }).then(async (result) => {
            if (result.isConfirmed) {
              localStorage.clear();
              navigate("/login");
            }
          });
        })
        .catch(() => {});
    } catch (err) {
      return err;
    }
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
            <div>
              <div className={styles.microBlogin}>
                {staticStrings.titleName}
              </div>
              <div className={styles.loginform}>
                <h1 className={styles.Heading}>
                  {staticStrings.changePassword}
                </h1>
                <form className={styles.form}>
                  <div className={styles.password}>
                    <label
                      htmlFor="current-password"
                      style={{ visibility: "hidden" }}
                      className={styles.passwordMargin}
                    >
                      <FaLock />
                    </label>
                    <div className={styles.formsdiv}>
                      <FormControl
                        sx={{ m: 1, width: "25ch" }}
                        variant="outlined"
                      >
                        <InputLabel htmlFor="outlined-adornment-current-password">
                          {staticStrings.currewntPassword}
                        </InputLabel>

                        <OutlinedInput
                          id="outlined-adornment-current-password"
                          inputProps={{
                            style: {
                              height: 14,
                              width: 240,
                              textDecoration: "none",
                            },
                          }}
                          label={"Current Password--"}
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          {...register("currentPassword", { required: true })}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
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
                        {errors?.currentPassword?.type === "required" &&
                          staticStrings.newPasswordRequired}
                      </p>
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
                        {errors.newPassword?.type === "validate" &&
                          staticStrings.newPasswordNotSame}
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
    </div>
  );
};

export default Changepassword;
