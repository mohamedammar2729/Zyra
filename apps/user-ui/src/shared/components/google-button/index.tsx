import * as React from "react";

const GoogleButton = (props: any) => {
  return (
    <div className="w-full flex justify-center">
      <div className="h-[46px] cursor-pointer border border-blue-100 flex items-center gap-2 px-3 rounded my-2 bg-[rgba(210,227,252,0.3)]">
        <svg
          width={30}
          height={30}
          viewBox="0 0 0.6 0.6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          {...props}
        >
          <path
            fill="#4285F4"
            d="M0.559 0.306c0 -0.018 -0.001 -0.036 -0.005 -0.053h-0.249v0.101h0.143a0.121 0.121 0 0 1 -0.053 0.08v0.066h0.085c0.05 -0.046 0.079 -0.113 0.079 -0.193"
          />
          <path
            fill="#34A853"
            d="M0.305 0.563c0.071 0 0.131 -0.023 0.175 -0.063l-0.085 -0.066c-0.024 0.016 -0.054 0.025 -0.09 0.025 -0.069 0 -0.127 -0.046 -0.148 -0.108H0.069v0.068A0.264 0.264 0 0 0 0.305 0.563"
          />
          <path
            fill="#FBBC04"
            d="M0.157 0.35a0.156 0.156 0 0 1 0 -0.101V0.182H0.069a0.261 0.261 0 0 0 0 0.236z"
          />
          <path
            fill="#EA4335"
            d="M0.305 0.141a0.144 0.144 0 0 1 0.101 0.039l0.075 -0.075a0.255 0.255 0 0 0 -0.177 -0.068 0.264 0.264 0 0 0 -0.236 0.145L0.157 0.25c0.021 -0.062 0.079 -0.108 0.148 -0.108z"
          />
        </svg>
        <span className="text-[16px] opacity-[0.8] font-Poppins">
          Sign In With Google
        </span>
      </div>
    </div>
  );
};
export default GoogleButton;
