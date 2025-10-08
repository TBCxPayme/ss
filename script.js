async function loadData() {
  const res = await fetch("data.json");
  const data = await res.json();
  renderBracket(data.rounds);
}

function renderBracket(rounds) {
  const bracket = document.getElementById("bracket");
  const championDisplay = document.getElementById("champion");
  bracket.innerHTML = "";

  rounds.forEach((round) => {
    const roundDiv = document.createElement("div");
    roundDiv.classList.add("round");

    const title = document.createElement("h3");
    title.textContent = round.name;
    roundDiv.appendChild(title);

    round.matches.forEach((match) => {
      const matchDiv = document.createElement("div");
      matchDiv.classList.add("match");

      const teamA = document.createElement("div");
      const teamB = document.createElement("div");
      teamA.classList.add("team");
      teamB.classList.add("team");

      const winner = match.scoreA > match.scoreB ? match.teamA : match.teamB;
      if (round.name === "Финал") championDisplay.innerHTML = `🏆 ${winner}`;

      teamA.textContent = `${match.teamA} (${match.scoreA})`;
      teamB.textContent = `${match.teamB} (${match.scoreB})`;

      matchDiv.appendChild(teamA);
      matchDiv.appendChild(teamB);
      roundDiv.appendChild(matchDiv);
    });

    bracket.appendChild(roundDiv);
  });
}

loadData();
