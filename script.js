async function loadData() {
  try {
    const res = await fetch("data.json");
    const data = await res.json();
    renderRounds(data.rounds);
  } catch (err) {
    bracketEl.innerHTML = "<p>Ошибка загрузки данных</p>";
  }
}

function renderRounds(rounds) {
  bracketEl.innerHTML = "";

  rounds.forEach((round) => {
    const roundDiv = document.createElement("div");
    roundDiv.classList.add("round");

    const title = document.createElement("h3");
    title.textContent = round.name;
    title.style.textAlign = "center";
    title.style.color = "#00eaff";
    roundDiv.appendChild(title);

    round.matches.forEach((match) => {
      const matchDiv = document.createElement("div");
      matchDiv.classList.add("match");
      matchDiv.innerHTML = `
        <div class="team">${match.teamA} <span>${match.scoreA}</span></div>
        <div class="team">${match.teamB} <span>${match.scoreB}</span></div>
      `;
      roundDiv.appendChild(matchDiv);
    });

    bracketEl.appendChild(roundDiv);
  });

  const finalRound = rounds[rounds.length - 1];
  const finalMatch = finalRound.matches[0];
  const winner =
    finalMatch.scoreA > finalMatch.scoreB
      ? finalMatch.teamA
      : finalMatch.scoreB > finalMatch.scoreA
      ? finalMatch.teamB
      : null;

  if (winner) {
    titleEl.innerHTML = `${winner} 🏆`;
    titleEl.classList.add("gold");
  }
}
