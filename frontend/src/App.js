import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";

function App() {
    return (
        <>
            <Router>
                <div className="container">
                    <Routes>
                        <Route exact path="/" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                        <Route exact path="/signup" element={<Signup />} />
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default App;
