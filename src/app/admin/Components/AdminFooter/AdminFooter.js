import React from 'react'
import Link from "next/link";
import "../../../common.css"
import Image from "next/image"

const AdminFooter = () => {
  return (
    <div className="APFooter">
      <p className='mb-0'>Designed and Developed by <span className='flex justify-center'><Link href="https://www.logicspice.com/" target='_blank'><Image src="/Images/adminSide/logicspice-logo.png" width={200} height={50} className='footerLogo' alt="Footer-logo"  /></Link></span></p>
    </div>
  )
}

export default AdminFooter
