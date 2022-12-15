import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:9000/hotel/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: username,
                    password: password,
                }),
            });

            console.log(username);
            console.log(password);

            const data = await response.json();
            console.log(data);

            if (data.token !== undefined) {
                // Save the token in localstorage and use it
                localStorage.setItem("token", data.token);
                navigate("/home");
                console.log("Login Successful");
            } else {
                alert("Invalid Credentials");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="loginPage">
                <div className="loginWebName">Hotelier</div>
                <div className="loginContainer">
                    <div className="separator"></div>
                    <h1 className="loginHeading">Login</h1>
                    <form className="loginForm" onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label for="exampleInputEmail1" className="form-label">
                                Email address:
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="exampleInputEmail1"
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                }}
                            />
                            <div className="mb-3">
                                <label
                                    for="exampleInputPassword1"
                                    className="form-label"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="login_button1">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
