import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);
  const navigate =  useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    let profileImageUrl = ''
    if (!fullName) {
      setError("Please enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter email");
    }
    if (!password) {
      setError("Please enter password");
    }
    setError("");

    // handle Api call
    try {
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken
      });
      const { token, role } = response.data;
      if(token){
        localStorage.setItem("token",token)
        updateUser(response.data);
      }
      //redirect based on role
      if(role==='admin'){
        navigate('/admin/dashboard');
      }else{
        navigate('/user/dashboard');
      }

    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto mt-10 md:mt-0 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black ">Create an Account</h3>
        <p className="text-sm text-gray-800  mb-6">
          Join us by entering your details
        </p>
        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              placeholder="Lok"
              type="text"
            />
            <Input
              type="text"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@gmail.com"
            />
            <Input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Character"
            />
            <Input
              type="text"
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 Digit Code"
            />
            {error && <p className="text-red-500 text-xs pb-2.5 "> {error} </p>}
            <button
              type="submit"
              className="w-full bg-blue-300 px-5 py-3 rounded-md hover:text-amber-200 font-medium tracking-wide cursor-pointer "
            >
              SIGN UP
            </button>
            <p className="text-[14px] text-slate-800 mt-3 ">
              Allready have an account? <Link to="/login" className="text-primary" >Login</Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
