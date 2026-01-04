import React from "react";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import api from "../utils/axios";

const DEFAULT_PHOTO = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();

  const {
    _id,
    firstName,
    lastName,
    age,
    gender,
    about,
    photoURL,
    skills = [],
  } = user;

  const handleSendRequest = async (status, userId) => {
    try {
      await api.post(`/request/send/${status}/${userId}`);
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  // always use array
  const normalizedSkills = Array.isArray(skills)
    ? skills
    : String(skills)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  return (
    <div className="card bg-base-300 w-96 shadow-xl p-3">
      <figure>
        <img
          src={photoURL || DEFAULT_PHOTO}
          alt={`${firstName}'s photo`}
          className="h-60 w-full object-cover"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>

        {(age || gender) && (
          <p>
            {age ? `${age}, ` : ""}
            {gender}
          </p>
        )}

        {about && <p>{about}</p>}

        {normalizedSkills.length > 0 && (
          <div>
            <h3 className="font-semibold">Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {normalizedSkills.map((skill, i) => (
                <span key={i} className="badge badge-outline">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-accent"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
