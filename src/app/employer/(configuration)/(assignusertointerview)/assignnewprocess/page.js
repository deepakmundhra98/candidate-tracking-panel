'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import AdminFooter from '@/app/admin/Components/AdminFooter/AdminFooter'
import BaseAPI from '@/app/BaseAPI/BaseAPI'
import axios from 'axios'
import Cookies from 'js-cookie'
import EmployerLayout from '../../../EmployerLayout'

const Page = () => {
  const [userData, setUserData] = useState({
    process_id: '',
    user_id: ''
  })
  const router = useRouter()
  const token = Cookies.get("tokenEmployer");
  const [errors, setErrors] = useState({
    process_id: '',
    user_id: ''
  })
  const [processData, setProcessData] = useState([])
  const [userDetails, setUserDetails] = useState([])

  const [loading, setLoading] = useState(false)

  const [sidebarDisplay, setSidebarDisplay] = useState(false)


  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay)
  }

  const handleChange = e => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))

    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        BaseAPI + '/admin/assignusertoprocess/add',
        null,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + ' ' + token
          }
        }
      )
   

      setLoading(false)
      // setUserData (response.data.response.userData)
      setUserDetails(response.data.response.users)
      setProcessData(response.data.response.processes)
    } catch (error) {
      setLoading(false)

      console.log(error.message)
    }
  }

  useEffect(() => {
    getData()
  }, [])
  const handleClick = async () => {
    try {
      const newErrors = {}

      if (userData.process_id === '') {
        newErrors.process_id = 'Please select a process'
      }
      if (userData.user_id === '') {
        newErrors.user_id = 'Please select a user'
      }

      setErrors(newErrors)

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: 'Assign?',
          text: 'Do you want to assign this process?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        })
        if (confirmationResult.isConfirmed) {
          setLoading(true)
          const response = await axios.post(
            BaseAPI + '/admin/assignusertoprocess/add',
            userData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer' + ' ' + token
                
              }
            }
          )

          setLoading(false)
          if (response.data.status === 200) {
            Swal.fire({
              title: 'User assigned to process successfully!',
              icon: 'success',
              confirmButtonText: 'Close'
            }).then(() => {
              router.push('/employer/assignusertointerview')
            })

            window.scrollTo(0, 0)
          } else if (response.data.status === 500) {
            Swal.fire({
              title: response.data.message,
              icon: 'error',
              confirmButtonText: 'Close'
            })
          } else {
            Swal.fire({
              title: response.data.message,
              icon: 'error',
              confirmButtonText: 'Close'
            })
          }
        }
      }
    } catch (error) {
      //   setLoading(false);
      Swal.fire({
        title: 'Failed',
        text: 'Could not add assign process',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }
  return (
    <>
      <EmployerLayout>
      {loading && <div className="loader-container"></div>}
        <div className='adminChangeUsername' style={{ minHeight: '80vh' }}>
          <div className='breadCumb1' role=''>
            <div className='flex gap-3 items-center'>
              <Link underline='hover' color='inherit' href='/employer/dashboard'>
                <div className='flex gap-2 items-center'>
                  <i className='fa-solid fa-gauge '></i>
                  <span>
                    Dashboard <i class='fa-solid fa-angles-right text-xs'></i>
                  </span>
                </div>
              </Link>
              <Link
                              underline="hover"
                              color="inherit"
                              href="/employer/configuration"
                            >
                              <div className="flex gap-2 items-center justify-center">
                                <i className="fa fa-gears"></i>
                                <span>
                                  Configuration{" "}
                                  <i class="fa-solid fa-angles-right text-xs"></i>
                                </span>
                              </div>
                            </Link>
              <Link
                href='/employer/assignusertointerview'
                className='flex gap-2 items-center  '
              >
                <i class='fa-solid fa-list'></i>
                <span>
                  {' '}
                  Assign Users to interview{' '}
                  <i class='fa-solid fa-angles-right text-xs'></i>
                </span>
              </Link>
              <div className='flex gap-2 items-center  '>
                <i class='fa-solid fa-add'></i>
                <span> Assign New Process</span>
              </div>
            </div>
          </div>
          <div className=''>
            <div className='interviewPreviewTable'>
              <div className='userSelected'>
                <form action=''>
                  <div className='row'>
                    <div className='col-lg-2 col-md-2 col-sm-2 cControllabel mb-md-4 mb-0'>
                      Select Process
                    </div>
                    <div className='col-lg-10 col-md-10 col-sm-10'>
                      <select
                        className='form-select shadow-none'
                        aria-label=''
                        name='process_id'
                        value={userData.process_id}
                        onChange={handleChange}
                      >
                        <option value='' selected>
                          Select Process
                        </option>
                        {processData.map(i => {
                          return (
                            <option key={i.id} value={i.id}>
                              {i.process_name}
                            </option>
                          )
                        })}
                      </select>
                      {errors.process_id && (
                        <div className='text-danger'>{errors.process_id}</div>
                      )}
                    </div>
                    <div className='col-lg-2 col-md-2 col-sm-2 cControllabel md-mt-0 mt-3'>
                      Select User
                    </div>
                    <div className='col-lg-10 col-md-10 col-sm-10 pt-2'>
                      <select
                        className='form-select shadow-none'
                        aria-label=''
                        name='user_id'
                        value={userData.user_id}
                        onChange={handleChange}
                      >
                        <option value='' selected>
                          Select User
                        </option>
                        {userDetails.map(i => {
                          return (
                            <option key={i.id} value={i.id}>
                              {i.first_name} {i.last_name}
                            </option>
                          )
                        })}
                      </select>
                      {errors.user_id && (
                        <div className='text-danger'>{errors.user_id}</div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
              <div className='buttonBottom'>
              <button
                className='btn button1'
                onClick={handleClick}
              >
                Save
              </button>
              <Link
                href='/employer/assignusertointerview'
                className='btn button2'
              >
                Cancel
              </Link>
            </div>
            </div>
            
          </div>
        </div>
        <AdminFooter />
      </EmployerLayout>
    </>
  )
}

export default Page
