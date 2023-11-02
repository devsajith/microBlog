import React from "react";
import bg from "../../../assets/image/bgimage.jpg";
import { FaLock, FaUserAlt } from "react-icons/fa";
import { Link, useNavigate, NavLink } from "react-router-dom";
import classes from "./login.module.css";
import { signInWithEmailAndPswrd, signInWithGoogle } from "../../../Firebase";
import { useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Swal from "sweetalert2";
import { userLogin } from "../../../Service/userService";

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const recent = [];

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const signInGoogle = () => {
    try {
      signInWithGoogle().then((res) => {
        const provider = res.providerId;
        localStorage.setItem("provider", provider);
        const uid = res?.user?.uid;

        if (res?.user?.accessToken) {
          let token = res?.user?.accessToken;

          userLogin(token).then((response) => {
            localStorage.setItem("accessToken", response?.data?.accessToken);
            localStorage.setItem("refreshToken", response?.data?.refreshToken);
            localStorage.setItem("status", response?.data?.userStatus);
            localStorage.setItem("role", response?.data?.role);
            localStorage.setItem("uid", uid);
            localStorage.setItem("recent", JSON.stringify(recent));

            if (response?.data?.userStatus === 2) {
              const accessToken = response?.data?.accessToken;
              
              navigate("/updateprofile", {
                state: { id: response?.data?.id, accessToken: accessToken },
              });
            } 
            if(response?.data?.role !==2){
              navigate("/feeds");
            }
            else{
              navigate("/adminLogin")
            }
          });
        }
      });
    } catch (err) {
      return err;
    }
  };
  const onFormSubmit = (data) => {
    signInWithEmailAndPswrd(data?.email, data?.password).then((response) => {
      const uid = response?.user?.uid;
      if (response?.user?.accessToken) {
        let token = response?.user?.accessToken;
        userLogin(token)
          .then((response) => {
            let accessToken = response?.data?.accessToken;
            let status = response?.data?.userStatus;
            localStorage.setItem("uid", uid);
            localStorage.setItem("recent", JSON.stringify(recent));
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", response?.data?.refreshToken);
            localStorage.setItem("userStatus", status);
            navigate("/feeds");
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Your account has been temporarily blocked!",
            });
          });
      } else if (response.message.includes(response.code.INVALID_EMAIL)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Credentials!",
        });
        throw new Error("Incorrect email or password");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Credentials!",
        });
        throw new Error("Invalid credentials");
      }
    });
  };
  return (
    <div id="loginBody" className={classes.loginpageBody}>
      <div className={classes.loginMainDiv}>
        <div className={classes.img}>
          <div className={classes.loginIcon}>
            <div className={classes.imagediv}>
              <img alt="" src={bg} className={classes.bg} />
              <div className={classes.micro}>
                <p>MICROBLOGGING SITE</p>
              </div>
            </div>
            <div className={classes.microBlogin1}>MICROBLOGGING SITE</div>
            <div className={classes.loginform}>
              <h1 className={classes.Heading}>Login</h1>
              <form onSubmit={handleSubmit} className={classes.form}>
                <div className={classes.message}>
                  <label htmlFor="username" className={classes.usernameMargin}>
                    <FaUserAlt />
                  </label>
                  <div className={classes.formsdiv}>
                    <TextField
                      id="outlined-basic"
                      inputProps={{
                        style: {
                          height: 17,
                          width: 240,
                          marginLeft: 1,
                          textDecoration: "none",
                        },
                      }}
                      label="Email"
                      variant="outlined"
                      {...register("email", { required: true })}
                    />
                    <p className={classes.err}>
                      {errors.email?.type === "required" && "Email is required"}
                    </p>
                  </div>
                </div>
                <div className={classes.password}>
                  <label htmlFor="password" className={classes.passwordMargin}>
                    <FaLock />
                  </label>
                  <div className={classes.formsdiv}>
                    <FormControl
                      sx={{ m: 1, width: "25ch" }}
                      variant="outlined"
                    >
                      <InputLabel htmlFor="outlined-adornment-password">
                        Password
                      </InputLabel>

                      <OutlinedInput
                        id="outlined-adornment-password"
                        inputProps={{
                          style: {
                            height: 14,
                            width: 240,
                            marginLeft: 1,
                            textDecoration: "none",
                          },
                        }}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        {...register("password", { required: true })}
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
                    <p className={classes.err}>
                      {errors.password?.type === "required" &&
                        "Password is required"}
                    </p>
                  </div>
                </div>
                <div className={classes.forgot}>
                  <a href>
                    <NavLink
                      className={classes.hrefName}
                      to={"/forgotpassword"}
                    >
                      Forgot password?
                    </NavLink>
                  </a>
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit(onFormSubmit)}
                  className={classes.buttonReg}
                >
                  <h3 className={classes.LoginButton}>Log In</h3>
                </button>
              </form>
              <div className={classes.Or}>
                <span className={classes.OrSpan}>OR</span>
              </div>
              <div className={classes.googleBtn} onClick={signInGoogle}>
                <div className={classes.googleIconWrapper}>
                  <img
                    alt=""
                    className={classes.googleIcon}
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  />
                </div>
                <p className={classes.btnText}>Sign In with google</p>
              </div>
              <label className={classes.SignUp}>Do not have an account?</label>
              <label className={classes.S}>
                <Link to="/register" className={classes.signuplink}>
                  Register
                </Link>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
