async function loadData() {
  const res = await fetch('data.json');
  const data = await res.json();
  renderBracket(data.rounds);
  showWinner(data);
}

function renderBracket(rounds) {
  const bracket = document.getElementById("bracket");
  if (!bracket) return;
  bracket.innerHTML = "";

  rounds.forEach((round) => {
    const roundDiv = document.createElement("div");
    roundDiv.classList.add("round");

    round.matches.forEach((match) => {
      const matchDiv = document.createElement("div");
      matchDiv.classList.add("match");

      const teamA = document.createElement("div");
      teamA.classList.add("team");
      teamA.textContent = `${match.teamA} (${match.scoreA})`;

      const teamB = document.createElement("div");
      teamB.classList.add("team");
      teamB.textContent = `${match.teamB} (${match.scoreB})`;

      if (match.scoreA > match.scoreB) teamA.classList.add("winner");
      else if (match.scoreB > match.scoreA) teamB.classList.add("winner");

      matchDiv.appendChild(teamA);
      matchDiv.appendChild(teamB);
      roundDiv.appendChild(matchDiv);
    });

    bracket.appendChild(roundDiv);
  });
}

function showWinner(data) {
  const finalRound = data.rounds[data.rounds.length - 1];
  const finalMatch = finalRound.matches[0];
  const winner = finalMatch.scoreA > finalMatch.scoreB ? finalMatch.teamA : finalMatch.teamB;
  document.getElementById("winner-name").textContent = winner ? `— ${winner}` : "";
}

/* ---------------- Admin ---------------- */
if (document.getElementById("adminBracket")) {
  let data = null;
  const adminBracket = document.getElementById("adminBracket");
  const statusMessage = document.getElementById("statusMessage");

  loadAdmin();

  async function loadAdmin() {
    const res = await fetch("data.json");
    data = await res.json();
    renderAdmin(data.rounds);
  }

  function renderAdmin(rounds) {
    adminBracket.innerHTML = "";
    rounds.forEach((round, rIndex) => {
      const div = document.createElement("div");
      div.innerHTML = `<h3>${round.name}</h3>`;
      round.matches.forEach((match, mIndex) => {
        const row = document.createElement("div");
        row.classList.add("match");
        row.innerHTML = `
          <input value="${match.teamA}">
          <input type="number" value="${match.scoreA}">
          <input value="${match.teamB}">
          <input type="number" value="${match.scoreB}">
        `;
        const inputs = row.querySelectorAll("input");
        inputs.forEach((inp, i) => inp.addEventListener("change", () => {
          if (i === 0) match.teamA = inp.value;
          if (i === 1) match.scoreA = +inp.value;
          if (i === 2) match.teamB = inp.value;
          if (i === 3) match.scoreB = +inp.value;
        }));
        div.appendChild(row);
      });
      adminBracket.appendChild(div);
    });
  }

  document.getElementById("saveTokenBtn").onclick = () => {
    const token = document.getElementById("tokenInput").value.trim();
    if (token) {
      sessionStorage.setItem("githubToken", token);
      showStatus("🔑 Токен сохранён", "success");
    } else showStatus("Введите токен", "error");
  };

  document.getElementById("saveBtn").onclick = async () => {
    const token = sessionStorage.getItem("githubToken");
    if (!token) return showStatus("Нет токена", "error");

    const commitMsg = document.getElementById("commitMsg").value || "Обновление турнира";
    const username = "TBCxPayme";
    const repo = "CyberSport";
    const url = `https://api.github.com/repos/${username}/${repo}/contents/data.json`;
    const content = btoa(JSON.stringify(data, null, 2));

    try {
      const res = await fetch(url, { headers: { Authorization: `token ${token}` } });
      const file = await res.json();

      const update = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: commitMsg,
          content: content,
          sha: file.sha
        })
      });

      if (update.ok) showStatus("✅ Сохранено успешно!", "success");
      else showStatus("❌ Ошибка при сохранении", "error");
    } catch (err) {
      console.error(err);
      showStatus("⚠️ Ошибка соединения", "error");
    }
  };

  function showStatus(msg, type) {
    statusMessage.textContent = msg;
    statusMessage.className = "status-message " + (type === "success" ? "status-success" : "status-error");
    statusMessage.style.display = "block";
    setTimeout(() => statusMessage.style.display = "none", 4000);
  }
}
