import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUser, LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";

const SelectUsers = ({ selectedUsers, setSelectUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      console.log("All users from API:", response.data);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  // console.log("Assigning users:", tempSelectedUsers);

  const handleAssign = () => {
    setSelectUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };
  const selectedUsersAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);
  useEffect(() => {
    getAllUsers();
  }, []);
  // console.log("Avatars passed to AvatarGroup:", selectedUsersAvatars);
  useEffect(() => {
    // console.log("selectedUsers in parent:", selectedUsers);
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }
    return () => {};
  }, [selectedUsers]);
  // console.log("selectedUsers:", selectedUsers);

  return (
    <div className="space-y-4 mt-2">
      {selectedUsersAvatars.length === 0 && (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" /> Add Member
        </button>
      )}
      {selectedUsersAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUsersAvatars} maxVisible={10} />
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto ">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-200 "
            >
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full bg-cover bg-center"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {" "}
                  {user.name}{" "}
                </p>
                <p className="text-[13px] text-gray-500"> {user.email} </p>
              </div>
              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
