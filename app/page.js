"use client";
import { useRef, useState } from "react";
import { Camera } from "react-camera-pro";

export default function Home() {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const handleTakePhoto = () => {
    setCountdown(3); // Start countdown from 3
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval); // Clear interval when countdown reaches 1
          const photo = camera.current.takePhoto(); // Take the photo
          setImage(photo); // Set the taken photo
          return 0;
        }
        return prev - 1; // Decrease countdown by 1 each second
      });
    }, 1000);
  };

  return (
    <main className="grid grid-cols-3 gap-4 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div></div>
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          <Camera
            ref={camera}
            aspectRatio={32 / 18}
            className="flex w-full rounded"
          />{" "}
        </div>
        <button
          className="relative mt-3 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          onClick={handleTakePhoto}
          disabled={countdown > 0} // Disable button during countdown
        >
          <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            {countdown > 0 ? `Taking photo in ${countdown}...` : "Take Photo"}
          </span>{" "}
        </button>
        {image && <img src={image} alt="Taken photo" className="mt-4" />}
      </div>
    </main>
  );
}
