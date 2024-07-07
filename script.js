let teamA = [];
let teamB = [];
let pastPairsA = [];
let pastPairsB = [];
let rounds = 1;
document.getElementById("pScreen").style.display = "none";
function setupTeams() {
    const teamASize = parseInt(document.getElementById('teamASize').value);
    const teamBSize = parseInt(document.getElementById('teamBSize').value);
    const numCourts = parseInt(document.getElementById('numCourts').value);
    document.getElementById("sScreen").style.display = "none";
    document.getElementById("pScreen").style.display = "block";
    teamA = generatePlayers('A', teamASize);
    teamB = generatePlayers('B', teamBSize);

    pastPairsA = [];
    pastPairsB = [];
    rounds = 1;

    displayTeams();
    setupMatches(numCourts);
}

function generatePlayers(team, size) {
    const players = [];
    for (let i = 1; i <= size; i++) {
        players.push(`${team}${i}`);
    }
    return players;
}

function displayTeams() {
    const teamsDiv = document.getElementById('teams');
    teamsDiv.innerHTML = `
        <div class="team">
            <h2>Team A</h2>
            <ul>
                ${teamA.map(player => `<li class="player">${player}</li>`).join('')}
            </ul>
        </div>
        <div class="team">
            <h2>Team B</h2>
            <ul>
                ${teamB.map(player => `<li class="player">${player}</li>`).join('')}
            </ul>
        </div>
    `;
}
function setupMatches(numCourts) {
    const matchesDiv = document.getElementById('matches');
    matchesDiv.innerHTML = `<h2>Round ${rounds}</h2>`;

    let availableA = [...teamA];
    let availableB = [...teamB];
    let unpairedA = [];
    let unpairedB = [];

    for (let i = 1; i <= numCourts; i++) {
        const court = document.createElement('div');
        court.className = 'court';
        const pairA = getUniquePair(availableA, pastPairsA, unpairedA);
        const pairB = getUniquePair(availableB, pastPairsB, unpairedB);

        court.innerHTML = `
            <h3>Court ${i}</h3>
            <div class="team-a-pair">${pairA}</div>
            <div class="team-b-pair">${pairB}</div>
        `;
        matchesDiv.appendChild(court);
    }

    // Add remaining players to unpaired lists
    unpairedA.push(...availableA);
    unpairedB.push(...availableB);

    // Display unpaired players
    if (unpairedA.length > 0 || unpairedB.length > 0) {
        const unpairedDiv = document.createElement('div');
        unpairedDiv.className = 'unpaired';
        unpairedDiv.innerHTML = `
            <h3>Unpaired Players</h3>
            <div class="unpaired-team-a">
                <h4>Team A:</h4>
                <ul>
                    ${unpairedA.map(player => `<li>${player}</li>`).join('')}
                </ul>
            </div>
            <div class="unpaired-team-b">
                <h4>Team B:</h4>
                <ul>
                    ${unpairedB.map(player => `<li>${player}</li>`).join('')}
                </ul>
            </div>
        `;
        matchesDiv.appendChild(unpairedDiv);
    }

    rounds++;
}

function getUniquePair(team, pastPairs, unpaired) {
    if (team.length < 2) {
        unpaired.push(...team);
        team.length = 0; // Empty the team array
        return 'Not enough players';
    }

    let player1, player2, pair;
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
        player1 = team.splice(Math.floor(Math.random() * team.length), 1)[0];
        player2 = team.splice(Math.floor(Math.random() * team.length), 1)[0];
        pair = [player1, player2].sort();
        attempts++;

        if (!pastPairs.some(p => p[0] === pair[0] && p[1] === pair[1])) {
            pastPairs.push(pair);
            return `${player1} & ${player2}`;
        }

        team.push(player1, player2);
    }

    // If no unique pair found, allow reuse of pairs
    player1 = team.splice(Math.floor(Math.random() * team.length), 1)[0];
    player2 = team.splice(Math.floor(Math.random() * team.length), 1)[0];
    pair = [player1, player2].sort();
    pastPairs.push(pair);
    return `${player1} & ${player2}`;
}

function nextRound() {
    const numCourts = parseInt(document.getElementById('numCourts').value);
    setupMatches(numCourts);
}