import React from 'react'

const Navbar = ({ loggedIn, username, onLogout }) => {
  return (
    <nav className='bg-purple-600 flex justify-between items-center px-16 h-16 text-white'>
      <div className="logo font-bold"><a href="/">&lt;iPass/&gt;</a></div>
      {/* <ul>
            <li className='flex gap-4'>
                <a className='hover:font-bold' href="\">Home</a>
                <a className='hover:font-bold' href="#">About</a>
                <a className='hover:font-bold' href="\">Contact Us</a>
            </li>
        </ul> */}
      <div className="flex items-center justify-center gap-2">

        {loggedIn ? (
          <>
            <span className='text-sm hidden sm:inline'>Welcome,{username}</span>
            <button
              onClick={onLogout}
              className='bg-purple-50 text-purple-600 font-bold rounded-full px-5 py-2 hover:bg-purple-100'>
              Logout
            </button>
          </>
        ) : (
          <button
            className='bg-purple-50 text-purple-600 font-bold rounded-full px-6 py-2 hover:bg-purple-100'>
            <a href="/login">Log In</a>
          </button>
        )}
        <a href="https://github.com/lohiyascode" target="_blank">
          <button className='bg-purple-100 my-5 mx-2 rounded-full flex  justify-between items-center ring-white ring-1'>

            <img className='w-10 p-1' src="/icons/github.svg" alt="github logo" />
            <span className='font-bold px-2 text-purple-600'>GitHub</span>
          </button>
        </a>
      </div>
    </nav>
  )
}

export default Navbar