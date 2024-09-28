"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { Camera } from "react-camera-pro";

export default function Home() {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Adjusted size and centered the Camera */}
        <Camera
          ref={camera}
          aspectRatio={32 / 18}
        />{" "}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setImage(camera.current.takePhoto())}
        >
          Take photo
        </button>
        <img src={image} alt="Taken photo" />
      </main>
    </div>
  );
}
