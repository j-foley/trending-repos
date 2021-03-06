import {
  render,
  screen,
  fireEvent,
  within,
} from "@testing-library/react";
import { TrendingRepositories } from "./TrendingRepositories";
import { mockTrendingRepos, mockStarredRepos } from "./mockData";

beforeEach(() => {
  fetchMock.doMock();
  fetchMock.resetMocks();
  localStorage.clear();
});

describe("TrendingRepositories Component", () => {
  test("It should display the currently trending repos", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockTrendingRepos));

    render(<TrendingRepositories />);

    for (const repo of mockTrendingRepos.items) {
      const description = await screen.findByText(repo.description);
      expect(description).toBeInTheDocument();
    }
  });

  test("It should display the previously starred repos", async () => {
    const KEY = "starred-repos";
    const VALUE = JSON.stringify(mockStarredRepos);
    fetchMock.mockResponseOnce(JSON.stringify(mockTrendingRepos));
    localStorage.setItem(KEY, VALUE);
    render(<TrendingRepositories />);

    expect(localStorage.getItem).toHaveBeenLastCalledWith(KEY);

    const starredTabBtn = screen.getByTestId("starredTabBtn");
    fireEvent.click(starredTabBtn);
    for (const repo of mockStarredRepos) {
      const description = await screen.findByText(repo.description);
      expect(description).toBeInTheDocument();
    }
  });

  test("It removes a star from a repo", async () => {
    const KEY = "starred-repos";
    const VALUE = JSON.stringify(mockStarredRepos);
    fetchMock.mockResponseOnce(JSON.stringify(mockTrendingRepos));
    localStorage.setItem(KEY, VALUE);
    render(<TrendingRepositories />);

    const repoItem = await screen.findByTestId("repo-item-2");
    const repoItemStarBtn = within(repoItem).getByLabelText("toggleStarOff");

    fireEvent.click(repoItemStarBtn);
    const starredTabBtn = screen.getByTestId("starredTabBtn");
    fireEvent.click(starredTabBtn);

    const removed = screen.queryByText(mockStarredRepos[0].description);
    const persisting = screen.queryByText(mockStarredRepos[1].description);
    expect(removed).toBeNull();
    expect(persisting).toBeInTheDocument();
  });

  test("It adds a star to a repo", async () => {
    const KEY = "starred-repos";
    fetchMock.mockResponse(JSON.stringify(mockTrendingRepos));
    render(<TrendingRepositories />);

    const repoItem = await screen.findByTestId("repo-item-2");
    const repoItemStarBtn = within(repoItem).getByLabelText("toggleStarOn");
    fireEvent.click(repoItemStarBtn);

    expect(localStorage.__STORE__[KEY]).toMatchInlineSnapshot(
      `"[{\\"id\\":2,\\"name\\":\\"test2\\",\\"html_url\\":\\"https://github.com/tenacityteam/test2\\",\\"description\\":\\"Test description 2\\",\\"stargazers_count\\":202,\\"isStarred\\":true}]"`
    );

    const starredTabBtn = screen.getByTestId("starredTabBtn");
    fireEvent.click(starredTabBtn);

    const description = await screen.findByText(
      mockTrendingRepos.items[1].description
    );
    expect(description).toBeInTheDocument();
  });

  test("It should handle an error on fetch", async () => {
    fetchMock.mockReject(new Error("error for test"));
    render(<TrendingRepositories />);

    const errorMessage = await screen.findByText(
      "Unable to load trending repositories"
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
