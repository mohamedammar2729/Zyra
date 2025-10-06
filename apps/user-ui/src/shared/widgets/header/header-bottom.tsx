"use client";
import CartIcon from "apps/user-ui/src/assets/svgs/cart-icon";
import HeartIcon from "apps/user-ui/src/assets/svgs/heart-icon";
import ProfileIcon from "apps/user-ui/src/assets/svgs/profile-icon";
import { navItems } from "apps/user-ui/src/configs/constants";
import { AlignLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Track the scroll position to toggle the sticky state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Adjust the value as needed
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    // Cleanup the event When the component is removed from the screen, stop listening to scroll events.
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg" : "relative"
      }`}
    >
      <div
        className={`w-[80%] relative m-auto flex items-center justify-between ${
          isSticky ? "pt-3" : "py-0"
        }`}
      >
        {/* All Dropsdown Menu */}
        <div
          className={`w-[260px] ${
            isSticky && "-mb-2"
          } cursor-pointer flex items-center rounded justify-between px-5 h-[50px] bg-[#3489ff]`}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="#fff" />
            <span className="text-white font-medium">All Departments</span>
          </div>
          <ChevronDown color="#fff" />
        </div>
        {/* Dropdown menu */}
        {show && (
          <div
            className={`absolute left-0 ${
              isSticky
                ? "top-[70px]"
                : "top-[50px] w-[260px] h-[400px] bg-[#f5f5f5]"
            }`}
          ></div>
        )}
        {/* Navigation Links */}
        <div className="flex items-center">
          {navItems.map((item: NavItemsTypes, index: number) => (
            <Link
              className="px-5 font-medium text-lg"
              href={item.href}
              key={index}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div>
          {isSticky && (
            <div className="flex items-center gap-8 pb-2">
              <div className="flex items-center gap-2">
                <Link
                  href={"/login"}
                  className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
                >
                  <ProfileIcon />
                </Link>
                <Link href={"/login"}>
                  <span className="block font-medium">Hello,</span>
                  <span className="font-semibold">Sign In</span>
                </Link>
              </div>
              <div className="flex items-center gap-5">
                <Link href={"/wishlist"} className="relative">
                  <HeartIcon />
                  <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-9px] right-[-10px]">
                    <span className="text-white font-medium text-sm">0</span>
                  </div>
                </Link>
                <Link href={"/cart"} className="relative">
                  <CartIcon />
                  <div className="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-9px] right-[-9px]">
                    <span className="text-white font-medium text-sm">0</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
