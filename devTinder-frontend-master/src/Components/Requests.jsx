import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import api from "../utils/axios"; // centralized axios instance

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/user/requests/recieved");
      dispatch(addRequests(res.data.connectionRequests || []));
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      await api.post(`/request/review/${status}/${_id}`);
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error("Error reviewing request:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return <p className="text-center mt-20">Loading...</p>;
  if (requests.length === 0)
    return (
      <h1 className="flex justify-center text-2xl my-10 text-green-300">
        No Requests found
      </h1>
    );

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-3xl text-pink-400 p-4">
        Requests ({requests.length})
      </h1>
      {requests.map(({ _id, fromUserId }) => {
        const { firstName, lastName, photoURL, age, gender, about } =
          fromUserId;

        return (
          <div
            key={_id}
            className="flex justify-between items-center m-2 p-2 rounded-lg bg-base-300 w-2/3 mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-14 h-14 rounded-full object-contain"
                src={photoURL}
              />
            </div>
            <div className="text-left m-4 p-4">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + " " + gender}</p>}
              <p>{about}</p>
            </div>
            <div>
              <button
                className="btn btn-secondary mx-2"
                onClick={() => reviewRequest("accepted", _id)}
              >
                Accept
              </button>
              <button
                className="btn btn-primary mx-2"
                onClick={() => reviewRequest("rejected", _id)}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
