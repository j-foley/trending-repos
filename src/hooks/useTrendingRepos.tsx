import { useState, useEffect } from "react";
import { useStarredRepos } from "./useStarredRepos";
import { Repo } from "../components/RepoList";

/**
 * Merges two arrays of repositories together where ListA has
 * its duplicates filtered out in favour of its duplicate in ListB
 * @param {Repo[]} listA
 * @param {Repo[]} listB
 * @returns {Repo[]} an array of repositories
 */
const mergeRepoLists = (listA: Repo[], listB: Repo[]): Repo[] => {
  const reduced = listA.filter(
    (listA) => !listB.find((bitem) => listA.id === bitem.id)
  );
  return [...reduced, ...listB];
};

/**
 * Adds an isStarred flag to the array of currently trending repositories
 * If a repository in that array has already been starred then the flag
 * is set accordingly
 * @param {Repo[]} trending - Array of currently trending repositories
 * @param {Repo[]} starred - Array of starred repositories
 */
const addIsStarredFlag = (trending: Repo[], starred: Repo[]) => {
  trending.forEach((TrendingRepo) => {
    const repoIsStarred = starred.some(
      (starredRepo) => TrendingRepo.id === starredRepo.id
    );
    TrendingRepo.isStarred = repoIsStarred;
  });
};

interface Status {
  loading: Boolean;
  error?: string;
  errorMessage?: string;
}

interface TrendingRepos {
  status: Status;
  trendingRepos: Array<Repo>;
  starredRepos: Array<Repo>;
  setTrendingRepos: React.Dispatch<React.SetStateAction<Repo[]>>;
  setStarredRepos: React.Dispatch<React.SetStateAction<Repo[]>>;
}

export const useTrendingRepos = (): TrendingRepos => {
  const { starredRepos, setStarredRepos } = useStarredRepos();
  const [status, setStatus] = useState<Status>({ loading: true });
  const [trendingRepos, setTrendingRepos] = useState<Repo[]>([]);
  const currentDate = new Date();
  const oneWeekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
  const stringDate = oneWeekAgo.toISOString().split("T")[0];
  const query = `https://api.github.com/search/repositories?q=created:>${stringDate}&sort=stars&order=desc`;

  useEffect(() => {
    const fetchTrendingRepos = async () => {
      try {
        setStatus({ loading: true });
        const response = await fetch(query);
        if (!response.ok)
          throw Error(
            `useTrendingRepos: error on fetch - ${response.statusText}`
          );

        let { items: repos } = await response.json();

        addIsStarredFlag(repos, starredRepos);
        setTrendingRepos(repos);
        setStatus({ loading: false });
      } catch (error) {
        console.error(error);
        setStatus({
          loading: false,
          error: error,
          errorMessage: "Unable to load trending repositories",
        });
      }
    };
    fetchTrendingRepos();
  }, [query]);

  useEffect(() => {
    setStarredRepos((previousValue) => {
      const trendingStarred = trendingRepos.filter((repo) => repo.isStarred);
      return mergeRepoLists(previousValue, trendingStarred);
    });
  }, [trendingRepos]);

  return {
    status: status,
    trendingRepos: trendingRepos,
    starredRepos: starredRepos,
    setTrendingRepos: setTrendingRepos,
    setStarredRepos: setStarredRepos,
  };
};
