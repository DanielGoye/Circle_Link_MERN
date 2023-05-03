import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Box, useMediaQuery } from "@mui/material";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import FriendListWidget from "../widgets/FriendListWidget";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  useEffect(() => {
    if (!user) router.replace("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const userDetails = useSelector((state) => state.user);
  const { _id, picturePath } =
    userDetails !== null ? userDetails : { _id: "", picturePath: "" };
  if (!router.query.userId) {
    return null;
  }
  return (
    <Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="1.5rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "30%" : undefined}>
          <UserWidget userId={router.query.userId} picturePath={picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={router.query.userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "43%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {user._id === router.query.userId && (
            <MyPostWidget picturePath={picturePath} />
          )}
          <PostsWidget userId={router.query.userId} isProfile={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
