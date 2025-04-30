import { Navbar } from "../components/Navbar";
import heropageImg from "../assets/Untitled design (2).png";

export const Hero = () => {


  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <Navbar />
      <main
        className="flex flex-row items-center justify-center flex-1 border-b"
        style={{ backgroundColor: "#fef5e6" }}
      >
        <div className="flex flex-col w-full sm:mx-20 sm:w-1/2 p-8 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Where knowledge meets curiosity.
          </h1>
          <section>
            <p className="mt-2 text-lg sm:text-xl">
              Dive deeper into topics that matter, and spark your next big idea
              for personal and professional growth.
            </p>
          </section>
        </div>
        <div className="hidden sm:flex sm:w-1/2 justify-end">
          <img
            className="object-cover h-[500px] w-auto"
            src={heropageImg}
            alt="Hero page image"
          />
        </div>
      </main>
      <footer className="flex mx-3 items-center justify-center h-20 text-black">
        <p className="text-sm sm:text-base">
          For inquiries or feedback, feel free to reach out at{" "}
          <a href="mailto:support@scrolla.com" className="underline">
            support@scrolla.com
          </a>
          .
        </p>
      </footer>
    </div>
  );
};