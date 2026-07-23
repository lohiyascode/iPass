import React, { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';


const Manager = () => {
  const ref = useRef()
  const passRef = useRef()
  const [form, setform] = useState({ site: "", username: "", password: "" })
  const [passwordArray, setPasswordArray] = useState([])
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const authHeaders = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

  const getPasswords = async () => {
    try {
      const req = await fetch(API, { headers: authHeaders });

      // token expired or invalid → log out
      if (req.status === 401) {
        localStorage.clear();
        window.location.reload();   // sends them back to the Login page
        return;
      }

      const passwords = await req.json();
      setPasswordArray(Array.isArray(passwords) ? passwords : []);   // guard against non-arrays
    } catch (err) {
      console.error("Failed to fetch passwords:", err);
      setPasswordArray([]);
    }
  };

  useEffect(() => {
    getPasswords()
    // let passwords = localStorage.getItem("passwords");
    // if (passwords) {
    //   setPasswordArray(JSON.parse(passwords))
    // }
  }, [])

  const copyText = (text) => {
    toast('Copied to clipboard!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text)
  }

  const showPassword = () => {
    passRef.current.type = "text"
    if (ref.current.src.includes("icons/eyecross.png")) {
      ref.current.src = "icons/eye.png"
      passRef.current.type = "password"
    }
    else {
      passRef.current.type = "text"
      ref.current.src = "icons/eyecross.png"
    }
  }

  const savepassword = async () => {
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
      const newId = form.id || uuidv4();
      const newEntry = { ...form, id: newId };
      if (form.id) {
        await fetch(API, { method: "DELETE", headers: authHeaders, body: JSON.stringify({ id: form.id }) });
      }
      setPasswordArray([...passwordArray, newEntry])
      await fetch(API, { method: "POST", headers: authHeaders, body: JSON.stringify(newEntry) })
      setform({ site: "", username: "", password: "" });

      // localStorage.setItem("passwords", JSON.stringify([...passwordArray,{...form,id:uuidv4()}]))
      // console.log([...passwordArray, form])
      toast('Password Saved', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        // transition: Bounce,
      });
    }
    else {
      toast('Error:Password Not Saved!')
    }
  }

  const deletePassword = async (id) => {
    console.log("Deleting password with id ", id)
    let c = confirm("Do you really want to delete this password?")
    if (c) {
      setPasswordArray(passwordArray.filter(item => item.id !== id))
      await fetch(API, { method: "DELETE", headers: authHeaders, body: JSON.stringify({ id }) })

      // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item=>item.id!==id))) 
      toast('Password Deleted!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

  }
  const editPassword = (id) => {

    console.log("Editing password with id ", id)
    setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
    setPasswordArray(passwordArray.filter(item => item.id !== id))

  }

  const handlechange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }
  const [revealed, setRevealed] = useState({});

  const toggleReveal = (id) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      // transition={Bounce}
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size[14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-purple-700 opacity-20 blur-[100px]"></div></div>
      <div className="p-2 mycontainer min-h-[88vh]">
        <h1 className='text-4xl text-center text-purple-400 font-bold'>&lt;iPass/&gt;</h1>
        <p className='text-center text-purple-500 text-lg'>Your Own Password Manager</p>
        <div className='text-black flex flex-col p-4 gap-5 items-center'>
          <input value={form.site} onChange={handlechange} className='bg-white rounded-full border border-purple-600 outline-purple-100 w-full p-4 py-1' type="text" placeholder='Enter Website URL' name='site' />
          <div className='flex flex-col md:flex-row w-full justify-between gap-4'>
            <input value={form.username} onChange={handlechange} className='bg-white rounded-full border border-purple-600 outline-purple-100 w-full p-4 py-1' type="text" placeholder='Enter Username' name='username' />
            <div className="relative">
              <input ref={passRef} value={form.password} onChange={handlechange} className='bg-white rounded-full border border-purple-600 outline-purple-100 w-full p-4 py-1' type="password" placeholder='Enter Password' name='password' />
              <span className='absolute right-0.75 top-1 cursor-pointer' onClick={showPassword}>
                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
              </span>
            </div>
          </div>
          <button onClick={savepassword} className='flex justify-center gap-2 items-center border border-purple-600 bg-purple-500 hover:bg-purple-400 rounded-full w-fit px-6 py-2'>
            <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover" ></lord-icon>
            Save
          </button>
        </div>
        <div className="passwords">
          <h2 className='font-bold text-2xl py-4 text-center'>Your Passwords</h2>
          {passwordArray.length === 0 && <div className='text-center'> No passwords to show</div>}
          {passwordArray.length != 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10">
            <thead className='bg-purple-600 text-white'>
              <tr>
                <th className='py-2'>Site</th>
                <th className='py-2'>Username</th>
                <th className='py-2'>Password</th>
                <th className='py-2'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-purple-100'>
              {passwordArray.map((item, index) => {
                return <tr key={item.id}>
                  <td className='py-2 border border-white text-center'>
                    <div className='flex items-center justify-center '>
                      <a href={item.site} target='_blank'>{item.site}</a>
                      <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.site) }}>
                        <lord-icon
                          style={{ "width": "25px", "height": "25px", "paddingTop": "2px", "paddingLeft": "2px" }}
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="hover" >
                        </lord-icon>
                      </div>
                    </div>
                  </td>
                  <td className='py-2 border border-white text-center'>
                    <div className='flex items-center justify-center '>
                      <span>{item.username}</span>
                      <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }}>
                        <lord-icon
                          style={{ "width": "25px", "height": "25px", "paddingTop": "2px", "paddingLeft": "2px" }}
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="hover" >
                        </lord-icon>
                      </div>
                    </div>
                  </td>
                  <td className='py-2 border border-white text-center'>
                    <div className='flex items-center justify-center '>
                      {/* <span>{"*".repeat(item.password.length)}</span> */}
                      <span>{revealed[item.id] ? item.password : "•".repeat(item.password.length)}</span>

                      {/* reveal / hide toggle */}
                      <span className='cursor-pointer text-lg' onClick={() => toggleReveal(item.id)}>
                        {revealed[item.id] ? "🙈" : "👁️"}
                      </span>
                      <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}>
                        <lord-icon
                          style={{ "width": "25px", "height": "25px", "paddingTop": "2px", "paddingLeft": "2px" }}
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="hover" >
                        </lord-icon>
                      </div>
                    </div>
                  </td>
                  <td className='justify-center py-2 border border-white text-center'>
                    <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                      <lord-icon
                        src="https://cdn.lordicon.com/gwlusjdu.json"
                        trigger="hover"
                        style={{ "width": "25px", "height": "25px" }}>
                      </lord-icon>
                    </span>
                    <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                      <lord-icon
                        src="https://cdn.lordicon.com/skkahier.json"
                        trigger="hover"
                        style={{ "width": "25px", "height": "25px" }}>
                      </lord-icon>
                    </span>
                  </td>
                </tr>

              })}
            </tbody>
          </table>}
        </div>
      </div>
    </>
  )
}

export default Manager