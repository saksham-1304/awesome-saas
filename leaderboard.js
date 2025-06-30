/**
 * Fetches and processes repository data to create a contributor leaderboard
 */

/**
 * Creates a map of contributors and their repository statistics
 * @param {Object[]} repos - Array of repository data from GitHub API
 * @returns {Map} - Map of contributors and their stats
 */
const processContributorStats = (repos) => {
  const contributorStats = new Map();

  repos.forEach(repo => {
    if (!repo.topics.includes("alchemyst-awesome-saas")) return;

    const owner = repo.owner.login;
    if (owner.toLowerCase() === 'alchemyst-ai') return; // Skip official repos

    const currentStats = contributorStats.get(owner) || {
      repos: [],
      totalStars: 0,
      profile: `https://github.com/${owner}`
    };

    currentStats.repos.push({
      name: repo.full_name,
      stars: repo.stargazers_count,
      url: repo.html_url
    });
    currentStats.totalStars += repo.stargazers_count;

    contributorStats.set(owner, currentStats);
  });

  return contributorStats;
};

/**
 * Creates the leaderboard markdown string
 * @param {Map} contributorStats - Map of contributor statistics
 * @returns {string} - Formatted markdown string
 */
const createLeaderboardString = (contributorStats) => {
  const sortedContributors = [...contributorStats.entries()]
    .sort((a, b) => b[1].totalStars - a[1].totalStars);

  let leaderboardString = `# Alchemyst Platform Community Leaderboard\n\n`;
  leaderboardString += `Recognition for our amazing community of **${sortedContributors.length}** contributors! 🏆\n\n`;
  leaderboardString += `| **Rank** | **Contributor** | **Projects** | **Total Stars** |\n`;
  leaderboardString += `| -------------- | -------------- | ------------ | --------------- |\n`;

  sortedContributors.forEach(([contributor, stats], idx) => {
    const projectsList = stats.repos
      .map((repo) => {
        return `[${repo.name}](${repo.url}) (⭐${repo.stars})`
      })
      .join(', ');

    let position = idx + 1;

    switch (position) {
      case 1:
        position = `🥇 ${position}`
        break;
      case 2:
        position = `🥈 ${position}`
        break;
      case 3:
        position = `🥉 ${position}`
        break;
      default:
        position = `🌟 ${position}`
    }
    leaderboardString += `| ${position} | [${contributor}](${stats.profile}) | ${projectsList} | ${stats.totalStars} |\n`;
  });

  return leaderboardString;
};

/**
 * Main function to fetch data and generate leaderboard
 */
const generateLeaderboard = async () => {
  try {
    const response = await fetch(
      "https://api.github.com/search/repositories?q=topic:alchemyst-awesome-saas"
    );
    const data = await response.json();
    const repos = data.items || [];

    const contributorStats = processContributorStats(repos);
    const leaderboardString = createLeaderboardString(contributorStats);

    console.log(leaderboardString);
  } catch (error) {
    console.error("Error generating leaderboard:", error);
    return "An error occurred while generating the leaderboard. Please try again later.";
  }
};

generateLeaderboard();