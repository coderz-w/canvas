import { createApi } from "unsplash-js";
import { useState, useEffect, useCallback } from "react";
import { Random } from "unsplash-js/dist/methods/photos/types";

export const useGetImages = (count = 50) => {
  const [data, setData] = useState<Random | Random[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      const photos = await fetchPhotos(count);

      if (photos.errors) {
        throw new Error(photos.errors[0]);
      }

      setData(photos.response); // 只获取我们需要的图片结果
    } catch (error) {
      setIsError(true);
      setErrorMessage((error as Error).message || "发生错误");
    } finally {
      setIsLoading(false);
    }
  }, [count]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError, errorMessage };
};

async function fetchPhotos(defaultCount = 50) {
  const unsplash = createApi({
    accessKey: "Fzj4WCnsAkiFDJtfQeD0jspPu0eCjOszeeMvdWaQ6k4",
  });

  return unsplash.photos
    .getRandom({ count: defaultCount, collectionIds: ["317099"] })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error("无法获取图片：" + error.message);
    });
}

export default fetchPhotos;
