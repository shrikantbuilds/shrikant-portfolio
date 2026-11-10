import { NextResponse } from "next/server";
import type { GithubStats } from "@/lib/types";

export const revalidate = 3600;

const USERNAME = /^[A-Za-z0-9-]+$/;

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function eventLabel(event: { type?: string; repo?: { name?: string } }) {
  const names: Record<string, string> = {
    PushEvent: "Push",
    WatchEvent: "Star",
    ForkEvent: "Fork",
    CreateEvent: "Created",
    IssuesEvent: "Issue",
    PullRequestEvent: "Pull request",
    IssueCommentEvent: "Comment",
  };
  const action = names[event.type ?? ""] ?? "Activity";
  const repo = event.repo?.name;
  return repo ? `${action} · ${repo}` : action;
}

export async function GET() {
  const username = process.env.GITHUB_USERNAME?.trim() ?? "";
  if (!username) {
    return NextResponse.json({ configured: false } satisfies GithubStats);
  }
  if (!USERNAME.test(username)) {
    return NextResponse.json({
      configured: true,
      error: "GITHUB_USERNAME has characters GitHub will not accept.",
    } satisfies GithubStats);
  }

  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "shrikant-os",
  };

  try {
    const [userResponse, eventsResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=1`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (userResponse.status === 404) {
      return NextResponse.json({
        configured: true,
        username,
        error: "That GitHub user was not found.",
      } satisfies GithubStats);
    }
    if (!userResponse.ok) {
      return NextResponse.json({
        configured: true,
        username,
        error: "GitHub did not return public profile data.",
      } satisfies GithubStats);
    }

    const user = (await userResponse.json()) as { public_repos?: number; followers?: number };
    let latest: GithubStats["latest"] = null;
    if (eventsResponse.ok) {
      const events = (await eventsResponse.json()) as Array<{
        type?: string;
        created_at?: string;
        repo?: { name?: string };
      }>;
      const event = events[0];
      if (event) {
        latest = {
          label: eventLabel(event),
          at: event.created_at ? formatDate(event.created_at) : "",
        };
      }
    }

    return NextResponse.json({
      configured: true,
      username,
      publicRepos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      latest,
    } satisfies GithubStats);
  } catch {
    return NextResponse.json({
      configured: true,
      username,
      error: "GitHub could not be reached.",
    } satisfies GithubStats);
  }
}
