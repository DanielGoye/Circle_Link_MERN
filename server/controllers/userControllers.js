const { User } = require("../models/user");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => {
        return User.findById(id);
      })
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const addRemoveFriend = async (req, res) => {
  const { id, friendId } = req.params;
  const user = await User.findById(id);
  const friend = await User.findById(friendId);

  if (user.friends.includes(friendId)) {
    user.friends = user.friends.filter((id) => {
      return id !== friendId;
    });
    friend.friends = friend.friends.filter((id) => {
      return id !== id;
    });
  } else {
    user.friends.push(friendId);
    friend.friends.push(id);
  }
  await user.save();
  await friend.save();
  const friends = await Promise.all(
    user.friends.map((id) => {
      return User.findById(id);
    })
  );
  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    }
  );
  res.status(200).json(formattedFriends);
};

module.exports = { getUser, getUserFriends, addRemoveFriend };
