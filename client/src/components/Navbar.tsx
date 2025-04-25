import { useState } from "react";
import AuthModal from "./auth/AuthModal";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const closeSignupModal = () => setAuthModalOpen(false);
  const [defaultTab, setDefaultTab] = useState<"sign-in" | "sign-up">(
    "sign-in"
  );

  return (
    <div className="border-b-1">
      <header className="h-16 flex items-center justify-between mx-5 sm:mx-30">
        <div className="flex-grow flex">
          <h1 className="text-lg font-bold">SCROLLA</h1>
        </div>
        <div className="flex-none flex gap-x-2">
          <Button
            onClick={() => {
              setDefaultTab("sign-in");

              setAuthModalOpen(true);
            }}
            className="text-sm bg-secondary border-primary text-primary py-2 px-4 cursor-pointer rounded-3xl"
          >
            Sign in
          </Button>
          <Button
            onClick={() => {
              setDefaultTab("sign-up");
              setAuthModalOpen(true);
            }}
            className="text-sm bg-black dark:bg-bg-primary cursor-pointer hover:bg-black text-white py-2 px-4 rounded-3xl"
          >
            Get Started
          </Button>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeSignupModal}
        defaultTab={defaultTab}
      />
    </div>
  );
};
