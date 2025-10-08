async function loadData() {
  const res = await fetch("data.json?nocache=" + new Date().getTime());
  const data = await res.json();
  const container = document.getElementById("tournament");
  container.innerHTML = "";

  data.matches.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "match";
    div.innerHTML = `
      <div class="team ${m.scoreA > m.scoreB ? 'winner' : ''}">
        ${m.teamA} <span>${m.scoreA}</span>
      </div>
      <div class="team ${m.scoreB > m.scoreA ? 'winner' : ''}">
        ${m.teamB} <span>${m.scoreB}</span>
      </div>`;
    container.appendChild(div);
  });

  const finalMatch = data.matches[data.matches.length - 1];
  let champion = null;
  if (finalMatch.scoreA > finalMatch.scoreB) champion = finalMatch.teamA;
  else if (finalMatch.scoreB > finalMatch.scoreA) champion = finalMatch.teamB;
  if (champion) showWinner(champion);
}

function showWinner(name) {
  const el = document.getElementById("winner");
  el.textContent = `🏆 ${name}`;
  el.classList.add("winner-title");
}

loadData();
