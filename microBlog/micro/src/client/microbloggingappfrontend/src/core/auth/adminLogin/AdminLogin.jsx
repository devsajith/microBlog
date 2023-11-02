
import React from 'react';
import classes from "./adminLogin.module.scss";
import { FaLock, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import IconButton from '@mui/material/IconButton';
import { signInWithEmailAndPswrd } from '../../../Firebase';
import TextField from "@mui/material/TextField";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Swal from 'sweetalert2'
import { userLogin } from '../../../Service/userService';
const AdminLogin = () => {
  const { register, formState: { errors }, handleSubmit } = useForm()


  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const onFormSubmit = (data) => {
    signInWithEmailAndPswrd(data?.email, data?.password)
        .then((response) => {
            if (response?.user?.accessToken) {
                let token = response?.user?.accessToken;
                userLogin(token)
                    .then((adminResponse) => { 
                        localStorage.setItem("accessToken", adminResponse?.data?.accessToken);
                        localStorage.setItem("refreshToken", adminResponse?.data?.refreshToken);
                        localStorage.setItem("status", adminResponse?.data?.userStatus);
                        if(adminResponse?.data?.role===2){
                        navigate("/dashboard")
                        }
                        else{
                            navigate("/login")
                            localStorage.clear()
                        }
                    })
                    .catch((adminError) => {
                        return adminError
                    });
            } else if (response.message.includes(response.code.INVALID_EMAIL)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Invalid Credentials!'
                });
                throw new Error('Incorrect email or password');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Invalid Credentials!'
                });
                throw new Error('Invalid credentials');
            }
        })
        .catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid Credentials!'
            });
        });
};

  return (
    <div className={classes.bodyAdmin}>
      <div className={classes.loginMainDiv}>
        <div className={classes.img}>
          <div className={classes.loginIcon}>
            <div className={classes.imagediv}>


              <div className={classes.micro}>MICROBLOGGING SITE</div>
            </div>

            <div className={classes.micro1}>MICROBLOGGING SITE</div>
            <div className={classes.loginform}>
              <h1 className={classes.Heading}>Admin Login</h1>
              <form onSubmit={handleSubmit} className={classes.form}>
                <div className={classes.message}>
                  <label htmlFor="username" className={classes.usernameMargin}><FaUserAlt /></label>
                  <div className={classes.formsdiv}>
                    <TextField id="outlined-basic" label="Email" variant="outlined" inputProps={{
                      style: { height: 17, width: 240, marginLeft: 1, textDecoration: 'none' }
                    }}
                    {...register("email", { required: true})} />
                    <p className={classes.err}>
                      {errors.email?.type === "required" && "Email is required"}
                    </p>
                  </div>
                </div>
                <div className={classes.password}>
                  <label htmlFor="password" className={classes.passwordMargin} ><FaLock /></label>
                  <div className={classes.formsdiv}>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        inputProps={{
                          style: { height: 14, width: 240, marginLeft: 1, textDecoration: 'none' }
                        }}
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
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
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <p className={classes.err}>
                      {errors.password?.type === "required" && "Password is required"}
                    </p>
                  </div>
                </div>
                <span className={classes.forgot}>Forgot password?</span>
                <button type="submit" onClick={handleSubmit(onFormSubmit)} className={classes.buttonReg}><h3 className={classes.LoginButton}>Log In</h3></button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default AdminLogin