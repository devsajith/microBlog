/* eslint-disable no-useless-escape */

import React, { useState, useRef,useEffect } from 'react';
import classes from "./updateprofile.module.css";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FormControl from '@mui/material/FormControl';
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { uploadBytes, getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateUser } from '../../Service/userService';
import moment from 'moment/moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import HexaLoader from '../../components/hexaloader/Hexaloader';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import countries from "../../constants/countries";

const UpdateProfile = () => {
  const location = useLocation();
  const naviagte = useNavigate();
  const [country, setCountry] = useState(null);
  const { register, formState: { errors }, handleSubmit, control } = useForm()
  const [spinner, setSpinner] = useState(false)
  useEffect(() => {
    if(!location?.state?.accessToken){
      naviagte("/login")
    }
  })
  const onFormSubmit = async (data) => {
    const dateObj = new Date(data.dob);
    const formattedDate = moment(dateObj).format("DD/MM/YYYY");
    const datas = { dob: formattedDate,city: data.city || null,country: country && country.label ? country.label : null,
      about: data.about || null,userName: data.userName,phone: data.phone || null, gender: data.gender
    }
    setSpinner(true);
    const id = location?.state?.id
    const token = location?.state?.accessToken
    let imageUrl
    if (image) {
      imageUrl = await uploadToFirebaseStorage()
    }
    datas.photo = imageUrl
    updateUser(id, datas, token).then((res) => {
      const status = res?.data?.userStatus
      localStorage.setItem("accessToken", token)
      localStorage.setItem("status", status)
      setTimeout(() => {
        setSpinner(false);
        Swal.fire({
          title: "Successfully Updated",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
        setSpinner(false);
        naviagte("/feeds")
      }, 1000)
    }).catch(err => {
      setTimeout(() => {
        setSpinner(false);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong. Please try again'
          });
      }, 1000)
    });
  }
  const uploadToFirebaseStorage = async () => {
    const file = image;
    const storage = getStorage();
    const storageRef = ref(storage, `ProfileImage/${file.name}`);
    try {
      const uploaded = await uploadBytes(storageRef, image, { contentType: image.type });
      if (uploaded) {
        return getDownloadURL(storageRef);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  const [image, setImage] = useState(null);
  const [imageView, setImageView] = useState(null);
  const fileInputRef = useRef(null);
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
  const handleRoundClick = () => {
    fileInputRef.current.click();
  };
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
  return (
    <div id="dataloadpageBody" className={classes.dataloadBody}>
      {spinner && <HexaLoader />}
      <div className={classes.registerMainDiv}>
        <div className={classes.img}>
          <div className={classes.registerIcon}>
            <div className={classes.flex}>
              <div className={classes.imagediv}></div>
              <div className={classes.microBlogin}>MICROBLOGGING SITE</div>
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
                        <div className={classes.roundPreview} style={{ backgroundImage: `url(${imageView})` }} />
                      ) : (
                        <label className={classes.uploadIcon}><FontAwesomeIcon icon={faUser} /></label>
                      )}
                    </div>
                    <input
                      type="file"
                      id="image-upload"
                      key={image}
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept=".png, .jpg, .jpeg"
                    />
                    <label htmlFor="image-upload" className={classes.uploadLabel}>
                      Upload you profile
                    </label>
                  </div>
                </div>
                <div className={classes.message}>
                  <div className={classes.formsdiv}>
                    <TextField
                      id="outlined-basic"
                      label="Username *"
                      variant="outlined"
                      inputProps={{
                        style: { height: 14, width: 240, marginLeft: 1, textDecoration: 'none' }
                      }}
                      {...register("userName", { required: true,minLength: 3,maxLength: 30,
                         pattern: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/ })}
                    />
                    <p className={classes.err}>
                      {errors.userName?.type === "required" && "Username is required"}
                      {errors.userName?.type === "minLength" && "Username should contain at least 3 characters"}
                      {errors.userName?.type === "maxLength" && "Maximum length allowed is 30"}
                      {errors.userName?.type === "pattern" && "Please only use letters, numbers, and special characters in the username"}
                    </p>
                  </div>
                  <div className={classes.formsdivPhone}>
                    <TextField id="outlined-basic" label="city" variant="outlined" inputProps={{
                      style: { height: 14, width: 240, marginLeft: 1, textDecoration: 'none' }
                    }}
                      {...register("city", { required: false, maxLength: 50, pattern: /^[^\s]+(?:$|.*[^\s]+$)/ })}
                    />
                    <p className={classes.err}>
                      {errors.city?.type === "pattern" && "Please do not use white space on start or end"}
                      {errors.city?.type === "maxLength" && "Maximum 50 characters are allowed"}
                    </p>
                  </div>
                </div>
                <div className={classes.message}>
                  <div className={classes.formsdivCountry}>
                    <Autocomplete
                      id="country-select-demo"
                      sx={{ width: 300 }}
                      options={countries}
                      autoHighlight
                      getOptionLabel={(option) => option.label}
                      value={country}
                      onChange={(event, value) => setCountry(value)}
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          <img loading="lazy" width="20" alt=""
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                          />
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Choose a country"
                          inputProps={{
                            ...params.inputProps,
                            style: { height: 14, width: 240, marginLeft: 1, textDecoration: 'none' }
                          }}
                        />
                      )}
                    />
                  </div>
                  {process.env.REACT_APP_ENV === "PRODUCTION" || process.env.REACT_APP_ENV === true ?null:
                  <div className={classes.adjustDiv} />
                  }
                  <div className={classes.gender}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Gender *</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        label="Gender *"
                        defaultValue={""}
                        name="gender"
                        inputProps={{
                          ...register("gender", { required: true })
                        }}
                      >
                        <MenuItem value="1">Male</MenuItem>
                        <MenuItem value="2">Female</MenuItem>
                        <MenuItem value="3">Others</MenuItem>
                      </Select>
                    </FormControl>
                    <p className={classes.err}>
                      {errors.gender?.type === "required" && "Gender is required"}
                    </p>
                  </div>
                </div>
                <div className={classes.message}>
                  <div className={classes.formsdiv}>
                    <Controller
                      control={control}
                      name="dob"
                      defaultValue={""}
                      rules={{ required: true,validate: validateDOB }}
                      render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            inputProps={{
                              style: { height: 14, width: 240, marginLeft: 1, textDecoration: 'none' }
                            }}
                            {...field}
                            inputRef={ref}
                            label="DOB *"
                            defaultValue={moment().subtract(5, 'years').format("YYYY-MM-DD")}
                            maxDate={moment().subtract(5, 'years').format("YYYY-MM-DD")}
                            renderInput={(inputProps) => (
                              <TextField
                                {...inputProps}
                                onBlur={onBlur}
                                name={name}
                                error={false}
                              />
                            )}
                          />
                          <p className={classes.err}>
                            {fieldState.error?.type === "required" ? "Date of birth is required" : fieldState.error?.message ? fieldState.error?.message : ""}
                          </p>
                        </LocalizationProvider>
                      )}
                    />
                  </div>
                  <div className={classes.formsdiv}>
                    <TextField id="outlined-basic" label="About" variant="outlined" inputProps={{
                      style: { height: 14, width: 240, marginLeft: 1, textDecoration: 'none' }
                    }}  {...register("about", { required: false, pattern: /^[^\s]+(?:$|.*[^\s]+$)/, maxLength: 200 })}
                    />
                    <p className={classes.err}>
                      {errors.about?.type === "pattern" && "Please do not use white space on start or end"}
                      {errors.about?.type === "maxLength" && "Maximum 200 characters are allowed"}
                    </p>
                  </div>
                </div>
                <div className={classes.message}>
                  <div className={classes.formsdivPhone}>
                    <TextField
                      id="outlined-basic"
                      label="Phone"
                      variant="outlined"
                      inputProps={{
                        style: { height: 14, width: 240, marginLeft: 1, textDecoration: 'none' }
                      }}
                      {...register("phone", { required: false,maxLength: 13,validate: validatePhone })}
                    />
                    <p className={classes.err}>
                      {errors.phone?.type === "maxLength" && "Invalid phone number"}
                      {errors.phone?.type === "minLength" && "Invalid phone number"}
                      {errors.phone?.message}
                    </p>
                  </div>
                </div>
                <div className={classes.buttons}>
                  <button onClick={handleSubmit(onFormSubmit)} className={classes.buttonReg}><h3 className={classes.RegisterButton}> Register</h3></button>
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

export default UpdateProfile
