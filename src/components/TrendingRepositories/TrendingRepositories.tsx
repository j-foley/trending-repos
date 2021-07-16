import { useState, useEffect } from "react";
import { useTrendingRepos } from "../../hooks/useTrendingRepos";
import { Repo, RepoList } from "../RepoList";
import "./TrendingRepositories.css";

export const TrendingRepositories = () => {
  const {
    status,
    trendingRepos,
    starredRepos,
    setTrendingRepos,
    setStarredRepos,
  } = useTrendingRepos();
  const [tab, setTab] = useState("trending");

  const handleStarToggle = async (id: string, isStarred: Boolean) => {
    // Update trendingRepos
    const wasStarred = isStarred;
    setTrendingRepos((previousValue) =>
      previousValue.map((repo) => {
        if (repo.id === id) {
          repo.isStarred = !isStarred;
        }
        return repo;
      })
    );
    if (wasStarred) {
      // remove from starred
      setStarredRepos((previousValue) =>
        previousValue.filter((repo) => repo.id !== id)
      );
    } 
  };

  const trendingTabClassName =
    tab === "trending" ? "tab--button tab--button-active" : "tab--button";
  const starredTabClassName =
    tab === "starred" ? "tab--button tab--button-active" : "tab--button";

  return (
    <div className="main--wrapper">
      <header>
        <h1>Trending Repos</h1>
      </header>
      <main>
        <div className="card--wrapper">
          <div className="tabs--wrapper">
            <button
              data-testid="trendingTabBtn"
              className={trendingTabClassName}
              onClick={() => setTab("trending")}
            >
              Trending
            </button>
            <button
              data-testid="starredTabBtn"
              className={starredTabClassName}
              onClick={() => setTab("starred")}
            >
              Starred
            </button>
          </div>
          {tab === "trending" &&
            (status.error ? (
              <span>{status.errorMessage}</span>
            ) : (
              <RepoList repos={trendingRepos} onStarClick={handleStarToggle} />
            ))}
          {tab === "starred" && (
            <RepoList repos={starredRepos} onStarClick={handleStarToggle} />
          )}
        </div>
      </main>
    </div>
  );
};
