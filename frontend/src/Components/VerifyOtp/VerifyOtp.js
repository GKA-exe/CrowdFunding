import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./VerifyOtp.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyOtp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [err, setErr] = useState("");
  const userObj = useLocation().state;
  const navigate = useNavigate();

  async function handleOtpVerification(otpObj) {
    userObj.otp = otpObj.otp;

    const res = await axios.post(
      "http://localhost:5000/user/new-user",
      userObj
    );

    if (res.data.statusCode === 2) {
      navigate("/login");
    } else {
      setErr(res.data.message);
    }
  }

  return (
    <div className="otp-parent">
      <div className="otp-form-container w-25 mx-auto mt-5 mb-5 ">
        <div className="container w-50 mt-2  mb-5">
          <form onSubmit={handleSubmit(handleOtpVerification)}>
            <div className="otp-field">
              <label className="form-label fs-3 text-white text-center">
                Enter OTP
              </label>
              {errors.otp?.type === "required" && (
                <p className="lead fs-6 text-center text-warning form-text">
                  OTP is required
                </p>
              )}
              {errors.otp?.type === "minLength" && (
                <p className="lead fs-6 text-center text-warning form-text">
                  OTP should have 6 characters
                </p>
              )}
              {errors.otp?.type === "maxLength" && (
                <p className="lead fs-6 text-center text-warning form-text">
                  OTP should have 6 characters
                </p>
              )}

              <input
                type="number"
                className="form-control mt-2 mb-3"
                placeholder="OTP"
                {...register("otp", {
                  required: true,
                  minLength: 6,
                  maxLength: 6,
                })}
              />
              {err !== "" && <p className="lead fs-5 text-danger">{err}</p>}
            </div>
            <button className="btn btn-primary">Verify</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
