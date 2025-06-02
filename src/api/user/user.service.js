import UserModel from "./user.model.js";

export const updateUser = async (req, res) => {
  try {
    const id = req.params;
    const updates = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};

export const updateMe = async (req, res) => {
  try {
    const id = req.user.userId;
    const updates = req.body;
    console.log(req.user);

    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};

export const deleteMe = async (req, res) => {
  try {
    const id = req.user.userId;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const id = req.user.userId;
    const user = await UserModel.findById(id);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    throw new Error(error.message);
  }
};
