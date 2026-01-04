import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });
      dispatch(addUser(response.data));
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      console.log("Error fetching user:", err);
    }
  };

  useEffect(() => {
    if (!user) fetchUser();
    // run only once ⬇⬇⬇
  }, []);

  return (
    <div>
      <Navbar />
      <div className="pt-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
