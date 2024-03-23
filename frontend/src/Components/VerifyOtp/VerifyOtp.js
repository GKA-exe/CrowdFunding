import React from 'react'
import {useForm} from 'react-hook-form'
import './VerifyOtp.css'
function VerifyOtp(){

let {register,handleSubmit,formState:{errors}} = useForm()

async function handleOtpVerification(otpObj){
    console.log(otpObj)
}

  return (
   <div className='otp-parent'>
        <div className='otp-form-container w-25 mx-auto mt-5 mb-5 '>
        <div className='container w-50 mt-2  mb-5'>
            <form onSubmit={handleSubmit(handleOtpVerification)}>
            
                <div className='otp-field'>
                <label className='form-label fs-3 text-white text-center'>Enter OTP</label>
                {errors.otp?.type==='required' && <p className='lead fs-6 text-center text-warning form-text'>OTP is required</p>}
                {errors.otp?.type==='minLength' && <p className='lead fs-6 text-center text-warning form-text'>OTP should have 6 characters</p>}
                {errors.otp?.type==='maxLength' && <p className='lead fs-6 text-center text-warning form-text'>OTP should have 6 characters</p>}

                    <input type="number" className='form-control mt-2 mb-3' placeholder='otp' {...register('otp',{required:true,minLength:6,maxLength:6})} />
                </div>
                <button className='btn btn-primary'>Verify</button>
                
            </form>
        </div>
        </div>
   </div>
  )
}

export default VerifyOtp