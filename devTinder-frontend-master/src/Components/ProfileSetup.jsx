import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../utils/userSlice";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

const DEFAULT_PHOTO = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const ProfileSetup = () => {
  const user = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ----- FORM STATE -----
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [photo, setPhoto] = useState(DEFAULT_PHOTO);

  // ----- UI STATE -----
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load user data ONCE
  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setAge(user.age || "");
    setGender(user.gender || "");
    setAbout(user.about || "");
    setSkills((user.skills || []).join(", "));
    setPhoto(user.photoURL || DEFAULT_PHOTO);
  }, []);

  // ---------- IMAGE UPLOAD ----------
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "devTinder_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dv9tkd7zc/image/upload",
        { method: "POST", body: fd }
      );

      const data = await res.json();
      console.log("Cloudinary →", data);

      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      // Show preview instantly
      setPhoto(data.secure_url);

      // Save image to backend
      const resp = await api.patch("/user/update-photo", {
        photoURL: data.secure_url,
      });

      // Update Redux (photo only)
      dispatch(updateUser({ photoURL: resp.data.user.photoURL }));
    } catch (err) {
      console.error("UPLOAD ERROR →", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ---------- SAVE FULL PROFILE ----------
  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const payload = {
        firstName,
        lastName,
        age: age ? Number(age) : undefined,
        gender,
        about,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        photoURL: photo,
      };

      const resp = await api.patch("/user/update", payload);

      dispatch(updateUser(resp.data.user));

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Login first…
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
        {/* ===== FORM ===== */}
        <div className="bg-base-300 p-6 rounded-lg shadow space-y-4">
          <input
            className="input input-bordered w-full"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            className="input input-bordered w-full"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <div className="flex gap-4">
            <input
              type="number"
              min="18"
              className="input input-bordered w-full"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <select
              className="select select-bordered w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Others</option>
            </select>
          </div>

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="About"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />

          <input
            className="input input-bordered w-full"
            placeholder="Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          {/* IMAGE UPLOAD */}
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleFileChange}
          />

          {uploading && <p>Uploading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <button
            className={`btn btn-primary ${saving ? "loading" : ""}`}
            onClick={handleSave}
          >
            Save & Continue
          </button>
        </div>

        {/* ===== PREVIEW ===== */}
        <div className="bg-base-100 p-6 rounded-lg shadow flex flex-col items-center">
          <img
            src={photo || DEFAULT_PHOTO}
            className="w-40 h-40 rounded-full border mb-4 object-cover"
          />

          <h2 className="text-lg font-bold">
            {firstName} {lastName}
          </h2>

          <p>{user.emailId}</p>

          <p className="mt-3">{about}</p>

          <p>
            {age && `${age} yrs`} {gender && `• ${gender}`}
          </p>

          <div className="mt-3 flex gap-2 flex-wrap">
            {skills.split(",").map(
              (s, i) =>
                s.trim() && (
                  <span key={i} className="badge badge-outline">
                    {s.trim()}
                  </span>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
