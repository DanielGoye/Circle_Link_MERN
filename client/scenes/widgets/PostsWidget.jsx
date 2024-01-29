import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../redux/index";
import PostWidget from "./PostWidget";
import axios from "axios";
import { useRouter } from "next/router";

const PostsWidget = ({ userId, isProfile = false }) => {
  const path = useRouter().asPath;
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await axios(`${process.env.NEXT_PUBLIC_API}/api/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await axios(
      `${process.env.NEXT_PUBLIC_API}/api/posts/${userId}/posts`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = response.data;
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
