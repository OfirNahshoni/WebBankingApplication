// frontend/src/App.jsx

import HomePage from '../components/Home'
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Dashboard from '../components/User/Dashboard';
import Transfer from '../components/User/Transfer';
import Signup from '../components/Home/Signup';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/user" element={<Dashboard />} />
                <Route path="/transfer" element={<Transfer />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
