import { NextResponse } from "next/server";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "Vaibhav-shelke1";

const CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        totalCount
        nodes {
          stargazerCount
          primaryLanguage { name color }
          updatedAt
        }
      }
      followers { totalCount }
      following { totalCount }
    }
  }
`;

export async function GET() {
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { username: GITHUB_USERNAME },
      }),
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`GitHub API responded with ${res.status}`);
    }

    const json = await res.json();
    const user = json?.data?.user;

    if (!user) {
      throw new Error("GitHub user not found");
    }

    // Flatten contribution days
    const calendar = user.contributionsCollection.contributionCalendar;
    const days = calendar.weeks.flatMap(
      (week: { contributionDays: { contributionCount: number; date: string; weekday: number }[] }) =>
        week.contributionDays
    );

    // Language stats
    const langMap: Record<string, { count: number; color: string }> = {};
    for (const repo of user.repositories.nodes as { primaryLanguage: { name: string; color: string } | null }[]) {
      if (repo.primaryLanguage) {
        const { name, color } = repo.primaryLanguage;
        langMap[name] = { count: (langMap[name]?.count ?? 0) + 1, color };
      }
    }
    const topLanguages = Object.entries(langMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, { count, color }]) => ({ name, count, color }));

    // Total stars
    const totalStars = (user.repositories.nodes as { stargazerCount: number }[]).reduce(
      (acc: number, r: { stargazerCount: number }) => acc + r.stargazerCount,
      0
    );

    return NextResponse.json({
      totalContributions: calendar.totalContributions,
      days,
      totalRepos: user.repositories.totalCount,
      totalStars,
      topLanguages,
      followers: user.followers.totalCount,
    });
  } catch (err) {
    console.error("GitHub API error:", err);
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}
