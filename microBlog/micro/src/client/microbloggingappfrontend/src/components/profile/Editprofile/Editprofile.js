import React, { useState, useEffect, useRef } from 'react';
import './EditProfile.css';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import moment from 'moment/moment';
import Tooltip from '@mui/material/Tooltip';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { userVieww, editUser } from '../../../Service/userService'
import { userView } from "../../../actions/userSlice";
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';
import { useDispatch } from "react-redux";
import LoadingBar from 'react-top-loading-bar';
import HexaLoader from '../../hexaloader/Hexaloader';
import countries from "../../../constants/countries";
import { handleInputChangee } from './handleInputChangee';
import { uploadBytes, getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Box } from '@mui/system';
import { Autocomplete, TextField } from '@mui/material';
const EditProfile = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [selectedCountry, setSelectedCountry] = useState(null);
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('')
  const [phone,setPhoneNumber] = useState('')
  const [phoneError,setPhoneError] = useState('')
  const [bioError, setBioError] = useState('')
  const [addressError, setAddressError] = useState('');
  const [countryError,setCountryError] = useState('')
  const [cityError, setCityError] = useState('');
  const [dobError,setDobError] = useState('')
  const [access, setAccess] = useState('');
  const [userId, currentUserId] = useState('')
  const [image, setImage] = useState(null);
  const [imageView, setImageView] = useState(null);
  const [coverPicImageView, setICoverPicImageView] = useState(null);
  const [CoverPic, setCoverPicImage] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const cursorStyle = isEditMode ? { cursor: 'pointer' } : { cursor: 'default' };
  const fetchUserDetailss = async () => {
    dispatch(userView()); };
    const handleInputChange = (event) => {
      handleInputChangee(event,setName, setEmail, setBio, setDob, setCity,setSelectedCountry,setPhoneNumber /* add other state setters here */);  };
  const cancelUpload = () => {
    setImage(null);
    setImageView(null);
    fileInputRef.current.value = null; };
  const cancelUploadCover = () => {
    setICoverPicImageView(null);
    setCoverPicImage(null);
    fileInputRef.current.value = null;};
    
    const getCurrentDate = () => {
      const today = new Date();     const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;   };
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const decodedToken = jwt_decode(accessToken);
      const decryptedId = decodedToken.id;
      currentUserId(decryptedId)
      fetchUserDetails(decryptedId);    }
  }, []);
  const dateObj = new Date(dob);
  const EditUser = async (id, data) => {
    try {
      const dob = moment(dateObj).format("DD/MM/YYYY");
      const formattedData = {
        userName: name, dob: dob, gender: gender, access: access,about: bio,city: city,country:selectedCountry,phone:phone
         };
      let firebaseImageUrl;
      if (image) {
        firebaseImageUrl = await uploadToFirebaseStorage();
        if (firebaseImageUrl) {
          formattedData.photo = firebaseImageUrl}}
      let firebaseImageUrlCoverImage;
      if (CoverPic) {
        firebaseImageUrlCoverImage = await uploadToFirebaseStorageCoverPicture();
        if (firebaseImageUrlCoverImage) {
          formattedData.coverPhoto = firebaseImageUrlCoverImage    }}
      const response = await editUser(id, formattedData);
      if (response.status === 200) {
        toggleEditMode();     fetchUserDetails(userId);  fetchUserDetailss()
        setTimeout(() => {
          Swal.fire({
            title: "Successfully Updated",        icon: "success",       timer: 2500,         showConfirmButton: false,     });
        }, 200);     }   } catch (er) {
      setLoadingProgress(10);  }}
  const fetchUserDetails = async (id) => {
    try {
      const response = await userVieww(id);
      setName(response.data.result.user.userName)
      setEmail(response.data.result.user.email)
      const formattedDate = formatDate(response.data.result.user.dob);    setDob(formattedDate);
    setGender(response.data.result.user.gender) ;   setBio(response.data.result.user.about)
      setCity(response.data.result.user.city);     setSelectedCountry(response.data.result.user.country)
      setAccess(response.data.result.user.access);  setImage(response.data.result.user.photo)
      setPhoneNumber(response.data.result.user.phone)
      setCoverPicImage(response.data.result.user.cover_photo)
    } catch (error) { return(error)} };
  const formatDate = (dateString) => {
    const dateParts = dateString.split('/');
    const year = dateParts[2];
    const month = dateParts[0].padStart(2, '0');
    const day = dateParts[1].padStart(2, '0');
    return `${year}-${day}-${month}`;};
  const toggleEditMode = () => {
    setIsEditMode((prevEditMode) => !prevEditMode);
    fetchUserDetails(userId)
    setNameError('');  setCityError('');  setEmailError('') ; setPhoneError('') ;setDobError('')
    setAddressError('');  setBioError('');    setImageView('');  setCountryError('');  setICoverPicImageView('') };
  const toggleSave = () => {
    setNameError('');  setCityError('');  setBioError('');  setCountryError('');  setEmailError('');  setAddressError('');setPhoneError('') ;setDobError()
    let isValid = true;
    if(!dob){setDobError('');
  }else if(dob > getCurrentDate()){ setDobError("The date of birth must be before or on the current date.");  isValid = false;}
    if (!name) {  setNameError('UserName required.');  isValid = false;
    } else if (name.length < 3 || name.length > 30) {  setNameError('Username must be between 3 and 30 characters.');  isValid = false;
    } else if (!/^(\S+\s)*\S+$/.test(name)) {    setNameError('Username must have one space between words.');  isValid = false;}
    if (!bio) {  setBioError('');
    } else if (bio.length > 200) { setBioError('About must not exceed 200 characters.'); isValid = false}
    if (!city) {     setCityError('');
    } else if (city.length > 50) { setCityError('City name must not exceed 50 characters.'); isValid = false  }
    if (!gender) {  setAddressError('Gender is required.');     isValid = false;  }
    if (phone && !/^\d{10,13}$/.test(phone)) {
      setPhoneError('Phone number must be between 10 and 13 digits.');
      isValid = false;   }   

    return isValid;};
  const handleClick = async () => {
    const isValid = toggleSave();
    if (isValid) {
      setLoading(true); // Set loading state to true
      setLoadingProgress(30);     try {
     await EditUser(userId);
        setLoadingProgress(100); // Complete the loading progress
        setLoading(false); // Set loading state to true
      } catch (error) {return(error) } } }
  const handleFileChange = (file, setImage, setImageView) => {
    const reader = new FileReader();
    let fileFormat = file.name.split(".");
    fileFormat = fileFormat[fileFormat.length - 1];
    fileFormat = fileFormat.toUpperCase();
    if (["image/jpeg", "image/png", "image/jpg"].includes(file.type) && ["JPG", "PNG", "JPEG"].includes(fileFormat)) {
      const fileSize = file.size / 1024 / 1024; // in MiB
      if (fileSize > 1) {
        Swal.fire("File size exceeds 1 MB", "", "error");
        return;
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => { setImage(file);  setImageView(reader.result);
        };}
    } else {
      Swal.fire("Please select a PNG, JPG, or JPEG file", "", "error");
      return;  } };
  const handleImageChange = (e) => {
    if (e?.target?.files[0]?.name) {
      const file = e.target.files[0];
      handleFileChange(file, setImage, setImageView);   }};
  const handleCoverPicChange = (e) => {
    if (e.target && e.target.files && e.target.files.length && e.target.files[0].name) {
      const file = e.target.files[0];
      handleFileChange(file, setCoverPicImage, setICoverPicImageView);
    }};
  const uploadToFirebaseStorage = async () => {
    if (image) {
      if (typeof image === 'string') {
        return image;
      } else {
        const storage = getStorage();
        const storageRef = ref(storage, image.name);
        try {
          const uploaded = await uploadBytes(storageRef, image, { contentType: image.type });
          if (uploaded) {
            return getDownloadURL(storageRef);
          } else {
            return false;          }
        } catch (error) {
          return false;      } }
    } else {
      const file = image;
      const storage = getStorage();
      const timestamp = new Date().getTime(); // Get the current timestamp
      const imageName = `ProfileImage/${userId}_${timestamp}_${file.name}`; // Generate a unique image name
      const storageRef = ref(storage, imageName);
      try {
        const uploaded = await uploadBytes(storageRef, image, { contentType: image.type });
        if (uploaded) {
          return getDownloadURL(storageRef);
        } else {
          return false;  }
      } catch (error) {
        return false;
      }  } };
  const uploadToFirebaseStorageCoverPicture = async () => {
    if (CoverPic) {
      if (typeof CoverPic === 'string') {
        return CoverPic;
      } else {
        const storage = getStorage();
        const storageRef = ref(storage, CoverPic.name);
        try {
          const uploaded = await uploadBytes(storageRef, CoverPic, { contentType: image.type });
          if (uploaded) {
            return getDownloadURL(storageRef);
          } 
        } catch (error) {
          return false;
        }  }
    } else {
      const file = CoverPic;
      const storage = getStorage();
      const timestamp = new Date().getTime(); // Get the current timestamp
      const imageName = `CoverImage/${userId}_${timestamp}_${file.name}`; // Generate a unique image name
      const storageRef = ref(storage, imageName);
      try {
        const uploaded = await uploadBytes(storageRef, image, { contentType: image.type });
        if (uploaded) {
          return getDownloadURL(storageRef);
       } else {
          return false;  }
      } catch (error) {
        return false;  }  }
  };
  return (
    <div className="container" style={{ borderRadius: '13px', overflowY: 'hidden' }}>
      <LoadingBar color="#00bb7d" progress={loadingProgress} />
      <div> {loading && <HexaLoader />}
        {isEditMode ? (
          <div>
            <button onClick={toggleEditMode}><CancelIcon /></button>
            <button onClick={handleClick}><SaveIcon /></button>
          </div>
        ) : (
          <Tooltip title="Edit Profile" arrow>
            <EditIcon style={{ float: 'right', cursor: 'pointer' }} onClick={toggleEditMode} />
          </Tooltip>
        )}
      </div>
      <h1 className="title">User Profile</h1>
      <div className="imageUpload">
        <div>
          <label htmlFor="profile-image" className="image-upload-label" style={cursorStyle}>
            <CloudUploadIcon className="upload-icon" />
            Upload Profile
          </label>
          <input id="profile-image" type="file" accept="image/*" onChange={handleImageChange} className="image-upload-input" disabled={!isEditMode} />
          {imageView && <img src={imageView} alt="Profile" className="uploaded-image" />}
          {imageView && (
            <Tooltip title="Cancel Upload" arrow>
              <IconButton color="secondary" onClick={cancelUpload}><CancelIcon /></IconButton>
            </Tooltip>
          )}
        </div>
        <div>
          <label htmlFor="cover-image" className="image-upload-label" style={cursorStyle}>
            <CloudUploadIcon className="upload-icon" />
            Upload Cover Image  </label>
          <input id="cover-image" type="file" accept="image/*" onChange={handleCoverPicChange} className="image-upload-input" disabled={!isEditMode} />
          {coverPicImageView && <img src={coverPicImageView} alt="Cover" className="uploaded-image" />}
          {coverPicImageView && (
            <Tooltip title="Cancel Upload" arrow>
              <IconButton color="secondary" onClick={cancelUploadCover}><CancelIcon /></IconButton>
            </Tooltip>
          )}
        </div>  </div>
      <div className="grid">
        <div className="form-group a">
          <label htmlFor="name">Name*</label>
          <input id="name" type="text" name="name" value={name} onChange={handleInputChange} disabled={!isEditMode} required />
          {nameError && <span className="error-message">{nameError}</span>}
        </div>
        <div className="form-group b">
          <label htmlFor="email">Email</label>
          <input id="email" style={{backgroundColor:'#e1dfdf'}} type="text" name="email" value={email} onChange={handleInputChange} disabled />
          {emailError && <span className="error-message">{emailError}</span>}
        </div>
        <div className="form-group email-group">
          <label htmlFor="email">City</label>
          <input id="email" type="text" name="city" value={city} onChange={handleInputChange} disabled={!isEditMode} />
          {cityError && <span className='error-message'>{cityError}</span>}
        </div> 
        <div className="form-gro country" style={{marginTop:'8%'}}>  <label htmlFor="email" style={{lineHeight:'29px',marginBottom:'10px'}}>Country</label>    
        <Autocomplete id="country-select-demo"  sx={{ width: 300 }}  options={countries}
disabled={!isEditMode}  autoHighlight   getOptionLabel={(option) => typeof option === 'object' ? option.label : option} value={selectedCountry}  onChange={(event, value) => setSelectedCountry(value.label)}  renderOption={(props, option) => (
    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
      <img        loading="lazy"  width="20"  alt=""  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}  />      {option.label}
    </Box>  )}
  renderInput={(params) => (    <TextField  {...params}      error={!!countryError}  helperText={countryError}
      inputProps={{    ...params.inputProps,  style: { height: 14, width: 240, marginLeft: 1, textDecoration: 'none' },
      }}
      defaultValue={selectedCountry ? selectedCountry.label : ''} // Set default value
  />  )}/>
        </div>
        <div className="textarea-group">
          <label htmlFor="bio">About</label>
          <textarea id="bio" name="bio" value={bio} onChange={handleInputChange} disabled={!isEditMode} />
          {bioError && <span className='error-message'>{bioError}</span>}
        </div>
        <div className='form-group number'>
  <label htmlFor="phone">Phone Number</label>
          <input id="phone" type="number" name="phone" value={phone} onChange={handleInputChange} disabled={!isEditMode} />
        {phoneError && <span className="error-message">{phoneError}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of birth*</label>
          <input id="dob" type="date" name="dob" value={dob}   max={getCurrentDate()} onChange={handleInputChange} disabled={!isEditMode} />
          {dobError && <span className="error-message">{dobError}</span>}
        </div>
        <div className="form-groupw" style={{ marginTop: '34px' }}>
          <label htmlFor="gender" style={{color: '#374151',lineHeight:'19px'}}>Gender*</label>
          <FormControl fullWidth>
            <Select labelId="demo-simple-select-label" label="" value={gender} onChange={(event) => setGender(event.target.value)} inputProps={{ name: "gender", required: true }} disabled={!isEditMode}>
              <MenuItem value="1">Male</MenuItem>
              <MenuItem value="2">Female</MenuItem>
            </Select>
          </FormControl>
          {addressError && <span className="error-message">{addressError}</span>}
        </div>
        <div className="form-group" style={{ marginTop: '%' }}>
          <label htmlFor="gender">Access Control</label>
          <FormControl fullWidth>
            <Select labelId="demo-simple-select-label" label="" value={access} onChange={(event) => setAccess(event.target.value)} inputProps={{ name: "access", required: true }} disabled={!isEditMode}>
              <MenuItem value="1">Public</MenuItem>
              <MenuItem value="0">Private</MenuItem>
            </Select>
          </FormControl>
          {addressError && <span className="error-message">{addressError}</span>}
        </div>     </div>
    </div>);
};
export default EditProfile;