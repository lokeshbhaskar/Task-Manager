import Task from "../models/Task.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

//  Get all users ( admin only)
//@route  Get  /api/users
//@access Private(admin)

const getUsers = async (req, res) => {
  try {
    let userFilter = {};

    // Allow admin to see all users
    if (req.user.role !== "admin") {
      // Optional: filter out admin users for regular users
      userFilter = { role: { $ne: "admin" } };
    }
    // const users = await User.find({ role: "admin" }).select("-password");
     const users = await User.find(userFilter).select("-password");
    // add task counts to each other
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );
    res.json(usersWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//  Get userById
// Get /api/users/:id
// private

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export { getUsers, getUserById };
