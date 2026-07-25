const fs = require('fs');
let c = fs.readFileSync('src/utils/combatEngine.ts', 'utf8');

const bfHook = `
       let dmgPerc = 0.05;
       if (dot.name === 'Burning') dmgPerc = 0.15;
       else if (dot.name === 'Battlefield Corruption') dmgPerc = 0.10;
       
       totalDmg += Math.round(unit.maxHp * dmgPerc * (dot.count || 1));
       
       if (dot.name === 'Battlefield Corruption') {
           const oppTeam = unit.team === 'player' ? state.enemyTeam : state.playerTeam;
           const voss = oppTeam.find(u => u.position === 0 && u.characterId === 'warlord_drake_voss' && u.activeInBattle && u.hp > 0);
           if (voss) {
               oppTeam.forEach(a => {
                   if (a.activeInBattle && a.hp > 0 && (a.tags.includes('Morvek Survivor') || checkHasTag(a, 'Morvek Survivor')) && !hasStatusFlag(a, 'prevent_tm_gain')) {
                       a.turnMeter = Math.min(100, a.turnMeter + 2);
                   }
               });
           }
           const talon = oppTeam.find(u => u.characterId === 'mire_talon' && u.activeInBattle && u.hp > 0);
           if (talon && !hasStatusFlag(talon, 'prevent_tm_gain')) talon.turnMeter = Math.min(100, talon.turnMeter + 5);
           
           const veil = oppTeam.find(u => u.characterId === 'ashen_veil' && u.activeInBattle && u.hp > 0);
           if (veil && !hasStatusFlag(veil, 'prevent_tm_gain')) veil.turnMeter = Math.min(100, veil.turnMeter + 5);
       }
`;

c = c.replace(/const dmgPerc = dot\.name === 'Burning' \? 0\.15 : 0\.05;\n       totalDmg \+\= Math\.round\(unit\.maxHp \* dmgPerc \* \(dot\.count \|\| 1\)\);/, bfHook);

fs.writeFileSync('src/utils/combatEngine.ts', c);
