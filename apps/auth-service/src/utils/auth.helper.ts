import { ValidationError } from "@packages/error-handler";
import redis from "@packages/libs/redis";
import crypto from "crypto";
import { sendEmail } from "./sendMail";
import { NextFunction } from "express";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;
  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError("Missing required fields!");
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format!");
  }
};

// next It’s called when there’s an error, so the next middleware (error handler) can handle it.
export const checkOtpRestictions = async (
  email: string,
  next: NextFunction
) => {
  // if you enter wrong otp 3 times, you will be locked out for 30 minutes
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Account locked due to multiple failed attempts! Try again after 30 minutes."
      )
    );
  }

  // if you request otp more than 3 times in an hour, you will be locked out for 1 hour
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too many OTP requests! Please wait 1 hour before requesting again."
      )
    );
  }
  // if you requested an otp in the last 1 minute, you have to wait
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError("Please wait 1 minute before requesting another OTP.")
    );
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  // If otp request count more than 3 in the last 1 hour
  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600); // lock for 1 hour
    return next(
      new ValidationError(
        "Too many OTP requests! Please wait 1 hour before requesting again."
      )
    );
  }
  // Track otp requests
  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600); // expire in 1 hour
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString(); // Generate a 4-digit OTP
  // setOtpInRedis(email, otp) and Store OTP in Redis with an expiration time
  await sendEmail(email, "Verify Your Email", template, { name, otp });
  // key: `otp:${email}`, value: otp, expiration: 5 minutes
  await redis.set(`otp:${email}`, otp, "EX", 300);
  // Set a cooldown period to prevent multiple OTP requests in a short time
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60); // wait 60 sec to send another OTP
};

// verify otp
export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    throw new ValidationError("Invalid or Expired OTP.");
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  let failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");
  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800); // lock for 30 minutes
      await redis.del(`otp:${email}`, failedAttemptsKey); // reset failed attempts
      throw new ValidationError(
        "Account locked due to multiple failed attempts! Try again after 30 minutes."
      );
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 1800); // expire in 30 minutes
    throw new ValidationError(
      `Incorrect OTP. You have ${2 - failedAttempts} attempts left.`
    );
  }
  await redis.del(`otp:${email}`, failedAttemptsKey); // OTP is correct, remove it and reset failed attempts
};

