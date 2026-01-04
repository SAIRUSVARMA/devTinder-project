import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../utils/userSlice";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom"; // ⭐ ADD THIS

const DEFAULT_PHOTO =
  "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg";

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ⭐ ADD THIS

  // ---------- FORM STATE ----------
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoURL, setPhotoURL] = useState(DEFAULT_PHOTO);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");

  // ---------- UI STATE ----------
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --------- LOAD EXISTING VALUES ----------
  useEffect(() => {
    if (!user) return;

    setFirstname(user.firstName || "");
    setLastName(user.lastName || "");
    setPhotoURL(user.photoURL || DEFAULT_PHOTO);
    setAge(user.age || "");
    setGender(user.gender || "");
    setAbout(user.about || "");
    setSkills(user.skills?.join(", ") || "");
  }, [user]);

  // ---------- IMAGE UPLOAD ----------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setPhotoURL(data.secure_url);
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ---------- SAVE ----------
  const saveProfile = async () => {
    setError("");

    try {
      const res = await api.patch("/user/update", {
        firstName,
        lastName,
        photoURL,
        age,
        gender,
        about,
        skills,
      });

      dispatch(updateUser(res.data.user));

      setShowToast(true);

      setTimeout(
        () => navigate("/profile", { replace: true }),
        setShowToast(false),
        800
      );
    } catch (err) {
      setError(err.response?.data || "Save failed");
    }
  };

  if (!user) return <h3 className="text-center mt-20">Loading...</h3>;

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="flex justify-center mx-10">
          <div className="card bg-base-300 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>

              <label className="form-control my-2">
                <span>First Name</span>
                <input
                  className="input input-bordered"
                  value={firstName}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </label>

              <label className="form-control my-2">
                <span>Last Name</span>
                <input
                  className="input input-bordered"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>

              <label className="form-control my-2">
                <span>Profile Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered"
                />

                {photoURL && (
                  <img src={photoURL} className="w-24 h-24 rounded-full mt-2" />
                )}
              </label>

              <label className="form-control my-2">
                <span>Age</span>
                <input
                  value={age}
                  className="input input-bordered"
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>

              <label className="form-control my-2">
                <span>Gender</span>
                <input
                  value={gender}
                  className="input input-bordered"
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>

              <label className="form-control my-2">
                <span>Skills</span>
                <input
                  value={skills}
                  className="input input-bordered"
                  onChange={(e) => setSkills(e.target.value)}
                />
                <small>(comma separated)</small>
              </label>

              <label className="form-control my-2">
                <span>About</span>
                <textarea
                  className="textarea textarea-bordered"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </label>

              <p className="text-red-500 text-center">{error}</p>

              <button
                className="btn btn-primary"
                onClick={saveProfile}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>

        <UserCard
          user={{
            firstName,
            lastName,
            photoURL,
            about,
            age,
            gender,
            skills: skills.split(",").map((s) => s.trim()),
          }}
        />
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile updated</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
