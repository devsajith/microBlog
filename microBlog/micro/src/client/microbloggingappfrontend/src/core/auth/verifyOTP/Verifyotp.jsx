import React, { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import styles from "./verifyotp.module.css";
import { useForm } from "react-hook-form";
import bg from "../../../assets/image/changepassword.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { forgotPasswordRequest, vrifyotp } from "../../../Service/userService";
import Swal from "sweetalert2";
import OtpInput from "react-otp-input";
import CommonButton from "../../../components/buttons/buttons";
import staticStrings from "../../../constants/ststic";

const Verifyotp = () => {
  const { handleSubmit } = useForm();
  const navigate = useNavigate();
  const [otp, setOtp] = useState();
  const [otpError, setOtpError] = useState();
  const location = useLocation();
  const [tempToken, setTempToken] = useState(location?.state?.tempToken);
  const handleChange = (newValue) => {
    setOtp(newValue);
    if (newValue?.length === 4) {
      setOtpError();
    } else if (newValue?.length === 0) {
      setOtpError("Otp is required");
    } else {
      setOtpError("Enter a valid Otp");
    }
  };
  const onFormSubmit = (e) => {
    e.preventDefault();
    if (otp?.length === 4) {
      const datas = {
        otp: otp,
        tempToken: tempToken,
      };
      vrifyotp(datas)
        .then((response) => {
          const tempToken = response?.data?.tempToken;
          navigate("/resetpassword", { state: { tempToken: tempToken } });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: staticStrings.invalidOtp,
          });
        });
    } else if (!otp) {
      setOtpError(staticStrings.otpRequired);
    } else if (otp.length < 4) {
      setOtpError(staticStrings.enterValidOtp);
    }
  };
  const email = location?.state?.data;
  const resendOtp = () => {
    forgotPasswordRequest(email)
      .then((response) => {
        setTempToken(response?.data?.tempToken);
        Swal.fire({
          title: staticStrings.otpsendMessage,
          icon: staticStrings.success,
          timer: 2500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        if (error?.response?.data?.erroCode === 2210) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: staticStrings.tooSoonMessage,
          });
        }
      });
  };
  useEffect(() => {}, [tempToken]);
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
              <h1 className={styles.Heading}> OTP</h1>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.message}>
                  <label
                    htmlFor="otp"
                    style={{ visibility: "hidden" }}
                    className={styles.usernameMargin}
                  >
                    <FaUserAlt />
                  </label>
                  <div className={styles.formsdiv}>
                    <OtpInput
                      value={otp}
                      isInputNum={true}
                      onChange={handleChange}
                      numInputs={4}
                      separator={<span>&nbsp;&nbsp;</span>}
                      inputStyle={{
                        width: 50,
                        height: 50,
                        borderRadius: "5px",
                      }}
                    />
                    <p style={{ color: "red" }}>&nbsp; {otpError}</p>
                  </div>
                </div>
                <CommonButton
                  onClick={onFormSubmit}
                  buttonText={"Verify OTP"}
                />
                <div className={styles.forgot}>
                  {" "}
                  <span className={styles.resend} onClick={resendOtp}>
                    Resend OTP?
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Verifyotp;
