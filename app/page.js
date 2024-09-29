"use client";
import { useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import OpenAI from "openai";
// Move OpenAI calls to the server or backend

export default function Home() {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleTakePhoto = () => {
    setCountdown(3); // Start countdown from 3
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval); // Clear interval when countdown reaches 1
          const photo = camera.current.takePhoto(); // Take the photo
          setImage(photo); // Set the taken photo

          imgToLetter(photo).then((response) => {
            const message = response.choices[0].message.content;

            setAnswers((prev) => [
              ...prev,
              [photo, message, Date.now()], // Properly update answers array
            ]);
          });

          return 0;
        }
        return prev - 1; // Decrease countdown by 1 each second
      });
    }, 1000);
  };
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    // Format the date as MM/DD/YYYY
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Format the time as HH:MM AM/PM
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return `${formattedDate} ${formattedTime}`;
  }
  // Make sure to move OpenAI API calls to the backend
  async function imgToLetter(image) {
    const openai = new OpenAI({
      apiKey:

      dangerouslyAllowBrowser: true,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What is the word being said in American sign language, Can you give me the answer by saying the word being shown in ASL is ...",
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });
    response.choices[0]["message"]["content"];

    return response;
  }
  // Determine the border color based on the countdown value
  const getBorderColor = () => {
    if (countdown === 3) return "border-green-500";
    if (countdown === 2) return "border-yellow-500";
    if (countdown === 1) return "border-red-500";
    return "border-white";
  };

  return (
    <main className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div
        className={`grid grid-cols-2 gap-4 items-center justify-items-center h-full p-3 font-[family-name:var(--font-geist-sans)] border-4 rounded ${getBorderColor()}`}
      >
        <div className="flex w-full flex-col items-center p-4">
          {/* Container for displaying answers */}
          <div className="flex w-full h-full  bg-gray-800 p-4 space-y-4 rounded">
            {/* Check if answers is not null */}
            {answers ? (
              <div className="flex flex-col w-full h-[850px] bg-gray-800 overflow-scroll p-4 space-y-4 rounded">
                {answers.map(([photo, message, timestamp], index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-4 rounded-lg shadow-md flex items-start space-x-4"
                  >
                    {/* Display the photo */}
                    <img
                      src={photo}
                      alt="answer photo"
                      className="w-16 h-16 object-cover rounded-full"
                    />

                    {/* Display the message and timestamp */}
                    <div>
                      <p className="text-white mb-2">{message}</p>
                      <p className="text-gray-400 text-sm">
                        {formatTimestamp(timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Fallback message for empty answers */}
                {answers.length === 0 && (
                  <p className="text-gray-400">No answers available yet.</p>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No answers available.</p> // Message when answers is null
            )}
          </div>
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="flex w-full h-82">
            <Camera
              ref={camera}
              aspectRatio={16 / 9}
              className="flex w-full h-82 rounded"
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

          {image ? (
            <img src={image} alt="Taken photo" className="flex w-10/12" />
          ) : (
            <div className="flex w-10/12 h-72 border-gray-400 border-4 border-dashed rounded"></div>
          )}
        </div>
      </div>
    </main>
  );
}
