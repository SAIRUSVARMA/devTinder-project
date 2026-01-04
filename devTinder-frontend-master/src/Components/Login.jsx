import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const DEFAULT_PHOTO =
  "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg";

const Login = () => {
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // LOGIN
  const handleLogin = async () => {
    setError("");
    try {
      setLoading(true);

      const res = await api.post("/login", { emailId, password });

      dispatch(addUser(res.data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP
  const handleSignUp = async () => {
    setError("");

    if (!firstName || !lastName || !emailId || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/signup", {
        firstName,
        lastName,
        emailId,
        password,
        photoURL: DEFAULT_PHOTO,
      });

      dispatch(addUser(res.data.user));

      navigate("/profile-setup");
    } catch (err) {
      setError(err.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-500 pt-24">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login" : "Signup"}
          </h2>

          {!isLoginForm && (
            <>
              <label className="form-control w-full max-w-xs my-2">
                <span className="label-text">Firstname</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>

              <label className="form-control w-full max-w-xs my-2">
                <span className="label-text">Lastname</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
            </>
          )}

          <label className="form-control w-full max-w-xs my-2">
            <span className="label-text">Email</span>
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </label>

          <label className="form-control w-full max-w-xs my-2">
            <span className="label-text">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </label>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <div className="card-actions justify-center mt-2">
            <button
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              onClick={isLoginForm ? handleLogin : handleSignUp}
              disabled={loading}
            >
              {loading ? "Please wait..." : isLoginForm ? "Login" : "Signup"}
            </button>
          </div>

          <p
            className="text-center cursor-pointer py-2"
            onClick={() => setIsLoginForm((v) => !v)}
          >
            {isLoginForm
              ? "New user? Signup here"
              : "Existing user? Login here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
