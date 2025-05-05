import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { resendOtp, verfiyOtp } from "../../services/auth.service";
import { toast } from "sonner";

type OtpFormProps = {
  email: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const OtpForm: React.FC<OtpFormProps> = ({
  email,
  onConfirm,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [seconds, setSeconds] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);


  useEffect(() => {
    if (isTimerActive && seconds > 0) {
      const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (seconds === 0) {
      setIsTimerActive(false);
    }
  }, [isTimerActive, seconds]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const value = e.target.value;

    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Limit to 1 character
    setOtp(newOtp);

    // Auto focus next input if current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press events
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);

    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];

    // Fill the OTP array with pasted digits
    for (let i = 0; i < pasteData.length; i++) {
      if (i < 6) {
        newOtp[i] = pasteData[i];
      }
    }

    setOtp(newOtp);

    // Focus the next empty input or the last input
    const focusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async () => {
    try {
      const otpString = otp.join("");
      if (!otpString) {
        return;
      }

      setIsSubmitting(true);
      await verfiyOtp(email, otpString);
      toast.success("Email verified Successfully");
      onConfirm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setSeconds(30);
    setIsTimerActive(true);
    try {
      await resendOtp(email);
      toast.success("New OTP sent to your email");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  return (
    <Card className="w-full mb-5 max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">
          Verification Required
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label htmlFor="otp-input-0">Verification Code</Label>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el: HTMLInputElement | null): void => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                id={`otp-input-${index}`}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-lg border rounded-md focus:border-black focus:ring-1 focus:ring-black"
                maxLength={1}
                autoComplete="one-time-code"
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 py-6">
        <Button
          onClick={handleSubmit}
          className="w-full bg-black text-white hover:bg-black hover:text-white cursor-pointer"
          disabled={isSubmitting || otp.some((digit) => !digit)}
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </Button>
        <p className="text-sm text-center">
          Didn't receive a code?{" "}
          <Button
          onClick={handleResendOtp}
            type="button"
            variant="link"
            className={`p-0 h-auto ${isTimerActive ? "" : "cursor-pointer"}`}
            disabled={isSubmitting || isTimerActive}
          >
            {isTimerActive ? `Resend OTP in ${seconds}s` : "Resend OTP"}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default OtpForm;
