'use client'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import '../../../common.css'
import AdminFooter from '../../Components/AdminFooter/AdminFooter'
import BaseAPI from '@/app/BaseAPI/BaseAPI'
import axios from 'axios'
import Cookies from 'js-cookie'
import Select from 'react-select'
import AdminLayout from '../../AdminLayout'
import { useRouter } from 'next/navigation'
import RecruitmentProcessComponent from '../../Components/Elements/RecruitmentProcessComponent'

const Page = () => {
  const [userData, setUserData] = useState({
    job_title: '',
    category: '',
    job_description: '',
    industry: '',
    work_type: '',
    experience: '',
    qualification: '',
    annual_salary: '',
    skill: '',
    designation: ''
  })

  const [errors, setErrors] = useState({
    job_title: '',
    category: '',
    job_description: '',
    industry: '',
    work_type: '',
    experience: '',
    qualiofication: '',
    annual_salary: '',
    skill: '',
    designation: ''
  })

  const [categoryData, setCategoryData] = useState([])
  const [industryData, setIndustryData] = useState([])
  const [worktypeData, setWorktypeData] = useState([])
  const [experienceData, setExperienceData] = useState([])
  const [qualificationData, setQualificationData] = useState([])
  const [annualsalaryData, setAnnualsalaryData] = useState([])
  const [skillData, setSkillData] = useState([])
  const [designationData, setDesignationData] = useState([])

  const [sidebarDisplay, setSidebarDisplay] = useState(false)
  const [loading, setLoading] = useState(false)

  const token = Cookies.get('token')
  const router = useRouter()

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
    try {
      const response = await axios.post(BaseAPI + '/admin/jobs/postjob', null, {
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer' + ' ' + token
        }
      })
      console.log(response.data.response)
      setCategoryData(response.data.response.category)
      setIndustryData(response.data.response.industry)
      setWorktypeData(response.data.response.worktype)
      setExperienceData(response.data.response.experience)
      setQualificationData(response.data.response.qualification)
      setAnnualsalaryData(response.data.response.annual_salary)
      setSkillData(response.data.response.skill)
      setDesignationData(response.data.response.designation)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const [selectedSkills, setSelectedSkills] = useState([])

  const [skillValidationError, setSkillValidationError] = useState('')

  const handleSkillChange = selectedOptions => {
    setSelectedSkills(selectedOptions) // Update selected skills

    // console.log(selectedOptions);

    // Check if selectedOptions is not empty
    // if (selectedOptions.length > 0) {
    //   setSkillValidationError(""); // Clear the error message
    // } else {
    //   setSkillValidationError("Skill is required");
    // }
  }

  const handleClick = async e => {
    e.preventDefault()
    try {
      const newErrors = {}

      if (userData.job_title === '') {
        newErrors.job_title = 'Job Title is required'
      }
      if (userData.category === '') {
        newErrors.category = 'Category is required'
      }
      if (userData.job_description === '') {
        newErrors.job_description = 'Job Description is required'
      }
      if (userData.industry === '') {
        newErrors.industry = 'Industry name is required'
      }
      if (userData.work_type === '') {
        newErrors.work_type = 'Work type is required'
      }
      if (userData.experience === '') {
        newErrors.experience = 'Experience is required'
      }
      if (userData.annual_salary === '') {
        newErrors.annual_salary = 'Annual salary is required'
      }
      // if (userData.skill === '') {
      //   newErrors.skill = 'Skill is required'
      // }
      if (userData.designation === '') {
        newErrors.designation = 'Designation is required'
      }

      console.log('here')
      setErrors(newErrors)

      if (Object.keys(newErrors).length === 0) {
        const confirmationResult = await Swal.fire({
          title: 'Post Job?',
          text: 'Do you want to post this job?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        })
        if (confirmationResult.isConfirmed) {
          setLoading(true)
          const response = await axios.post(
            BaseAPI + '/admin/jobs/postjob',
            userData,
            {
              headers: {
                'Content-Type': 'application/json',
                // key: ApiKey,
                Authorization: 'Bearer' + ' ' + token
                // adminid: adminID,
              }
            }
          )
          setLoading(false)
          if (response.data.status === 200) {
            Swal.fire({
              title: 'Job posted successfully!',
              icon: 'success',
              confirmButtonText: 'Close'
            })
            router.push('/admin/jobs')
            // window.scrollTo(0, 0);
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
        text: 'Could not post job. Please try after some time.',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  }
  return (
    <>
      <AdminLayout>
      {loading && (
        <div className="loader-container">
          
        </div>
      )}
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
              <div className='flex gap-2 items-center  '>
                <i class='fa fa-suitcase'></i>
                <span>Post Jobs</span>
              </div>
            </div>
          </div>

          <div className='JobPost'>
            <h2>Post Job</h2>
            <div className='row addJobBodyParts'>
              <div className='col-md-6 addJobLeftSection py-3'>
                <div className='bg-white p-3 rounded-md'>
                  <div className='border-b-2 '>
                    <h3 className=' ml-2 text-2xl'>Suggestion</h3>
                  </div>
                  <div className='row p-3'>
                    <div className='col-lg-12 col-md-6'>
                      <div className='my-1'>
                        <button className='btn btn-info btn-Jobs  sm:w-72 md:w-52 lg:w-96 md:ml-10  sm:ml-0 '>
                          Job Details
                        </button>
                      </div>
                    </div>
                    <div className='col-md-12 col-md-6'>
                      <div className='my-1'>
                        <button className='btn btn-success btn-Salary  sm:w-72 md:w-52 lg:w-96 md:ml-10 sm:ml-0 '>
                          Requirement and salary
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bg-white my-10 p-3 rounded-md '>
                  <div className='border-b-2'>
                    <h3 className='text-2xl ml-2'>Custom Section</h3>
                  </div>
                  <div className='py-3'>
                    <div className='row p-3'>
                      <div className='col-md-12'>
                        <button className='btn btn-warning btn-custom md:w-52 sm:w-72 lg:w-96 md:ml-10 sm:ml-0 '>
                          Add Custom Section
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-md-6 addJobRightSection  px-3 py-3'>
                <form>
                  <div className='bg-white py-3 px-3 rounded-md '>
                    <div className='rightSectionHeading border-b-2  py-2 text-xl'>
                      Job Details
                    </div>
                    <div class='mb-3 mt-3'>
                      <label for='exampleInputEmail1' class='form-label'>
                        Job Title <span className='Manadorty'>*</span>
                      </label>
                      <input
                        type='email'
                        class='form-control'
                        id='exampleInputEmail1'
                        aria-describedby='emailHelp'
                        placeholder='Job Title'
                        name='job_title'
                        value={userData.job_title}
                        onChange={handleChange}
                      />
                      {errors.job_title && (
                        <div className='text-danger'>{errors.job_title}</div>
                      )}
                    </div>
                    <label for='exampleInputEmail1' class='form-label'>
                      Select Category
                    </label>
                    <select
                      class='form-select'
                      aria-label='Default select example'
                      onChange={handleChange}
                      name='category'
                      value={userData.category}
                    >
                      <option selected value=''>
                        Any Category
                      </option>
                      {categoryData &&
                        categoryData.map(i => {
                          return  <option key={i.id} value={i.id}>{i.category_name}</option>
                        })}
                    </select>
                    {errors.category && (
                      <div className='text-danger'>{errors.category}</div>
                    )}
                    <div class='mb-3 mt-3'>
                      <label for='exampleInputEmail1' class='form-label'>
                        Job Description <span className='Manadorty'>*</span>
                      </label>
                      <textarea
                        type='email'
                        class='form-control'
                        id='exampleInputEmail1'
                        aria-describedby='emailHelp'
                        rows='7'
                        placeholder='Job Description'
                        value={userData.job_description}
                        onChange={handleChange}
                        name='job_description'
                      />
                      {errors.job_description && (
                        <div className='text-danger'>
                          {errors.job_description}
                        </div>
                      )}
                    </div>
                    <div class='mb-3 mt-3'>
                      <label for='exampleInputEmail1' class='form-label'>
                        Industry
                      </label>
                      <select
                        class='form-select'
                        aria-label='Default select example'
                        name='industry'
                        value={userData.industry}
                        onChange={handleChange}
                      >
                        <option selected value=''>
                          Select
                        </option>
                        {industryData &&
                          industryData.map(i => {
                            return (
                              <option key={i.id} value={i.id}>{i.industry_name}</option>
                            )
                          })}
                      </select>
                      {errors.industry_name && (
                        <div className='text-danger'>
                          {errors.industry_name}
                        </div>
                      )}
                    </div>
                    <div class='mb-3 mt-3'>
                      <label for='exampleInputEmail1' class='form-label'>
                        Work Type
                      </label>
                      <select
                        class='form-select'
                        aria-label='Default select example'
                        name='work_type'
                        value={userData.work_type}
                        onChange={handleChange}
                      >
                        <option selected value=''>
                          Select
                        </option>
                        {Object.entries(worktypeData).map(([key, value]) => {
                          return <option key={key} value={key}>{value}</option>
                        })}
                      </select>
                      {errors.work_type && (
                        <div className='text-danger'>{errors.work_type}</div>
                      )}
                    </div>
                  </div>
                  <div className='bg-white py-3 px-3 my-4 rounded-md '>
                    <div className='rightSectionHeading border-b-2  py-2 text-xl'>
                      Requirements and Salary Details
                    </div>
                    <div class='mb-3 mt-3'>
                      <label for='exampleInputEmail1' class='form-label'>
                        Experience <span className='Manadorty'>*</span>
                      </label>
                      <select
                        class='form-select'
                        aria-label='Default select example'
                        name='experience'
                        value={userData.experience}
                        onChange={handleChange}
                      >
                        <option selected value=''>
                          Select
                        </option>
                        {Object.entries(experienceData).map(([key, value]) => {
                          return <option key={key} value={key}>{value}</option>
                        })}
                      </select>
                      {errors.experience && (
                        <div className='text-danger'>{errors.experience}</div>
                      )}
                    </div>
                    <label for='exampleInputEmail1' class='form-label'>
                      Qualifiacation <span className='Manadorty'>*</span>
                    </label>
                    <select
                      class='form-select'
                      aria-label='Default select example'
                      name='qualification'
                      value={userData.qualification}
                      onChange={handleChange}
                    >
                      <option selected value=''>
                        Select
                      </option>
                      {qualificationData &&
                        qualificationData.map(i => {
                          return (
                            <option key={i.id} value={i.id}>{i.qualification_name}</option>
                          )
                        })}
                    </select>
                    {errors.qualification && (
                      <div className='text-danger'>{errors.qualification}</div>
                    )}

                    <div class='mb-3 mt-3'>
                      <label for='exampleInputEmail1' class='form-label'>
                        Annual Salary <span className='Manadorty'>*</span>
                      </label>
                      <select
                        class='form-select'
                        aria-label='Default select example'
                        name='annual_salary'
                        value={userData.annual_salary}
                        onChange={handleChange}
                      >
                        <option selected value=''>
                          Select
                        </option>
                        {Object.entries(annualsalaryData).map(
                          ([key, value]) => {
                            return <option key={key} value={key}>{value}</option>
                          }
                        )}
                      </select>
                      {errors.annual_salary && (
                        <div className='text-danger'>
                          {errors.annual_salary}
                        </div>
                      )}
                    </div>
                    <div class='mb-3 mt-3'>
                      <label for='exampleInputEmail1' class='form-label'>
                        Skills
                      </label>
                      <Select
                        // defaultValue={[colourOptions[2], colouptions[3]]}
                        isMulti
                        isSearchable
                        name='skill'
                        options={skillData.map(i => ({
                          value: i.id,
                          label: i.skill_name
                        }))}
                        className='basic-multi-select'
                        value={selectedSkills}
                        classNamePrefix='Select Skills'
                        onChange={handleSkillChange}
                      />
                      {/* <input
                        type='text'
                        class='form-control'
                        id='exampleInputEmail1'
                        aria-describedby='emailHelp'
                        placeholder='Enter Skills'
                        name='skill'
                        
                        value={userData.skill}
                        onChange={handleChange}
                      /> */}
                    </div>
                    <div class='mb-3 mt-3'>
                      <label for='exampleInputEmail1' class='form-label'>
                        Designation
                      </label>
                      <select
                        class='form-select'
                        aria-label='Default select example'
                        name='designation'
                        value={userData.designation}
                        onChange={handleChange}
                      >
                        <option selected value=''>
                          Select
                        </option>
                        {designationData &&
                          designationData.map(i => {
                            return <option key={i.id} value={i.id}>{i.skill_name}</option>
                          })}
                      </select>
                      {errors.designation && (
                        <div className='text-danger'>{errors.designation}</div>
                      )}
                    </div>
                  </div>
                  <div className='flex gap-3 items-center'>
                    <button className='btn btn-success btn-Addskills'>
                      <i class='fa-solid fa-plus'></i>
                      Add Skills
                    </button>
                    <button className='btn btn-success btn-Addskills'>
                      <i class='fa-solid fa-plus'></i>
                      Add Designations
                    </button>
                  </div>

                  <div className='bg-white py-3 px-3 my-4 rounded-md '>
                    {/* <div className='rightSectionHeading border-b-2  py-2 text-xl'>
                      Define Recruitment Process
                      <p className='text-sm mb-2'>
                        Please select and define the recruitment process by drag
                        and dropping the button from below mentioned process.
                      </p>
                    </div>
                    <div class='mb-3 mt-3 flex flex-wrap gap-3'>
                      <div>
                        <button className='btn btn-primary btn-Recuriment'>
                          HR Screening
                        </button>
                        <p className='text-center'>1</p>
                      </div>

                      <div>
                        <button className='btn btn-primary btn-Recuriment'>
                          PHP Technical Interview
                        </button>
                        <p className='text-center'>2</p>
                      </div>
                      <div>
                        <button className='btn btn-primary btn-Recuriment'>
                          Final Round
                        </button>
                        <p className='text-center'>3</p>
                      </div>
                      <div>
                        <button className='btn btn-primary btn-Recuriment'>
                          Short List Resume
                        </button>
                        <p className='text-center'>4</p>
                      </div>
                      <div>
                        <button className='btn btn-primary btn-Recuriment'>
                          L1 Technical Round
                        </button>
                        <p className='text-center'>5</p>
                      </div>
                    </div> */}

                    {/* <RecruitmentProcessComponent /> */}
                  </div>
                  <div className=''>
                    <button
                      className='btn btn-primary btn-Submit'
                      onClick={handleClick}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <AdminFooter />
      </AdminLayout>
    </>
  )
}

export default Page
