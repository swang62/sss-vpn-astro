import { useCallback, useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import { apiClient } from "@/server/client";
import { parsedApi } from "@/server/utils";

interface Props {}

function Status(_props: Props) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [seed, setSeed] = useState(0);

  const onClickStatus = useCallback(async () => {
    const { data } = await parsedApi(apiClient.status.$get());
    setStatus(JSON.stringify(data, null, 2));
  }, []);

  const onClickPicture = async () => {
    setStatus("");
    setLoading(true);
    setSeed(Math.random());
  };

  const onClickReset = async () => {
    setStatus("");
    setLoading(false);
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
      {status
        ? (
            <code>{status}</code>
          )
        : seed !== 0
          ? (
              <img
                src={
                  loading
                    ? `https://placehold.co/${width}x${height}/13151a/a1a1a1?font=roboto&text=Loading...`
                    : src
                }
                width={width}
                height={height}
                onLoad={() => setLoading(false)}
                onError={() => setStatus("Image API error, please try again later.")}
              />
            )
          : null}
    </div>
  );
}

export default Status;
