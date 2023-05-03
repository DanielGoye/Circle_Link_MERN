import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../redux/index";
import axios from "axios";
import { useRouter } from "next/router";

const FriendListWidget = ({ userId }) => {
  const path = useRouter().asPath;
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    try {
      const response = await axios(
        `${process.env.NEXT_PUBLIC_API}/api/users/${userId}/friends`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { data } = response;
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    getFriends();
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
