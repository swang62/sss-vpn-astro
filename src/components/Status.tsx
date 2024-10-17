import { useState } from "react";
import useSWR from "swr";

import { apiClient } from "@/server/client";

const getStatus = () => apiClient.status.$get().then((res) => res.json());

interface Props {}

function Status(_props: Props) {
  const [loadingImage, setLoadingImage] = useState(true);
  const [statusResponse, setStatusResponse] = useState("");
  const [seed, setSeed] = useState(0);
  const { mutate } = useSWR("/api/status", getStatus);

  // Handlers
  const onClickStatus = async () => {
    const data = await mutate();
    setStatusResponse(JSON.stringify(data, null, 2));
  };
  const onClickPicture = () => {
    setStatusResponse("");
    setLoadingImage(true);
    setSeed(Math.random());
  };
  const onClickReset = () => {
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
          <button onClick={onClickStatus}>Check Status</button>
          <button onClick={onClickPicture}>Random Photo</button>
        </div>
        <button onClick={onClickReset}>Reset All</button>
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
