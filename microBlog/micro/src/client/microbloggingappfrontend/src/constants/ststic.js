/* eslint-disable no-useless-escape */
const staticStrings = {
  patternForNewPassword:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^\&*\)\(+=._-])(?=.*[0-9])(?=.{8,20}$)[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/,
  emailPattern:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  passwordSuccess: "Password changed successfully",
  success: "success",
  titleName: "MICROBLOGGING SITE",
  changePassword: "Change Password",
  currewntPassword: "Current Password",
  newPassword: "New Password",
  confirmPassword: "Confirm Password",
  curentpasswordRequired: "Current Password is required",
  newPasswordRequired: "New Password is required",
  newPasswordNotSame: "Current password and new password cannot be same.",
  newPasswordValidation:
    "Enter a valid 8-20 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character.",
  confirmPasswordRequired: "Confirm password is required",
  passwordMissmatch: "Password mismatch",
  otpsendMessage: "OTP sent via email. Check it out!",
  tooSoonMessage: "Requested Too Soon!",
  invalidUser: "Invalid User!",
  emailRequired: "Email is required",
  emailValidation: "Please enter a valid email",
  invalidOtp: "Invalid OTP!",
  otpRequired: "Otp is required",
  enterValidOtp: "Enter a valid Otp",
  passwordResetSuccess: "Password Reset Successful",
  timeOut: "Time Out!",
};
export default staticStrings;
