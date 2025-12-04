import React, { useEffect, useRef, useState } from "react";
import { TextField, Button } from "@mui/material";
import { IoIosArrowForward, IoIosArrowRoundBack, IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import validator from "validator";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";

interface UserCredentialsProps {
  showOtpScreen: () => void;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const UserCredentials: React.FC<UserCredentialsProps> = ({ showOtpScreen, email, setEmail }) => {
  const [emailError, setEmailError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validator.isEmail(email.trim())) {
      setEmailError(true);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim() });
      if (error) {
        toast.error(error.message);
        return;
      }
      showOtpScreen();
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col flex-1 justify-between" onSubmit={handleSendOtp}>
      <div>
        <div className="relative">
          <TextField
            id="outlined-basic"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
            label="Enter your Email"
            variant="outlined"
            fullWidth
            size="medium"
            sx={{
              input: { color: "white", paddingRight: "3rem" },
              label: { color: emailError ? "red" : "#71717a" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: emailError ? "red" : "#52525b" },
                "&:hover fieldset": { borderColor: emailError ? "red" : "#52525b" },
                "&.Mui-focused fieldset": { borderColor: emailError ? "red" : "#71717a", borderWidth: "1px" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: emailError ? "red" : "#71717a" },
            }}
          />
          {email.trim().length > 0 && (
            <button
              type="button"
              onClick={() => {
                setEmail("");
                setEmailError(false);
              }}
              className="text-zinc-400 hover:text-white absolute text-2xl cursor-pointer top-4 right-4 rounded-full"
            >
              <IoMdClose />
            </button>
          )}
        </div>

        {emailError && <p className="text-red-500 text-xs mt-2">Invalid email, Please try again</p>}
        <p className="text-slate-400 text-xs mt-3">
          By proceeding, you confirm that you have read and agree to the Terms & Conditions and Privacy Policy.
        </p>
      </div>

      <Button
        variant="contained"
        type="submit"
        fullWidth
        disabled={emailError || loading}
        sx={{
          opacity: email.trim().length !== 0 ? 1 : 0,
          backgroundColor: "#3b82f6",
          transition: "0.2s ease-in-out",
          color: "white",
          "&:hover": { backgroundColor: "#2563eb", scale: "1.02" },
          "&:disabled": { backgroundColor: "#373737", color: "#838383" },
          paddingY: 0.75,
          fontSize: "1rem",
          textTransform: "none",
          fontWeight: "bold",
          height: "40px",
        }}
      >
        {!loading ? (
          <>
            <span>Get OTP</span>
            <IoIosArrowForward />
          </>
        ) : (
          <>Sending OTP &nbsp;<span className="loader"></span></>
        )}
      </Button>
    </form>
  );
};

interface OtpScreenProps {
  showUserCredential: () => void;
  email: string;
}

const OtpScreen: React.FC<OtpScreenProps> = ({ showUserCredential, email }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!isTimerActive) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) return toast.error("Enter full 6-digit OTP");

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: enteredOtp, type: "email" });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      toast.success("OTP verified successfully");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) return toast.error(error.message);
      toast.success("OTP sent again");
      setRemainingSeconds(120);
      setIsTimerActive(true);
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form className="flex flex-col justify-between flex-1" onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-4">
        <button
          type="button"
          className="text-zinc-400 flex items-center"
          onClick={showUserCredential}
        >
          <IoIosArrowRoundBack />
          <span className="ml-1">back</span>
        </button>

        <h1 className="text-white text-sm font-bold">
          Enter OTP sent to <span className="text-blue-400">{email}</span>
        </h1>

        <div className="flex gap-3">
          {otp.map((value, index) => (
            <TextField
              key={index}
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              inputRef={(el) => (inputRefs.current[index] = el)}
              variant="outlined"
              size="small"
              autoFocus={index === 0}
              sx={{
                "& .MuiInputBase-input": {
                  color: "white",
                  fontSize: "1rem",
                  textAlign: "center",
                  padding: "8px 0",
                  height: "auto",
                },
                width: "40px",
                height: "40px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#52525b" },
                  "&:hover fieldset": { borderColor: "#71717a" },
                  "&.Mui-focused fieldset": { borderColor: "gray" },
                },
              }}
            />
          ))}
        </div>

        <div>
          {isTimerActive ? (
            <p className="text-slate-400 text-sm">
              Resend OTP in {Math.floor(remainingSeconds / 60)}:
              {(remainingSeconds % 60).toString().padStart(2, "0")}
            </p>
          ) : (
            <Button
              disabled={resendLoading}
              variant="text"
              onClick={handleResend}
              size="small"
              sx={{ textTransform: "none", color: "#3b82f6" }}
            >
              {resendLoading ? (
                <span>
                  Sending OTP<span className="dot-loader"></span>
                </span>
              ) : (
                <span>Resend OTP</span>
              )}
            </Button>
          )}
        </div>
      </div>

      <Button
        variant="contained"
        fullWidth
        type="submit"
        disabled={loading}
        sx={{
          backgroundColor: "#3b82f6",
          transition: "0.2s ease-in-out",
          color: "white",
          textTransform: "none",
          "&:hover": { backgroundColor: "#2563eb", scale: "1.02" },
          "&:disabled": { backgroundColor: "#373737", color: "#838383" },
          paddingY: 0.75,
          fontSize: "1rem",
          height: "40px",
        }}
      >
        {!loading ? (
          <>
            <span>Continue</span>
            <IoIosArrowForward />
          </>
        ) : (
          <>Verifying &nbsp;<span className="loader"></span></>
        )}
      </Button>
    </form>
  );
};

const Auth: React.FC = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");

  const showOtpScreen = () => setShowOtp(true);
  const showUserCredential = () => setShowOtp(false);

  const variants = {
    hidden: { x: "100vw", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100vw", opacity: 0 },
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-zinc-950 p-4">
      <div className="flex flex-col bg-slate-500/20 rounded-xl shadow-lg w-full max-w-lg flex-1">
        <header className="p-5">
          <h1 className="text-slate-300 text-3xl font-semibold text-center">
            Login or Signup to Continue
          </h1>
        </header>
        <main className="flex min-h-80 flex-1 p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {showOtp ? (
              <motion.div
                className="flex-1 flex"
                key="otp"
                variants={variants}
                initial="visible"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <OtpScreen showUserCredential={showUserCredential} email={email} />
              </motion.div>
            ) : (
              <motion.div
                key="credentials"
                className="flex-1 flex"
                variants={variants}
                initial="visible"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <UserCredentials showOtpScreen={showOtpScreen} email={email} setEmail={setEmail} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Auth;
