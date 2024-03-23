import React from "react";
import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

function Register() {
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleFormSubmit(userObj) {
    const res = await axios.post(
      "http://localhost:5000/user/new-user",
      userObj
    );

    if (res.data.statusCode === 12) {
      navigate("../login");
    } else {
      setErr(res.data.message);
    }
  }

  return (
    <div className="register-form mt-5">
      <div className="register-form-container mx-auto p-4 ">
        <h1 className="register-form-title text-center text-white mt-3">
          Register
        </h1>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/*Username*/}
          <div className="mb-4">
            <label className="form-label text-white">Username</label>
            <input
              className="register-form-input form-control"
              type="text"
              placeholder="Enter your username..."
              {...register("username", { required: true, minLength: 4 })}
            />
            {errors.username?.type === "required" && (
              <p className="form-text text-danger">Username is required </p>
            )}
            {errors.username?.type === "minLength" && (
              <p className="form-text text-danger">
                Username should have minimum 4 characters
              </p>
            )}
          </div>

          {/*Email*/}
          <div className="mb-4">
            <label className="form-label text-white">Email</label>
            <input
              className="form-control"
              type="email"
              placeholder="Enter your email..."
              {...register("email", { required: true })}
            />
            {errors.email?.type === "required" && (
              <p className="form-text text-danger">email is required </p>
            )}
          </div>

          {/*Password*/}
          <div className="mb-4">
            <label className="form-label text-white">Password</label>
            <input
              className="register-form-input form-control"
              type="password"
              placeholder="Enter your password..."
              {...register("password", { required: true, minLength: 4 })}
            />
            {errors.password?.type === "required" && (
              <p className="form-text text-danger">password is required </p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="form-text text-danger">
                password should have minimum 4 characters
              </p>
            )}
          </div>

          <button
            type="submit "
            className="registerButton btn btn-dark text-white"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
