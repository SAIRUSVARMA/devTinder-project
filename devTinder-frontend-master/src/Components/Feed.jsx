import React, { useEffect } from "react";
import api from "../utils/axios"; // centralized axios instance
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    try {
      const response = await api.get("/user/feed");
      dispatch(addFeed(response.data)); // backend returns array
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, [feed]);

  if (!feed) return <p className="text-center mt-20">Loading...</p>;
  if (feed.length === 0)
    return (
      <h1 className="flex justify-center m-52 text-3xl">No more users!</h1>
    );

  return (
    <div className="flex flex-col items-center gap-4 my-5">
      {feed.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default Feed;
