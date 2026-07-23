import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/";

const Login = ({ onLogin }) => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [isRegister, setIsRegister] = useState(false);

    const submit = async () => {
        const endpoint = isRegister ? "register" : "login";
        const res = await fetch(API + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        // const data=await res.json();
        if (!res.ok) {
            const errorData = await res.json();
            toast.error(errorData.message); // This will display a popup saying: "User already exists"
            return;
        }
        const errorData = await res.json();
        // alert('Registration successful!');
        if (isRegister) {
            toast.success("Registered! Now log in.");
            setIsRegister(false);
        } else {
            localStorage.setItem("token", errorData.token);       // save the token
            localStorage.setItem("username", errorData.username);
            toast.success("Logged in!");
            onLogin();                                        // tell App we're logged in
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                closeOnClick
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                theme="light"
            />
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size[14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-purple-700 opacity-20 blur-[100px]"></div></div>
            <div className="flex flex-col items-center justify-center min-h-[88.2vh] gap-4">
                <h1 className="text-3xl font-bold text-purple-600">{isRegister ? "Register" : "Login"}</h1>
                <input className="border p-2 rounded-full px-4 w-72" placeholder="Username"
                    value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                <input type="password" className="border p-2 rounded-full px-4 w-72" placeholder="Password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button onClick={submit} className="bg-purple-500 text-white px-6 py-2 rounded-full font-bold disabled:bg-purple-400" disabled={form.username.trim().length < 3 && form.password.trim().length < 3}>
                    {isRegister ? "Register" : "Login"}
                </button>
                <p className="cursor-pointer text-purple-600" onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? "Already have an account? Login" : "New here? Register"}
                </p>
            </div>
        </>
    );
};

export default Login;