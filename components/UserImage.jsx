/* eslint-disable @next/next/no-img-element */
import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`${process.env.NEXT_PUBLIC_API}/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
