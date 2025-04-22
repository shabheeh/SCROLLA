import { Button } from "./ui/button";

export const Navbar = () => {
  return (
    <div className="border-b-1">
      <header className="h-16 flex items-center justify-between mx-5 sm:mx-30">
        <div className="flex-grow flex">
          <h1 className="text-lg font-bold">SCROLLA</h1>
        </div>
        <div className="flex-none flex gap-x-2">
          <Button className="text-sm bg-secondary border-primary text-primary py-2 px-4 cursor-pointer rounded-3xl">
            Sign in
          </Button>
          <Button className="text-sm bg-black dark:bg-bg-primary cursor-pointer hover:bg-black text-white py-2 px-4 rounded-3xl">
            Get Started
          </Button>
        </div>
      </header>
    </div>
  );
};
