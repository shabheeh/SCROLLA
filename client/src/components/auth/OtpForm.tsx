import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, ClipboardEvent, FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Label } from "../../components/ui/label";

export default function OTPVerificationForm() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number): void => {
    const value = e.target.value;
    
    // Only allow numeric input
    if (!/^[0-9]*$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Limit to 1 character
    setOtp(newOtp);
    
    // Auto focus next input if current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("OTP Submitted:", otp.join(""));
      setIsSubmitting(false);
      // Here you would handle verification success/failure
    }, 1500);
  };

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">Verification Required</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your email
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
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
            type="submit"
            className="w-full bg-black text-white hover:bg-black hover:text-white cursor-pointer"
            disabled={isSubmitting || otp.some(digit => !digit)}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
          <p className="text-sm text-center">
            Didn't receive a code?{" "}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto cursor-pointer"
              disabled={isSubmitting}
            >
              Resend Code
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}