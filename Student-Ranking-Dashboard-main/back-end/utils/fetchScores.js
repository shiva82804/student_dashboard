const axios = require("axios");
const cheerio = require("cheerio");

// LeetCode Score
async function getLeetCodeScore(username) {
  if (!username) return 0;
  try {
    const query = {
      query: `
                query getUserProfile($username: String!) {
                    matchedUser(username: $username) {
                        username
                        submitStats: submitStatsGlobal {
                            acSubmissionNum {
                                difficulty
                                count
                            }
                        }
                        profile {
                            ranking
                            contestCount
                        }
                    }
                }
            `,
      variables: { username },
    };
    const res = await axios.post("https://leetcode.com/graphql", query, {
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/${username}`,
      },
    });
    const user = res.data.data.matchedUser;
    if (!user) return 0;

    const totalSolved =
      user.submitStats.acSubmissionNum.find((item) => item.difficulty === "All")
        ?.count || 0;
    const rank = user.profile?.ranking || 0;
    const contests = user.profile?.contestCount || 0;
    const score =
      totalSolved * 10 + Math.pow(rank - 1300, 2) / 10 + contests * 50;
    return Math.max(0, Math.round(score));
  } catch (err) {
    console.log("Error getting LeetCode score:", err.message);
    return 0;
  }
}
// Codeforces Score
async function getCodeforcesScore(username) {
  if (!username) return 0;
  try {
    const res = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    const user = res.data.result[0];
    const rating = user.rating || 0;
    const subs = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );
    const submissions = subs.data.result;
    const solvedProblems = new Set();
    const contestSet = new Set();
    submissions.forEach((sub) => {
      if (sub.verdict === "OK" && sub.problem) {
        const key = `${sub.problem.contestId}-${sub.problem.index}`;
        solvedProblems.add(key);
        if (sub.contestId) {
          contestSet.add(sub.contestId);
        }
      }
    });
    const score =
      solvedProblems.size * 2 +
      Math.pow(rating - 800, 2) / 10 +
      contestSet.size * 50;
    return Math.max(0, Math.round(score));
  } catch (err) {
    console.log("Error getting Codeforces score:", err.message);
    return 0;
  }
}
// CodeChef Score
async function getCodechefScore(username) {
  if (!username) return 0;
  try {
    const res = await axios.get(`https://www.codechef.com/users/${username}`);
    const $ = cheerio.load(res.data);
    const rating = parseInt($(".rating-number").first().text().trim()) || 0;
    let solved = 0;
    $(".rating-data-section.problems-solved strong").each((i, el) => {
      const text = $(el).text().replace(/\D/g, "");
      solved += parseInt(text, 10) || 0;
    });
    let contests = 0;
    const contestText = $(
      'section.rating-data-section ul li a:contains("Contests")'
    ).text();
    const match = contestText.match(/\d+/);
    if (match) {
      contests = parseInt(match[0]);
    }
    const score = solved * 2 + Math.pow(rating - 1200, 2) / 10 + contests * 50;
    return Math.max(0, Math.round(score));
  } catch (err) {
    console.log("Error getting CodeChef score:", err.message);
    return 0;
  }
}

// HackerRank Score
async function getHackerRankScore(username) {
  if (!username) return 0;
  try {
    const res = await axios.get(`https://www.hackerrank.com/${username}`);
    const $ = cheerio.load(res.data);
    const solvedText = $(
      'div.profile-section .profile-heading:contains("Solved Challenges")'
    )
      .next()
      .text()
      .replace(/\D/g, "");

    return parseInt(solvedText, 10) || 0;
  } catch (err) {
    console.log("Error getting HackerRank score:", err.message);
    return 0;
  }
}
async function calcScore(student) {
  try {
    const leetcode = await getLeetCodeScore(student.leetcode);
    const codeforces = await getCodeforcesScore(student.codeforces);
    const codechef = await getCodechefScore(student.codechef);
    const hackerrank = await getHackerRankScore(student.hackerrank);

    const totalScore = leetcode + codeforces + codechef + hackerrank;
    return totalScore;
  } catch (err) {
    console.log(`Score calculation failed for ${student.email}:`, err.message);
    return 0;
  }
}
module.exports = {
  calcScore,
};
