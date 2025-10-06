"use client";

import GoogleButton from "apps/user-ui/src/shared/components/google-button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  password: string;
};
const Signup = () => {
  const [passwardVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showOtp, setShowOtp] = useState(true);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {};

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow numeric input

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // If((not the last box)) Move to the next input if a digit is entered
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // if Backspace is pressed + (the current box is empty) + (not the first box)
    // Move to the previous input
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = () => {}

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
        Signup
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Signup
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-3xl">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Signup to Zyra
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Already have an account?{" "}
            <Link href={"/login"} className="text-blue-500">
              Login
            </Link>
          </p>
          <GoogleButton />
          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">or Sign up with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {!showOtp ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="zyra shop"
                className="w-full p-2 border border-gray-300 outline-0 rounded mb-1"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm ">{errors.email.message}</p>
              )}

              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full p-2 border border-gray-300 outline-0 rounded mb-1"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm ">{errors.email.message}</p>
              )}

              <label className="block text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={passwardVisible ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className="w-full p-2 border border-gray-300 outline-0 rounded mb-1"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwardVisible)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                >
                  {passwardVisible ? <Eye /> : <EyeOff />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm ">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-lg cursor-pointer mt-4 bg-black text-white py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Signup
              </button>
              {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
              )}
            </form>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-center mb-4">
                Enter OTP
              </h3>
              <div className="flex justify-center gap-6">
                {otp?.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-300 rounded outline-none"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
              <button className="w-full mt4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded">
                Verify OTP
              </button>
              <p className="text-center text-sm mt4">
                {canResend ? (
                  <button onClick={resendOtp} className="text-blue-500 cursor-pointer">Resend OTP</button>
                ) : (
                  `Resend OTP in ${timer} seconds`
                )}
              </p>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
