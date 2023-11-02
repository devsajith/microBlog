/* eslint-disable no-useless-escape */
import React, { useState, useRef } from 'react';
import classes from "./registration.module.css";
import { signInWithGoogle, createWithEmailAndPassword } from "../../../Firebase";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { uploadBytes, getStorage, ref, getDownloadURL } from 'firebase/storage';
import { userreg } from '../../../Service/userService';
import { useNavigate } from 'react-router-dom';
import moment from 'moment/moment';
import { userLogin } from '../../../Service/userService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { red } from '@mui/material/colors';
import HexaLoader from '../../../components/hexaloader/Hexaloader';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import countries from "../../../constants/countries";

const Registration = () => {
  const navigate = useNavigate()
  const { register, formState: { errors }, handleSubmit, control, watch } = useForm();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword01, setShowPassword01] = React.useState(false);
  const [spinner, setSpinner] = useState(false)
  const [country, setCountry] = useState(null);
  const [image, setImage] = useState(null);
  const [imageView, setImageView] = useState(null);
  const fileInputRef = useRef(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => { event.preventDefault(); };
  const handleClickShowPassword01 = () => setShowPassword01((show) => !show);
  const handleMouseDownPassword01 = (event) => { event.preventDefault(); };

  const signInGoogle = () => {
    try {
      signInWithGoogle().then((res) => {
        if (res?.user?.accessToken) {
          let token = res?.user?.accessToken
          userLogin(token).then((response) => {
            const accessToken = response?.data?.accessToken
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", response?.data?.refreshToken);
            localStorage.setItem("status", response.data.userStatus)

            if (response.data.userStatus === 2) {
              navigate("/updateprofile", { state: { "id": response.data.id, "accessToken": accessToken } })
            } else {
              navigate("/feeds")
            }
          })
        }
      })
    } catch (err) {
      return err;
    }
  }
  const onFormSubmit = (data) => {
    const dateObj = new Date(data.dob);
    const formattedDate = moment(dateObj).format("DD/MM/YYYY");
    const datas = {
      email: data.email, dob: formattedDate,
      city: data.city || null, country: country && country.label ? country.label : null,
      about: data.about || null, userName: data.userName,
      password: data.password, phone: data.phone || null, gender: data.gender
    }
    let firebaseImageUrl;
    setSpinner(true);
    createWithEmailAndPassword(datas?.email, datas?.password).then(async (response) => {
      if (response && response.message && response.message.includes(response.code)) {
        setSpinner(false);
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Email already exists' });
        throw new Error("Email already exits")
      }
      if (image) {
        firebaseImageUrl = await uploadToFirebaseStorage();
        if (firebaseImageUrl) {
          datas.photo = firebaseImageUrl
        }
      }
      if (!datas["phone"]) {
        delete datas.phone
      }
      userreg({ ...datas }).then(res => {
        setTimeout(() => {
          setSpinner(false);
          Swal.fire({ title: "Successfully Registered", icon: "success", timer: 2500, showConfirmButton: false, });
          navigate("/login")
        }, 1000)
      })
        .catch(err => {
          setTimeout(() => {
            setSpinner(false);
            if (err.response.data.erroCode === 2000) {
              Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong. Please try again' });
            }
          }, 1000)
        });
    })
    const uploadToFirebaseStorage = async () => {
      const file = image;
      const storage = getStorage();
      const storageRef = ref(storage, `ProfileImage/${file.name}`);
      try {
        const uploaded = await uploadBytes(storageRef, image, { contentType: image.type });
        if (uploaded) { return getDownloadURL(storageRef); }
        else { return false; }
      } catch (error) {
        return false;
      }
    }
  }

  const handleImageChange = (e) => {
    if (e.target && e.target.files && e.target.files.length && e.target.files[0].name) {
      const file = e.target.files[0];
      const reader = new FileReader();
      let fileFormat = file.name.split(".");
      fileFormat = fileFormat[fileFormat.length - 1];
      fileFormat = fileFormat.toUpperCase();
      if (["image/jpeg", "image/png", "image/jpg"].includes(file.type) && ["JPG", "PNG", "JPEG"].includes(fileFormat)) {
        const fileSize = file.size / 1024 / 1024; // in MiB
        if (fileSize > 1) {
          e.target.value = ''
          Swal.fire("File size exceeds 1 MB", "", "error");
          return;
        } else {
          reader.readAsDataURL(file);
          reader.onload = () => {
            setImage(file);
            setImageView(reader.result);
          };
        }
      } else {
        e.target.value = ''
        Swal.fire("Please select a PNG, JPG, or JPEG file", "", "error");
        return;
      }
    }
  };
  const handleRoundClick = () => { fileInputRef.current.click(); };

  const validatePhone = (value) => {
    if (value) {
      if (/^(?!\s)\d{0,13}$/.test(value)) {
        if (value.length < 10) {
          return "Invalid phone number"
        }
        return { type: false };
      } else {
        return "Invalid phone number"
      }
    }
    return { type: false };
  }
  const validateDOB = (value) => {
    if (value) {
      const selectedDate = new Date(value).getTime();
      const maxLimit = new Date(moment().subtract(5, "years")).getTime();
      if (maxLimit >= selectedDate) {
        return { type: false }
      }
      return "Please make sure that you use your real date of birth"
    }
    return "DOB Required"
  }

  const validateConfirmPassword = (value) => {
    if (value === watch("password")) {
      return { type: false }
    }
    return "Passwords must match"
  }
  return (
    <div id="registerBody" className={classes.registrationBody}>{spinner && <HexaLoader />}
      <div className={classes.registerMainDiv}>
        <div className={classes.img}>
          <div className={classes.registerIcon}>
            <div className={classes.flex}>
              <div className={classes.microBlogin}>MICROBLOGGING SITE</div>
              <div className={classes.imagediv}></div>
            </div>
            <div className={classes.microBlogin1}>MICROBLOGGING SITE</div>
            <div className={classes.registerform}>
              <div className={classes.textalign}>
                <form onSubmit={handleSubmit} className={classes.form}>
                  <div className={classes.App}>
                    <h1 className={classes.Heading}>Sign Up</h1>
                    <div className={classes.uploaderContainer}>
                      <div className={classes.roundUploader} onClick={handleRoundClick}>
                        {image ? (
                          <div className={classes.roundPreview} style={{ backgroundImage: `url(${imageView})` }} />) :
                          (<label className={classes.uploadIcon}> <FontAwesomeIcon icon={faUser} /> </label>)}
                      </div>
                      <input type="file" id="image-upload" key={image} ref={fileInputRef} onChange={handleImageChange} accept=".png, .jpg, .jpeg" />
                      <label htmlFor="image-upload" className={classes.uploadLabel}>Upload you profile </label>
                    </div>
                  </div>
                  <div className={classes.message}>
                    <div className={classes.formsdiv}>
                      <TextField id="outlined-basic" label="Username *" variant="outlined" inputProps={{ style: { height: 17, width: 240, marginLeft: 1, textDecoration: 'none', color: red } }}
                        {...register("userName", { required: true, minLength: 3, maxLength: 30, pattern: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/ })} />
                      <p className={classes.err}>
                        {errors.userName?.type === "required" && "Username is required"}
                        {errors.userName?.type === "minLength" && "Username should contain at least 3 characters"}
                        {errors.userName?.type === "maxLength" && "Maximum length allowed is 30"}
                        {errors.userName?.type === "pattern" && "Please only use letters, numbers, and special characters in the username"}
                      </p>
                    </div>
                    <div className={classes.formsdiv}>
                      <TextField label="Email *" variant="outlined" inputProps={{ style: { height: 17, width: 240, marginLeft: 1, textDecoration: 'none' } }}
                        {...register("email", { required: true, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} />
                      <p className={classes.err}>
                        {errors.email?.type === "pattern" && "Please enter a valid email"}  {errors.email?.type === "required" && "Email is required"}
                      </p>
                    </div>
                  </div>
                  <div className={classes.message}>
                    <div className={classes.formsdivPhone}>
                      <TextField label="city" variant="outlined" inputProps={{ style: { height: 17, width: 240, marginLeft: 1, textDecoration: 'none' } }}
                        {...register("city", { required: false, maxLength: 50, pattern: /^[^\s]+(?:$|.*[^\s]+$)/ })}
                      />
                      <p className={classes.err}>
                        {errors.city?.type === "pattern" && "Please do not use white space on start or end"}
                        {errors.city?.type === "maxLength" && "Maximum 50 characters are allowed"}
                      </p>
                    </div>
                    <div className={classes.formsdivCountry}>
                      <Autocomplete id="country-select-demo" sx={{ width: 300 }} options={countries} autoHighlightgetOptionLabel={(option) => option.label}
                        value={country} onChange={(event, value) => setCountry(value)} renderOption={(props, option) => (
                          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            <img loading="lazy" width="20" src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`} srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`} alt=""
                            />
                            {option.label}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label="Choose a country" inputProps={{ ...params.inputProps, style: { height: 17, width: 240, marginLeft: 1, textDecoration: 'none' } }} />                        )} />
                    </div>
               </div>
                  <div className={classes.message}>
                    <div className={classes.formsdiv}>
                      <Controller control={control} name="dob" defaultValue={""} rules={{ required: true, validate: validateDOB }}
                        render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker inputProps={{ style: { height: 17, width: 240, marginLeft: 1, textDecoration: 'none' } }} {...field} inputRef={ref} label="DOB *" defaultValue={moment().subtract(5, 'years').format("YYYY-MM-DD")} maxDate={moment().subtract(5, 'years').format("YYYY-MM-DD")}
                              renderInput={(inputProps) => (<TextField {...inputProps} onBlur={onBlur} name={name} error={false} />)} />
                            <p className={classes.err}>{fieldState.error?.type === "required" ? "Date of birth is required" : fieldState.error?.message ? fieldState.error?.message : ""} </p>
                          </LocalizationProvider>)} />
                    </div>
                    <div className={classes.gender}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label" >Gender *</InputLabel>
                        <Select sx={{height:"45px"}} labelId="demo-simple-select-label" label="Gender *" defaultValue={""} name="gender" inputProps={{ ...register("gender", { required: true }) }}  >
                          <MenuItem value="1">Male</MenuItem>
                          <MenuItem value="2">Female</MenuItem>
                          <MenuItem value="3">Others</MenuItem>
                        </Select>
                      </FormControl>
                      <p className={classes.err}> {errors.gender?.type === "required" && "Gender is required"} </p>
                    </div>
                  </div>
                  <div className={classes.password}>
                    <div className={classes.formsdiv}>
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
                        <OutlinedInput id="outlined-adornment-password" label="Password " inputProps={{ style: { height: 14, width: 240, marginLeft: 1, textDecoration: 'none' } }} type={showPassword ? 'text' : 'password'} name="password"
                          {...register("password", { required: true, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^\&*\)\(+=._-])(?=.*[0-9])(?=.{8,20}$)[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/ })}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" > {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton>
                            </InputAdornment>
                          } />
                      </FormControl>
                      <p className={classes.err}>
                        {errors.password?.type === "required" && "Password is required"}  {errors.password?.type === "pattern" && "Enter a valid 8-20 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character"}
                      </p>
                    </div>
                    <div className={classes.confirm}>
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password *</InputLabel>
                        <OutlinedInput id="outlined-adornment-confirm-password" label="Confirm Password" inputProps={{ style: { height: 14, width: 250, marginLeft: 1, textDecoration: 'none' } }}
                          name="renewPassword" type={showPassword01 ? 'text' : 'password'} {...register("renewPassword", { required: true, validate: validateConfirmPassword })}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword01} onMouseDown={handleMouseDownPassword01} edge="end" >
                                {showPassword01 ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          } />
                      </FormControl>
                      <p className={classes.err}>
                        {errors.renewPassword?.type === "required" && "Password is required"}  {errors.renewPassword?.type === "validate" ? "Password mismatch" : watch("password") && watch('renewPassword') && watch('renewPassword') !== watch("password") ? 'Password mismatch' : ""}
                      </p>
                    </div>
                  </div>
                  <div className={classes.message}>
                    <div className={classes.formsdivPhone}>
                      <TextField label="Phone" variant="outlined" inputProps={{ style: { height: 17, width: 240, marginLeft: 1, textDecoration: 'none' } }}
                        {...register("phone", { required: false, maxLength: 13, validate: validatePhone })} />
                      <p className={classes.err}>
                        {errors.phone?.type === "maxLength" && "Invalid phone number"} {errors.phone?.type === "minLength" && "Invalid phone number"} {errors.phone?.message}
                      </p>
                    </div>
                    <div className={classes.formsdiv}>
                      <TextField label="About" variant="outlined" inputProps={{ style: { height: 17, width: 240, marginLeft: 1, textDecoration: 'none' } }}  {...register("about", { required: false, pattern: /^[^\s]+(?:$|.*[^\s]+$)/, maxLength: 200 })} />
                      <p className={classes.err}>
                        {errors.about?.type === "pattern" && "Please do not use white space on start or end"} {errors.about?.type === "maxLength" && "Maximum 200 characters are allowed"}
                      </p>
                    </div>
                  </div>
                  <div className={classes.buttons}>
                    <button onClick={handleSubmit(onFormSubmit)} className={classes.buttonReg}><h3 className={classes.RegisterButton}> Register</h3></button>
                    <div className={classes.Or}><span className={classes.OrSpan}>OR</span></div>
                    <div className={classes.googleBtn} onClick={signInGoogle} >
                      <div className={classes.googleIconWrapper}  >
                        <img className={classes.googleIcon} src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" />
                      </div>
                      <p className={classes.btnText} >Sign Up with google</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Registration