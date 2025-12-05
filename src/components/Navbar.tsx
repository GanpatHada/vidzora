import React from 'react'
import Logo from '../assets/vidzora_max.svg'
import { IoMdSearch } from 'react-icons/io'

const Navbar:React.FC = () => {
  return (
    <nav className='bg-zinc-800 text-white py-3 px-6 flex justify-between align-middle'>
      <ul className=''>
        <li className=' flex'>
            <button><img className='h-9' src={Logo} alt="" /></button>
        </li>
      </ul>
      <ul className='flex gap-8'>
        <li className=' flex'>
            <button className='text-2xl hover:text-blue-500 cursor-pointer '><IoMdSearch /></button>
        </li>
        <li className=' flex'>
            <button className='px-2 hover:text-blue-500 cursor-pointer '>Login</button>
        </li>
       
      </ul>
    </nav>
  )
}

export default Navbar
