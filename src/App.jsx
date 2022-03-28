import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Landing from "./pages/Landing/Landing";
import Profiles from "./pages/Profiles/Profiles";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import * as authService from "./services/authService";
import CreateBusiness from "./pages/CreateBusiness/CreateBusiness";
import * as businessService from "./services/businessService";
import BusinessDetails from "./pages/BusinessDetails/BusinessDetails";

const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const [businesses, setBusinesses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      businessService
        .getAll()
        .then((allBusinesses) => setBusinesses(allBusinesses));
    }
  }, [user]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/");
  };

  const handleSignupOrLogin = () => {
    setUser(authService.getUser());
  };

  useEffect(() => {
    if (user) {
      businessService
        .getAll()
        .then((allBusinesses) => setBusinesses(allBusinesses));
    }
  }, [user]);

  const handleAddBusiness = async (newBusinessData) => {
    const newBusiness = await businessService.create(newBusinessData);
    setBusinesses([...businesses, newBusiness]);
    navigate("/");
  };

  const handleDeleteBusiness = (id) => {
    businessService
      .deleteOne(id)
      .then((deletedBusiness) =>
        setBusinesses(
          businesses.filter((business) => business._id !== deletedBusiness._id)
        )
      );
  };

  const handleUpdateBusiness = (updatedBusinessData) => {
    businessService.update(updatedBusinessData).then((updatedBusiness) => {
      const newBusinessesArray = businesses.map((business) =>
        business._id === updatedBusiness._id ? updatedBusiness : business
      );
      setBusinesses(newBusinessesArray);
      navigate("/");
    });
  };

  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={<Landing user={user} businesses={businesses} />}
        />

        <Route
          path="/signup"
          element={<Signup handleSignupOrLogin={handleSignupOrLogin} />}
        />
        <Route
          path="/login"
          element={<Login handleSignupOrLogin={handleSignupOrLogin} />}
        />
        <Route
          path="/profiles"
          element={user ? <Profiles /> : <Navigate to="/login" />}
        />
        <Route
          path="/changePassword"
          element={
            user ? (
              <ChangePassword handleSignupOrLogin={handleSignupOrLogin} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/create"
          element={
            user ? (
              <CreateBusiness handleAddBusiness={handleAddBusiness} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <Landing
                handleDeleteBusiness={handleDeleteBusiness}
                businesses={businesses}
                user={user}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
        <Route
          path="/edit"
          element={<EditBusiness handleUpdateBusiness={handleUpdateBusiness} />}/>
         <Route> path="/business-details" element={<BusinessDetails/>}
        />
      </Routes>
    </>
  );
};

export default App;
