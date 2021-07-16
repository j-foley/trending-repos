import { useState, useEffect } from "react";
import { Repo } from "../components/RepoList";

interface StarredRepos {
  starredRepos: Repo[],
  setStarredRepos: React.Dispatch<React.SetStateAction<Repo[]>>;
}

export const useStarredRepos = () : StarredRepos => {
  const key = "starred-repos";
  const [starredRepos, setStarredRepos] = useState<Repo[]>(() => {
    const savedStars = window.localStorage.getItem(key);
    return savedStars ? JSON.parse(savedStars) : [];
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(starredRepos));
  }, [starredRepos]);

  return { starredRepos: starredRepos, setStarredRepos: setStarredRepos };
};
