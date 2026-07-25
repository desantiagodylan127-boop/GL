const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const healthHook = `
    const team = currentTarget.team === 'player' ? state.playerTeam : state.enemyTeam;
    const oppTeam = currentTarget.team === 'player' ? state.enemyTeam : state.playerTeam;
    
    const voss = team.find(u => u.characterId === 'warlord_drake_voss' && u.activeInBattle && u.hp > 0);
    if (voss) applyStatus(state, voss, 'Taunt', 1, false);
    
    const kane = team.find(u => u.characterId === 'torr_kane' && u.activeInBattle && u.hp > 0);
    if (kane) applyStatus(state, kane, 'Taunt', 1, false);
    
    const talon = oppTeam.find(u => u.characterId === 'mire_talon' && u.activeInBattle && u.hp > 0);
    if (talon) applyStatus(state, talon, 'Offense Up', 2, false);
    
    const hollow = team.find(u => u.characterId === 'hollow' && u.activeInBattle && u.hp > 0 && u.id === currentTarget.id);
    if (hollow) {
        if (!hollow.dynamicState) hollow.dynamicState = {};
        if (!hollow.dynamicState.healthDropBonusTurn) {
            hollow.dynamicState.healthDropBonusTurn = true;
            hollow.turnMeter = 100;
            logBattleEvent(state, \`⏩ Hollow gains a Bonus Turn (Dropped below 50% Health)!\`, 'buff');
        }
    }
    
    if (currentTarget.statuses.some(s => s.name === 'Frostbite')) {
        const voren = oppTeam.find(u => u.characterId === 'commander_voren' && u.activeInBattle && u.hp > 0);
        if (voren) {
            applyStatus(state, voren, 'Retribution', 1, false);
            applyStatus(state, voren, 'Tenacity Up', 1, false);
        }
        
        const glaze = oppTeam.find(u => u.characterId === 'glaze' && u.activeInBattle && u.hp > 0);
        if (glaze) {
            applyStatus(state, glaze, 'Offense Up', 2, false);
        }
    }
`;

c = c.replace(/(const fiftyPercent = currentTarget\.maxHp \* 0\.5;\n    if \(currentTarget\.hp < fiftyPercent\) \{\n        if \(\!currentTarget\.dynamicState\) currentTarget\.dynamicState = \{\};\n        if \(\!currentTarget\.dynamicState\.fellBelow50HP\) \{\n            currentTarget\.dynamicState\.fellBelow50HP = true;)/, 
`$1\n${healthHook}\n`);
fs.writeFileSync('src/utils/combatEngine.ts', c);
