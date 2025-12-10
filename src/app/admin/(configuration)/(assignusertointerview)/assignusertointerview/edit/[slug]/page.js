'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import '../../../../../../common.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import AdminFooter from '@/app/admin/Components/AdminFooter/AdminFooter'
import BaseAPI from '@/app/BaseAPI/BaseAPI'
import Cookies from 'js-cookie'
import AdminLayout from '../../../../../AdminLayout'

const Page = ({ params }) => {
  const [processData, setProcessData] = useState([])
  const [userDetails, setUserDetails] = useState([])

  const router = useRouter()

  const [userData, setUserData] = useState({
    process_id: '',
    user_id: ''
  })
  const [pageData, setPageData] = useState()
  const token = Cookies.get('token')

  const [errors, setErrors] = useState({
    process_id: '',
    user_id: ''
  })
  const [loading, setLoading] = useState(false)

  const id = params.slug
  // console.log(id)

  const [sidebarDisplay, setSidebarDisplay] = useState(false)
  const handleSidebarDisplay = () => {
    setSidebarDisplay(!sidebarDisplay)
  }

  const getData = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        BaseAPI + `/admin/assignusertoprocess/edit/${id}`,
        null, // Pass null as the request body if not required
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + ' ' + token
            // key: ApiKey,
            // token: tokenKey,
            // adminid: adminID,
          }
        }
      )
      // console.log("object")
      setLoading(false)
      setPageData(response.data.response.existingData)

      setProcessData(response.data.response.processes)
      setUserDetails(response.data.response.users)

      console.log(processData)
    } catch (error) {
      setLoading(false)
      console.log('Cannot get plans data at APmanageplans')
    }
  }
  useEffect(() => {
    getData()
    window.scrollTo(0, 0)
    // eslint-disable-next-line
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
    // setUserData(prevData => ({
    //     ...prevData,
    //     process_id: response.data.response.process_id || "", // Set to empty string if null
    //   }));

    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }
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
          title: 'Update?',
          text: 'Do you want to update Interview Staus ?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        })
        if (confirmationResult.isConfirmed) {
          setLoading(true)
          const response = await axios.post(
            BaseAPI + `/admin/assignusertoprocess/edit/${slug}`,
            userData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer' + ' ' + token
                // key: ApiKey,
                // token: tokenKey,
                // adminid: adminID,
              }
            }
          )
          setLoading(false)
          if (response.data.status === 200) {
            Swal.fire({
              title: 'Interview Staus updated successfully!',
              icon: 'success',
              confirmButtonText: 'Close'
            })

            // window.scrollTo(0, 0);
            router.push('/admin/assignusertointerview')
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
        text: 'Could not update Interview Staus',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }

  return (
    <>
      <AdminLayout>
      {loading && <div className="loader-container"></div>}
        <div className='adminChangeUsername' style={{ minHeight: '80vh' }}>
          <div className='breadCumb1' role=''>
            <div className='flex gap-3 items-center'>
              <Link underline='hover' color='inherit' href='/admin/dashboard'>
                <div className='flex gap-2 items-center'>
                  <i className='fa-solid fa-gauge '></i>
                  <span>
                    Dashboard <i class='fa-solid fa-angles-right text-xs'></i>
                  </span>
                </div>
              </Link>
              <Link
                href='/admin/assignusertointerview'
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
                <i class='fa-solid fa-plus'></i>
                <span> Edit Assigned process</span>
              </div>
            </div>
          </div>
          <div className=''>
            <div className='userProcesss'>
              <h4>Edit Assigned Process</h4>
            </div>
            <div className='interviewPreviewTable'>
              <div className='processHeading'>
                <h5>Assign Process Details:</h5>
              </div>

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
                        {/* {processData.map((i) => {
                          return(
                            <option value={i.id}>{i.process_name}</option>
                          )
                        })} */}

                        {processData &&
                          processData.map(i => (
                            <option key={i.id} value={i.id}>
                              {i.process_name}
                            </option>
                          ))}
                      </select>
                      {errors.process_id && (
                        <div className='text-danger'>{errors.process_id}</div>
                      )}
                    </div>
                    <div className='col-lg-2 col-md-2 col-sm-2 cControllabel md-mt-0 mt-3'>
                      Select User
                    </div>
                    <div className='col-lg-10 col-md-10 col-sm-10'>
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
                        {/* {userDetails.map((i) => {
                          return(
                            <option value={i.id}>{i.first_name}{" "}{i.last_name}</option>
                          )
                        })} */}

                        {userDetails &&
                          userDetails.map(i => (
                            <option key={i.id} value={i.id}>
                              {i.first_name}
                              {''} {i.last_name}
                            </option>
                          ))}
                      </select>
                      {errors.user_id && (
                        <div className='text-danger'>{errors.user_id}</div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className='buttonBottom'>
              <button
                className='btn btn-success btn-Successs'
                onClick={handleClick}
              >
                Save
              </button>
              <Link
                href='/admin/assignusertointerview'
                className='btn btn-danger btn-Activateee'
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  )
}

export default Page
