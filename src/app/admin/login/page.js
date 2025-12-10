'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import '../../common.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Image from 'next/image'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Tooltip } from '@mui/material'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import BaseAPI from '@/app/BaseAPI/BaseAPI'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ReCAPTCHA from 'react-google-recaptcha'
import Recaptcha from '@/app/Components/Recaptcha/Recaptcha'

const Page = () => {
  const router = useRouter()
  const token = Cookies.get('token')
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    captcha: ''
  })
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
  const [constantsData, setConstantsData] = useState()
  const handleChange = e => {
    const { name, value } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }))
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
    if (isCaptchaVerified) {
      errors.captcha = ''
    }
  }

  const [loading, setLoading] = useState(false)

  let siteLogo = Cookies.get('siteLogo')
  // let captchaKey = Cookies.get("captchaKey");

  // const getSiteData = async () => {
  //   try {
  //     const response = await axios.get(BaseApi + "/getconstant");
  //     setPageChanges(response.data.response.site_logo);
  //   } catch (error) {
  //     console.log("Error getting navbar logo information!");
  //   }
  // };
  // useEffect(() => {
  //   if (token !== "") {
  //     router.back();
  //   }
  // }, []);

  const getData = async e => {
    e.preventDefault()
    try {
      const newErrors = {}

      if (loginData.email === '') {
        newErrors.email = 'Email is required'
        window.scrollTo(0, 0)
      } else if (!isValidEmail(loginData.email)) {
        newErrors.email = 'Email address format is not valid'
        window.scrollTo(0, 0)
      }
      if (loginData.password === '') {
        newErrors.password = 'Password is required'
        window.scrollTo(0, 0)
      }
      if (!isCaptchaVerified) {
        newErrors.captcha = 'Please verify reCaptcha'
      }

      setErrors(newErrors)

      // Function to validate email format
      function isValidEmail (email) {
        // Use a regular expression to validate email format
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        return emailPattern.test(email)
      }

      if (Object.keys(newErrors).length === 0) {
        if (isCaptchaVerified) {
          setLoading(true)
          // console.log("object")
          const response = await axios.post(BaseAPI + '/login', loginData)

          // console.log(response.data.response.message)

          let status = response.data.response.status

          setLoading(false)
          // console.log("Request sent successfully", response.data.status);
          if (status == 200 && response.data.response.token !== '') {
            // let userType = response.data.response.user.user_type

            let tokenFetch = response.data.response.token
            // console.log("hai")
            let fnameFetch = response.data.response.user.first_name
            // let usertypeFetch = response.data.response.user.user_type
            // console.log("object")
            // console.log('200 hit')

            // Storing data in sessionStorage
            // sessionStorage.setItem("token", tokenFetch);
            // sessionStorage.setItem("fname", fnameFetch);
            // sessionStorage.setItem("user_type", usertypeFetch);

            Cookies.set('token', tokenFetch)
            Cookies.set('fname', fnameFetch)
            Cookies.set('adminId', response.data.response.user.id);
            // Cookies.set('user_type', usertypeFetch)
            router.push('/admin/dashboard')
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: toast => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: 'Welcome' + ' ' + fnameFetch
            })
          }
          if (status === 500) {
            Swal.fire({
              title: response.data.response.message,
              icon: 'warning',
              timer: 3000,
              timerProgressBar: true
            })
          } else {
            console.log('Nothing works')
          }
        }
      }
    } catch (error) {
      setLoading(false)
      Swal.fire({
        title: 'Server Error',
        icon: 'error',
        confirmButtonText: 'Close'
      })
      console.log(error.message)
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const [captchaKey, setCaptchaKey] = useState('') // State to hold captcha key

  const fetchConstantsData = async () => {
    try {
      const response = await axios.post(BaseAPI + "/sendcredentials", null, {
        headers: {
          "content-type": "Application/json",
        },
      });

      setConstantsData(response.data.response); // Store the entire response data if needed
      const captchaKey = response.data.response.site_captcha_key;
      setCaptchaKey(captchaKey); // Set the captcha key in the state
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchConstantsData()
  }, [])

  return (
    <>
      <div className='container container-admin'>
        <div className='admin-login'>
          <div className='row'>
            <div className='col-lg-6 col-md-6 col-sm-12'>
              <div className='login'>
                <h2 className='new-signin-heading'>Administration Login</h2>
                <div className='login-wrap'>
                  <div className='login-input'>
                    <input
                      type='text'
                      className='form-control shadow-none'
                      id='staticEmail'
                      name='email'
                      placeholder='Email address'
                      value={loginData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className='text-danger'>{errors.email}</div>
                    )}
                  </div>
                  <div className='login-input'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className='form-control shadow-none'
                      id='inputPassword'
                      placeholder='Password'
                      name='password'
                      value={loginData.password}
                      onChange={handleChange}
                    />

                    <div className='passwordVisibility'>
                      <p
                        className='btn-primary'
                        type='button'
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <>
                            <Tooltip title='Hide Password'>
                              <VisibilityOffIcon />
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip title='View Password'>
                              <VisibilityIcon />
                            </Tooltip>
                          </>
                        )}
                      </p>
                    </div>
                    {errors.password && (
                      <div className='text-danger'>{errors.password}</div>
                    )}
                  </div>
                  <div className='loginCheckBox'>
                    <div className='checkbox-wrapper-30'>
                      <span className='checkbox'>
                        <input type='checkbox' />{' '}
                        <svg>
                          <use href='#checkbox-30' className='checkbox'></use>
                        </svg>
                      </span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        style={{ display: 'none' }}
                      >
                        <symbol id='checkbox-30' viewBox='0 0 22 22'>
                          <path
                            fill='none'
                            stroke='currentColor'
                            d='M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2'
                          />
                        </symbol>
                      </svg>
                      Remember Me
                    </div>
                    <div>
                    <Link href='/admin/forgetpassword' className='pull-right'>
                      Forgot Password?
                    </Link>
                    </div>
                 
                  </div>
                  <div className='reCaptchaLogin w-100'>
                    {captchaKey && (
                      <ReCAPTCHA
                        sitekey={captchaKey}
                        onChange={value => setIsCaptchaVerified(value)}
                      />
                    )}
                    {errors.captcha && (
                      <div className='text-danger CaptchaVerify'>
                        {errors.captcha}
                      </div>
                    )}
                  </div>
                  <button
                    className='btn btn-lg btn-block loginButton'
                    onClick={getData}
                  >
                    SIGN IN
                  </button>
                </div>
              </div>
            </div>
            <div className='col-lg-6 col-md-6 '>
              <div className='images-bg'></div>
            </div>
          </div>
        </div>

        <div class='powered_by'>
          <div class='powered_tital'>Powered by</div>
          <div class='powered_logo'>
            <Link href='/' target='_blank' className='flex justify-center'>
              <Image
                src='/Images/adminSide/logicspice-logo.png'
                alt='LS RMS'
                width={200}
                height={50}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
