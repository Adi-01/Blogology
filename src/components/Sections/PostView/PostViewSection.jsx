import { useEffect, useState } from "react";
import RecentPostViewSection from "./RecentPostViewSection";
import AllPostViewSection from "./AllPostViewSection";
import FabMenu from "../../FabMenu";
import axiosInstance from "../../../utils/AxiosInstance";

export const PostViewSection = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get("/api/blog/posts/");
        setPosts(response.data.reverse());
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <RecentPostViewSection posts={posts} isLoading={isLoading} />
      <AllPostViewSection allPosts={posts} isLoading={isLoading} />
      {isLoading ? "" : <FabMenu />}
    </>
  );
};
