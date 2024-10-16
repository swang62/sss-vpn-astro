import { useQuery } from "preact-fetching";
import { useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import { apiClient } from "@/server/client";

interface Props {}

function Status(_props: Props) {
  const [loadingImage, setLoadingImage] = useState(true);
  const { data, refetch } = useQuery("status", async () => {
    const response = await apiClient.status.$get();
    return await response.json();
  });
  const [statusResponse, setStatusResponse] = useState("");
  const [seed, setSeed] = useState(0);

  // Handlers
  const onClickStatus = async () => {
    refetch();
    setStatusResponse(JSON.stringify(data, null, 2));
  };
  const onClickPicture = async () => {
    setStatusResponse("");
    setLoadingImage(true);
    setSeed(Math.random());
  };
  const onClickReset = async () => {
    setStatusResponse("");
    setLoadingImage(false);
    setSeed(0);
  };

  // Setup
  const width = 800;
  const height = 600;
  const src = `https://picsum.photos/seed/${seed}/${width}/${height}.webp`;

  return (
    <div className="instructions flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <button
            onClick={onClickStatus}
            className={twMerge("btn", "bg-green-800 hover:bg-green-600")}
          >
            Check Status
          </button>
          <button
            onClick={onClickPicture}
            className={twMerge("btn", "bg-blue-800 hover:bg-blue-600")}
          >
            Random Photo
          </button>
        </div>
        <button
          onClick={onClickReset}
          className={twMerge("btn", "bg-red-800 hover:bg-red-600")}
        >
          Reset All
        </button>
      </div>
      {statusResponse
        ? (
            <code>{statusResponse}</code>
          )
        : seed !== 0
          ? (
              <img
                src={loadingImage ? `/loading-picture.svg` : src}
                width={width}
                height={height}
                onLoad={() => setLoadingImage(false)}
              />
            )
          : null}
    </div>
  );
}

export default Status;
