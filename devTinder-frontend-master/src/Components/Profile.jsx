import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DEFAULT_PHOTO = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!user) return <div className="flex justify-center mt-20">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card bg-base-300 shadow-xl p-6 w-96 flex flex-col items-center">
        <img
          src={user.photoURL || DEFAULT_PHOTO}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-3"
        />

        <h2 className="text-xl font-bold">
          {user.firstName} {user.lastName}
        </h2>

        <p className="text-gray-400">{user.emailId}</p>

        <p className="mt-3">{user.about || "No bio yet"}</p>

        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate("/profile-setup")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
