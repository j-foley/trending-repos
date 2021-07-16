import "./RepoList.css";

export type Repo = {
  id: string;
  name: string;
  stargazers_count: number;
  description: string;
  html_url: string;
  isStarred: boolean;
};

interface RepoItemProps {
  repo: Repo;
  onStarClick: Function;
}

export const RepoItem = ({ repo, onStarClick }: RepoItemProps) => {
  const { id, name, stargazers_count, description, html_url, isStarred } = repo;
  const toggleStarClassName = isStarred ? "starred" : "";
  const buttonLabel = isStarred ? "toggleStarOff" : "toggleStarOn";

  return (
    <li className="repo--item" data-testid={`repo-item-${repo.id}`}>
      <a href={html_url} target="_blank" rel="noopener noreferrer">
        <span className="repo--name">
          <b>{name}</b> (&#9734; {stargazers_count})
        </span>
        <span>{description}</span>
      </a>
      <button
        aria-label={buttonLabel}
        className={toggleStarClassName}
        onClick={() => onStarClick(id,isStarred)}
      >
        &#9733;
      </button>
    </li>
  );
};

interface RepoListProps {
  repos: Repo[];
  onStarClick: Function;
}

export const RepoList = ({ repos, onStarClick }: RepoListProps) => {
  return (
    <ul className="repo--list">
      {repos.map((repo) => (
        <RepoItem key={repo.id} repo={repo} onStarClick={onStarClick} />
      ))}
    </ul>
  );
};
