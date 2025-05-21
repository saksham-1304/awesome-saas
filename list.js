/**
 * @param {string[]} tags
 * @returns {string}
 */
const processTags = (tags) => {
  return tags
    .filter((tag) => tag.includes("alchemyst-awesome-saas"))
    .map((tag) => tag.replace("alchemyst-awesome-saas", "").replace("-", " ")).join(", ");
};

const introduction = () => {
  console.log(`# Awesome Alchemyst Platform Cookbook
Ideas & SaaS templates to build on top of the Alchemyst Platform`);
  console.log(
    "At Alchemyst AI, we love empowering developers and builders with AI. Below is a list of the projects that our team has put out!"
  );
};

const preMessageForTeam = () => {
  console.log("## 💡 From the Team");
  console.log("Explore these SaaS templates by our cracked team 🧨\n\n");
};

const preMessageForCommunity = () => {
  console.log("## 🚀 From the Community");
  console.log("Explore these SaaS templates by our awesome community 🤩\n\n");
};

const postMessageForTeam = () => {
  console.log("This is an ever expanding list - we'll keep on adding open source templates!")
};

const postMessageForCommunity = () => {
  console.log("## For contributors");
  console.log(
    "Contributors are welcome! Get started by contributing to our projects! **Have a new idea?** Do tell us about it [***here***](https://github.com/orgs/alchemyst-ai/discussions/1)!"
  );
  console.log("### Can't find your contributions?");
  console.log("Consider doing the following:");
  console.log(`
- Check if you have set your repo to public. 
- Check if you have added a topic "alchemyst-awesome-saas" on your repo.
- If your repo tags don't show up yet, check if you have added topics starting with "alchemyst-awesome-saas".
`)
  console.log(
    `**NOTE**: This list refreshes once a day at 12:00 AM UTC. Please be patient while it does :D. 
    
    If it still doesn't show up, please [**raise an issue**](https://github.com/Alchemyst-ai/awesome-saas/issues/new)`
  );
};

const gatherReposFromTeam = () => {
  fetch("https://api.github.com/users/alchemyst-ai/repos")
    .then((res) => res.json())
    .then((repoDataForTeam) => {
      preMessageForTeam();
      console.log("| **Name** | **Stars** | **Description** | **Topic(s)** |");
      console.log("| ---- | ---- | ---- | ---- |");
      repoDataForTeam.map((entry) => {
        if (entry.topics.includes("alchemyst-awesome-saas")) {
          console.log(
            `| [**${entry.full_name}**](https://github.com/${entry.full_name}) | ${entry.stargazers_count} | ${entry.description} | ${processTags(entry.topics)}`
          );
        }
      });
      postMessageForTeam();
    });
};

const gatherReposFromCommunity = () => {
  fetch(
    "https://api.github.com/search/repositories?q=topic:alchemyst-awesome-saas"
  )
    .then((res) => res.json())
    .then((data) => data.items ?? [])
    .then((communityRepoData) => {
      preMessageForCommunity();
      console.log("| **Name** | **Stars** | **Description** | **Topic(s)** |");
      console.log("| ---- | ---- | ---- |  ---- |");
      communityRepoData.map((entry) => {
        if (entry.topics.includes("alchemyst-awesome-saas")) {
          console.log(
            `| [**${entry.full_name}**](https://github.com/${entry.full_name}) | ${entry.stargazers_count} | ${entry.description} | ${processTags(entry.topics)}`
          );
        }
      });
      postMessageForCommunity();
    });
};

const main = () => {
  introduction();
  gatherReposFromTeam();
  gatherReposFromCommunity();
};

main();
