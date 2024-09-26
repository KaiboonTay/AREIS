import "./login.css";

const Login = () => {
  return (
    <div className="bg flex justify-center items-center flex-col relative">
      <div className="mb-48">
        <img src="/logoLogin.png" alt="" />
      </div>
      <div className="absolute top-[50%] flex flex-col justify-center text-center items-center">
        <h2 className="font-bold text-[24px] shadow-slate-500">Sign In</h2>
        <p className="mb-4">Enter your UoN email to sign in</p>
        <div className="w-[400px] mt-[14px] flex flex-col justify-center items-center">
          <div className="w-full">
            <input
              className="w-full pl-2 rounded-lg h-[40px] mb-4"
              type="text"
              placeholder="email@oun.edu.au"
              name=""
              id=""
            />
          </div>
          <div className="w-full">
            <button className="w-full bg-black text-white rounded-lg h-[40px]">
              Sign in with email
            </button>
          </div>
        </div>
        <p className="w-[400px] mt-2 text-gray-500 text-[14px]">
          By clicking continue, you agree to our <span className="text-black">Terms of Service</span> and <span className="text-black">Privacy
          Policy</span> 
        </p>
      </div>
    </div>
  );
};

export default Login;
