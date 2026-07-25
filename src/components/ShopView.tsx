import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Coins, ShoppingBag, ShoppingCart, Shield, 
  Skull, Wrench, HardDrive, Swords, Gift, Box, Info, Check, RefreshCw
} from 'lucide-react';
import { SaveState, Character } from '../types';
import { getAllCharacters } from '../data/characters';
import { RAID_SCHEDULE } from '../data/raids';
import { 
  SHIPMENT_GEAR, RAID_UPGRADE_MATERIALS, SHARD_SHOP_ITEMS,
  SIEGE_STORE_ITEMS, BLACK_MARKET_ITEMS, GACHA_PACKS, 
  ShopItemOffer, GachaPack 
} from '../data/shops';

interface ShopViewProps {
  saveState: SaveState;
  onUpdateState: (newState: SaveState) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  saveState,
  onUpdateState
}) => {
  const [shopTab, setShopTab] = React.useState<'shipments' | 'bar_stand' | 'raid' | 'shard' | 'siege' | 'black_market'>('shipments');
  const [timerString, setTimerString] = React.useState<string>('--:--:--');

  // Gacha opening state
  const [gachaReveal, setGachaReveal] = React.useState<{
    packName: string;
    rewards: { name: string; qty: number; icon: string; itemId?: string; isUnlock?: boolean }[];
  } | null>(null);
  const [isOpening, setIsOpening] = React.useState<boolean>(false);

  // Shop Rotation Math (every 4 hours)
  const blockMs = 4 * 60 * 60 * 1000;
  const currentBlock = Math.floor(Date.now() / blockMs);

  // Countdown timer to next rotation
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const nextBlockTime = (currentBlock + 1) * blockMs;
      const msLeft = nextBlockTime - now;

      if (msLeft <= 0) {
        setTimerString('00:00:00');
      } else {
        const hrs = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((msLeft / 1000 / 60) % 60);
        const secs = Math.floor((msLeft / 1000) % 60);
        setTimerString(`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentBlock, blockMs]);

  // Seeded Randomizer (splitmix32) to generate stable rotation contents
  function splitmix32(a: number) {
    return function() {
      a |= 0;
      a = a + 0x9e3779b9 | 0;
      let t = a ^ a >>> 16;
      t = Math.imul(t, 0x21f0aaad);
      t = t ^ t >>> 15;
      t = Math.imul(t, 0x735a2d97);
      return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }
  }

  // Auto exchange extra shards for Shard Shop currency
  React.useEffect(() => {
    let stateCopy: any = null;
    let totalCurrencyGained = 0;
    
    Object.keys(saveState.inventory).forEach(key => {
       if (key.startsWith('shards_')) {
          const charId = key.replace('shards_', '');
          const prog = saveState.characters[charId];
          const hasShardSurplus = saveState.inventory[key] > 330;
          
          if ((prog && prog.stars >= 7 && saveState.inventory[key] > 0) || (hasShardSurplus)) {
             if (!stateCopy) stateCopy = { ...saveState };
             
             let amountToConvert = 0;
             if (prog && prog.stars >= 7) {
                 amountToConvert = stateCopy.inventory[key];
                 stateCopy.inventory[key] = 0;
             } else if (hasShardSurplus) {
                 amountToConvert = stateCopy.inventory[key] - 330;
                 stateCopy.inventory[key] = 330;
             }

             if (amountToConvert > 0) {
                 totalCurrencyGained += Math.ceil(amountToConvert * 15);
             }
          }
       }
    });

    if (stateCopy && totalCurrencyGained > 0) {
       stateCopy.inventory['shard_token'] = (stateCopy.inventory['shard_token'] || 0) + totalCurrencyGained;
       alert(`Exchange terminal: Your excess shards were converted into +${totalCurrencyGained.toLocaleString()} Shard Tokens.`);
       onUpdateState(stateCopy);
    }
  }, [saveState.inventory]);

  // Helper to retrieve character details cleanly
  const allCharacters: Character[] = React.useMemo(() => getAllCharacters(), []);

  // Filter characters to ONLY "Farmable" (legacy/marquee) and "past Conquest" characters
  const eligibleCharacters = React.useMemo(() => {
    const conquestIds = [
      'vader_skywalker_death', 'ahsoka_clone_wars', 'moff_gideon_dark_trooper', 
      'kix_conquest', 'triple_zero_conquest', 'bt_one_conquest'
    ];

    const raidExclusiveIds = [
      'ig90', 'rotta_hutt', 'shaak_ti', 'commander_bly', 'atat_driver', 'eeth_koth', 'darth_maul_theed'
    ];

    return allCharacters.filter(char => {
      // Exclude raid exclusive characters completely from normal shops and gacha
      if (raidExclusiveIds.includes(char.id)) {
        return false;
      }

      // Conquest characters are explicitly allowed and bypassing negative filters
      if (conquestIds.includes(char.id)) {
        return true;
      }

      if (char.isSummon || char.isLegend) return false;
      
      const tagsLower = char.tags.map(t => t.toLowerCase());
      if (
        tagsLower.includes('galactic legend') ||
        tagsLower.includes('journey character') ||
        tagsLower.includes('npc') ||
        tagsLower.includes('raid boss') ||
        tagsLower.includes('summon')
      ) {
        return false;
      }
      
      const glAndJourneyIds = [
        'gl_leia', 'luke_skywalker_gl', 'gl_darth_sidious', 'jabba', 'master_kenobi', 'lord_vader', 'rey_gl', 
        'eternal_fire_grievous', 'immortal_admiral_trench', 'hondo_ohnaka_gl', 'maz_kanata_gl', 'grand_admiral_thrawn', 
        'ahsoka_tano_grey', 'general_skywalker', 'obi_wan_kenobi', 'darth_vader', 'chewbacca', 'han_solo', 
        'commander_luke_skywalker', 'grand_master_yoda', 'padme_amidala', 'darth_revan', 'jedi_revan', 'malak',
        'starkiller', 'executor', 'profundity', 'chimera', 'malevolence', 'negotiator'
      ];
      if (glAndJourneyIds.includes(char.id)) {
        return false;
      }
      
      if (char.acquisition === 'journey' || char.acquisition === 'galactic_legend') {
        return false;
      }
      
      return true;
    });
  }, [allCharacters]);

  // Generate dynamic rotating items seeded by current 4-hour block
  const rotatedItems = React.useMemo(() => {
    const rng = splitmix32(currentBlock);

    function seededShuffle<T>(arr: T[]): T[] {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    // Dynamic Shard Offers for ONLY farmable and past conquest characters
    const shuffledChars = seededShuffle<Character>(eligibleCharacters);

    // 1. SHIPMENTS
    const shipmentShards: ShopItemOffer[] = shuffledChars.slice(0, 6).map((char, index) => {
      const useCredits = rng() > 0.4;
      return {
        itemId: `shards_${char.id}`,
        name: `${char.name} Shards`,
        qty: 5,
        currency: useCredits ? 'credits' : 'crystals',
        price: useCredits ? 12000 : 250,
        characterId: char.id
      };
    });
    // Shipments now contains the entire SHIPMENT_GEAR array so that all 100+ items are present for players!
    const shipmentGear = SHIPMENT_GEAR;

    // 2. RAID SHOP
    const todayIndex = new Date().getDay();
    const activeSched = RAID_SCHEDULE.find(item => item.dayIndex === todayIndex);
    const activeChar = activeSched ? allCharacters.find(c => c.id === activeSched.characterId) : null;
    
    const raidExclusiveOffers: ShopItemOffer[] = [];
    if (activeChar) {
      raidExclusiveOffers.push({
        itemId: `shards_${activeChar.id}`,
        name: `${activeChar.name} Shards (Raid Exclusive)`,
        qty: 10,
        currency: 'raid_token',
        price: 800,
        characterId: activeChar.id
      });
    }

    const raidShards: ShopItemOffer[] = shuffledChars.slice(6, 11).map(char => ({
      itemId: `shards_${char.id}`,
      name: `${char.name} Shards`,
      qty: 5,
      currency: 'raid_token',
      price: 600,
      characterId: char.id
    }));
    const raidMats = seededShuffle(RAID_UPGRADE_MATERIALS).slice(0, 4);

    // 3. SHARD SHOP
    const shardShards: ShopItemOffer[] = shuffledChars.slice(11, 16).map(char => ({
      itemId: `shards_${char.id}`,
      name: `${char.name} Shards`,
      qty: 5,
      currency: 'shard_token',
      price: 500,
      characterId: char.id
    }));
    const shardMats = seededShuffle(SHARD_SHOP_ITEMS).slice(0, 4);

    // 4. SIEGE STORE
    const siegeShards: ShopItemOffer[] = shuffledChars.slice(16, 21).map(char => ({
      itemId: `shards_${char.id}`,
      name: `${char.name} Shards`,
      qty: 5,
      currency: 'siege_token',
      price: 500,
      characterId: char.id
    }));
    const siegeMats = seededShuffle(SIEGE_STORE_ITEMS).slice(0, 4);

    // 5. BLACK MARKET
    const bmShards: ShopItemOffer[] = shuffledChars.slice(21, 24).map(char => ({
      itemId: `shards_${char.id}`,
      name: `Black Market ${char.name} Shards`,
      qty: 10,
      currency: rng() > 0.5 ? 'credits' : 'crystals',
      price: rng() > 0.5 ? 250000 : 600,
      characterId: char.id
    }));
    const bmMats = seededShuffle(BLACK_MARKET_ITEMS).slice(0, 3);

    return {
      shipments: [...shipmentShards, ...shipmentGear],
      raid: [...raidExclusiveOffers, ...raidShards, ...raidMats],
      shard: [...shardShards, ...shardMats],
      siege: [...siegeShards, ...siegeMats],
      black_market: [...bmShards, ...bmMats]
    };
  }, [currentBlock, eligibleCharacters, allCharacters]);

  // Handle purchasing a single item
  function handleBuy(offer: ShopItemOffer, tabName: string) {
    const purchaseKey = `shop_bought_${currentBlock}_${tabName}_${offer.itemId}`;
    if (saveState.inventory[purchaseKey]) {
      alert("This item has already been purchased for this rotation!");
      return;
    }

    const copy = { ...saveState };

    // Currency verification
    const checkCurrency = (currencyCode: string, currencyName: string, amount: number) => {
      let balance = 0;
      if (currencyCode === 'credits') balance = copy.credits;
      else if (currencyCode === 'crystals') balance = copy.crystals;
      else balance = copy.inventory[currencyCode] || 0;

      if (balance < amount) {
        alert(`Insufficient ${currencyName} to complete this purchase!`);
        return false;
      }

      if (currencyCode === 'credits') { copy.credits -= amount; }
      else if (currencyCode === 'crystals') { copy.crystals -= amount; }
      else { copy.inventory[currencyCode] = balance - amount; }

      return true;
    };

    let currName = 'Credits';
    if (offer.currency === 'crystals') currName = 'Kyber Crystals';
    if (offer.currency === 'raid_token') currName = 'Raid Tokens';
    if (offer.currency === 'shard_token') currName = 'Shard Tokens';
    if (offer.currency === 'siege_token') currName = 'Siege Tokens';

    if (!checkCurrency(offer.currency, currName, offer.price)) return;

    // Persist sold out status
    copy.inventory[purchaseKey] = 1;

    // Special energy logic
    if (offer.itemId === 'refill_energy') {
      copy.energy = (copy.energy || 0) + offer.qty;
      copy.battleLog.push(`⚡ Purchased energy refill: Added +${offer.qty} Tactical Energy.`);
      onUpdateState(copy);
      alert(`Acquired +${offer.qty} Tactical Energy! Current reserves: ${copy.energy}`);
      return;
    }

    // Shard auto conversion or roster increment
    let isMaxedShardSelection = false;
    if (offer.itemId.startsWith('shards_') && offer.characterId) {
      const char = copy.characters[offer.characterId];
      if (char && char.stars >= 7) {
        isMaxedShardSelection = true;
        const rewardCurrency = offer.qty * 30; // Shard tokens
        copy.inventory['shard_token'] = (copy.inventory['shard_token'] || 0) + rewardCurrency;
        copy.battleLog.push(`✨ Shard Conversion: Purchased ${offer.qty} maxed-out ${offer.name}. Converted to +${rewardCurrency} Shard Tokens!`);
        alert(`Your ${offer.name.replace(' Shards', '')} is already at 7 Stars! Transferred purchase into +${rewardCurrency} Shard Tokens!`);
      }
    }

    if (!isMaxedShardSelection) {
      copy.inventory[offer.itemId] = (copy.inventory[offer.itemId] || 0) + offer.qty;

      if (offer.itemId.startsWith('shards_') && offer.characterId) {
        const char = copy.characters[offer.characterId];
        if (char && !char.unlocked && copy.inventory[offer.itemId] >= 80) {
          char.unlocked = true;
          char.stars = 4;
          char.level = 40;
          copy.battleLog.push(`🌟 Character ${offer.name} unlocked at 4-Stars baseline after acquiring ${copy.inventory[offer.itemId]} raw shards!`);
          alert(`Congratulations! You gathered ${copy.inventory[offer.itemId]} shards and unlocked ${offer.name}!`);
        }
      }
    }

    copy.battleLog.push(`🛒 Transacted order: Purchased ${offer.qty}x ${offer.name} for ${offer.price} ${currName}.`);
    onUpdateState(copy);
    alert(`Acquired ${offer.qty}x ${offer.name}!`);
  }

  // Handle Bar Stand Gacha Interaction
  function handleOpenGacha(pack: GachaPack) {
    if (saveState.crystals < pack.costCrystals) {
      alert("Insufficient crystals!");
      return;
    }

    setIsOpening(true);

    // Short delays to simulate pack opening feel
    setTimeout(() => {
      const copy = { ...saveState };
      copy.crystals -= pack.costCrystals;

      const randomChars = [...eligibleCharacters];
      const chosenChar = randomChars[Math.floor(Math.random() * randomChars.length)];
      const shardItemId = `shards_${chosenChar.id}`;

      const rewards: { name: string; qty: number; icon: string; itemId?: string; isUnlock?: boolean }[] = [];

      if (pack.packType === 'cantina') {
        const qty = Math.floor(Math.random() * 4) + 5; // 5-8 shards
        rewards.push({ name: `${chosenChar.name} Shards`, qty, icon: '🧬', itemId: shardItemId });
      } else if (pack.packType === 'premium') {
        const isUnlock = Math.random() < 0.20;
        if (isUnlock) {
          rewards.push({ name: `FULL UNLOCK: ${chosenChar.name}`, qty: 80, icon: '🌟', itemId: shardItemId, isUnlock: true });
        } else {
          const qty = Math.floor(Math.random() * 6) + 10; // 10-15 shards
          rewards.push({ name: `${chosenChar.name} Shards`, qty, icon: '🧬', itemId: shardItemId });
        }
      } else if (pack.packType === 'mega') {
        // Ultimate Relic & Conquest Booster
        const qty = 20; // Focused 20 shards
        rewards.push({ name: `${chosenChar.name} Shards`, qty, icon: '🧬', itemId: shardItemId });
        
        // plus random high relic mats
        const relicItems = ['zinbiddle_card', 'electrium_conductor', 'aurodium_heatsink', 'dark_matter_core', 'beskar_alloy'];
        const chosenRelic = relicItems[Math.floor(Math.random() * relicItems.length)];
        const relicQty = Math.floor(Math.random() * 3) + 3; // 3 to 5
        rewards.push({ name: chosenRelic.replace('_', ' ').toUpperCase(), qty: relicQty, icon: '⚙️', itemId: chosenRelic });
        
        // and 10,000 Credits
        rewards.push({ name: 'Standard Credits Cash', qty: 10000, icon: '🪙', itemId: 'credits' });
      } else if (pack.packType === 'relic') {
        // Relic & Core Materials Pack
        const mats = ['zinbiddle_card', 'electrium_conductor', 'aurodium_heatsink', 'dark_matter_core', 'carbonite_matrix', 'beskar_alloy', 'hyper_alloy'];
        const chosenMat = mats[Math.floor(Math.random() * mats.length)];
        const qty = Math.floor(Math.random() * 3) + 3; // 3 to 5
        rewards.push({ name: chosenMat.replace('_', ' ').toUpperCase(), qty, icon: '⚙️', itemId: chosenMat });
      } else if (pack.packType === 'faction') {
        // Multi-draw faction: draws 5 sets of 10 to 100 shards
        let factionPool = eligibleCharacters;
        if (pack.factionTag) {
          const tagLower = pack.factionTag.toLowerCase();
          factionPool = eligibleCharacters.filter(c => {
            const matchTag = c.tags.some(t => {
              const tL = t.toLowerCase();
              return tL === tagLower || tL.includes(tagLower) || tagLower.includes(tL);
            });
            const matchFaction = c.faction && (
              c.faction.toLowerCase() === tagLower || 
              c.faction.toLowerCase().includes(tagLower) ||
              tagLower.includes(c.faction.toLowerCase())
            );
            return matchTag || matchFaction;
          });
        }

        if (factionPool.length === 0) {
          factionPool = eligibleCharacters;
        }

        for (let i = 0; i < 5; i++) {
          const drawChar = factionPool[Math.floor(Math.random() * factionPool.length)];
          const qtyOptions = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100];
          const qty = qtyOptions[Math.floor(Math.random() * qtyOptions.length)];
          rewards.push({
            name: `${drawChar.name} Shards`,
            qty,
            icon: '🧬',
            itemId: `shards_${drawChar.id}`
          });
        }
      }

      // Add rewards to state copy
      rewards.forEach(r => {
        if (r.itemId) {
          if (r.itemId === 'credits') {
            copy.credits += r.qty;
            return;
          }

          let applyShards = true;
          if (r.itemId.startsWith('shards_')) {
            const charId = r.itemId.replace('shards_', '');
            const char = copy.characters[charId];
            if (char && char.stars >= 7) {
              applyShards = false;
              const conversionTkns = r.qty * 30;
              copy.inventory['shard_token'] = (copy.inventory['shard_token'] || 0) + conversionTkns;
              copy.battleLog.push(`✨ Shard Conversion: Drew ${r.qty}x maxed ${r.name}. Converted to +${conversionTkns} Shard Tokens.`);
            }
          }

          if (applyShards) {
            copy.inventory[r.itemId] = (copy.inventory[r.itemId] || 0) + r.qty;
            if (r.itemId.startsWith('shards_')) {
              const charId = r.itemId.replace('shards_', '');
              const char = copy.characters[charId];
              if (char && !char.unlocked && copy.inventory[r.itemId] >= 80) {
                char.unlocked = true;
                char.stars = 4;
                char.level = 40;
                copy.battleLog.push(`🌟 Character ${char.name} unlocked during Bar Stand gacha draw!`);
              }
            }
          }
        }
      });

      copy.battleLog.push(`🎁 Opened Bar Stand Pack: ${pack.name} for ${pack.costCrystals} Crystals.`);
      onUpdateState(copy);

      setGachaReveal({
        packName: pack.name,
        rewards
      });
      setIsOpening(false);
    }, 1200);
  }

  // Render correct currency indicator
  const renderCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'credits': return <Coins className="w-3.5 h-3.5 text-amber-500" />;
      case 'crystals': return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
      case 'raid_token': return <Shield className="w-3.5 h-3.5 text-amber-400" />;
      case 'shard_token': return <HardDrive className="w-3.5 h-3.5 text-purple-400" />;
      case 'siege_token': return <Swords className="w-3.5 h-3.5 text-cyan-400" />;
      default: return <Coins className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  // Main UI render
  return (
    <div className="space-y-6 animate-fadeIn" id="shop_container_view">
      
      {/* HEADER HERO BOARD */}
      <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-10 left-1/3 w-60 h-60 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="z-10">
          <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] px-3 py-1 rounded-full font-mono uppercase tracking-widest leading-none font-bold">
            Procurement & Exchanges
          </span>
          <h2 className="font-display text-2xl font-black text-white tracking-tight mt-3">COSMIC CONCOURSE</h2>
          <p className="text-zinc-400 text-xs mt-1.5 max-w-xl font-sans leading-relaxed">
            Acquire high-tier relic materials, negotiate blueprints, or test your fortune at the cantina bar stand. Rotates all pools every <span className="text-cyan-400 font-bold">4 Hours</span>.
          </p>
        </div>

        {/* ACCOUNT LIQUIDITY MATRIX */}
        <div className="bg-black/40 border border-zinc-850 p-4 rounded-2xl grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-xs text-white max-w-sm ml-auto z-10">
          <div>
            <span className="text-zinc-500 uppercase text-[9px] font-bold block mb-0.5">Credits</span>
            <div className="flex items-center gap-1.5 font-bold text-white text-sm">
              <Coins className="w-3.5 h-3.5 text-amber-500" /> {(saveState.credits || 0).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-zinc-500 uppercase text-[9px] font-bold block mb-0.5">Crystals</span>
            <div className="flex items-center gap-1.5 font-bold text-cyan-400 text-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {(saveState.crystals || 0).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-zinc-500 uppercase text-[9px] font-bold block mb-0.5">Raid Tkns</span>
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> {(saveState.inventory['raid_token'] || 0).toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-zinc-500 uppercase text-[9px] font-bold block mb-0.5">Shard Tkns</span>
            <div className="flex items-center gap-1.5 font-bold text-purple-400">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" /> {(saveState.inventory['shard_token'] || 0).toLocaleString()}
            </div>
          </div>
          <div className="col-span-2 border-t border-zinc-850 pt-2">
            <span className="text-zinc-500 uppercase text-[9px] font-bold block mb-0.5">Siege Tokens</span>
            <div className="flex items-center gap-1.5 font-bold text-cyan-400">
              <Swords className="w-3.5 h-3.5 text-cyan-400" /> {(saveState.inventory['siege_token'] || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* ROTATION TIME COUNTER */}
      <div className="flex justify-between items-center bg-zinc-950/40 border border-zinc-900 px-4 py-2.5 rounded-xl text-xs font-mono">
        <span className="text-zinc-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-500" /> Rotation Stock Lock
        </span>
        <span className="text-cyan-400 font-bold bg-cyan-950/30 border border-cyan-900/50 px-2.5 py-0.5 rounded flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3 animate-spin" /> {timerString}
        </span>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex gap-1.5 font-mono text-[9px] md:text-[10px] uppercase tracking-wider font-bold overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'shipments', label: 'Shipments', icon: <ShoppingCart className="w-3.5 h-3.5" />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { id: 'bar_stand', label: 'Bar Stand (Gacha)', icon: <Gift className="w-3.5 h-3.5" />, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
          { id: 'raid', label: 'Raid Shop', icon: <Shield className="w-3.5 h-3.5" />, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { id: 'shard', label: 'Shard Shop', icon: <HardDrive className="w-3.5 h-3.5" />, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          { id: 'siege', label: 'Siege Store', icon: <Swords className="w-3.5 h-3.5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
          { id: 'black_market', label: 'Black Market', icon: <Skull className="w-3.5 h-3.5" />, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' }
        ].map(t => (
          <button 
           key={t.id}
           onClick={() => setShopTab(t.id as any)} 
           className={`px-4 py-3 rounded-xl border transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${shopTab === t.id ? `${t.bg} ${t.color} border-current` : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
          >
           {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* SHOP TILES OR BAR STAND GACHA VIEW */}
      <div className="min-h-[300px]">
        {shopTab !== 'bar_stand' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rotatedItems[shopTab]?.map((offer, idx) => {
              const currentOwned = saveState.inventory[offer.itemId] || 0;
              const purchaseKey = `shop_bought_${currentBlock}_${shopTab}_${offer.itemId}`;
              const isBought = !!saveState.inventory[purchaseKey];
              const isRaidExclusive = offer.name.includes('Raid Exclusive');

              return (
                <div 
                  key={`${offer.itemId}-${idx}`} 
                  className={`bg-zinc-950 border p-4 rounded-2xl flex flex-col justify-between space-y-4 transition-all relative overflow-hidden ${
                    isBought 
                      ? 'border-zinc-900 opacity-60 bg-zinc-950/20' 
                      : isRaidExclusive
                      ? 'border-amber-500/50 bg-amber-950/5 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                      : 'border-zinc-900 hover:border-zinc-800 hover:shadow-lg'
                  }`}
                >
                  {isRaidExclusive && (
                    <div className="absolute top-0 right-0 bg-amber-500/20 border-l border-b border-amber-500/30 px-2 py-0.5 text-[8px] font-mono text-amber-300 font-bold uppercase rounded-bl-lg tracking-widest z-10">
                      Raid Reward
                    </div>
                  )}
                  {/* Top Header Card */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-1">
                        {isRaidExclusive ? '🧬 Raid Exclusive Shards' : offer.itemId.startsWith('shards_') ? '🧬 Character Shards' : offer.isLegendMat ? '⭐ Legend Resource' : '⚙️ Relic Material'}
                      </span>
                      <h4 className="font-display font-black text-white text-xs leading-tight">
                        {offer.name} <span className="opacity-40 font-normal">x{offer.qty}</span>
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded shrink-0">
                      Owned: {currentOwned}
                    </span>
                  </div>

                  {/* Transaction Action Panel */}
                  <div className="pt-3 border-t border-zinc-900/60 flex items-center justify-between gap-2">
                    <div className="text-zinc-500 font-mono text-[10px] uppercase">Cost</div>
                    {isBought ? (
                      <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900/40 border border-zinc-900 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold">
                        <Check className="w-3.5 h-3.5 text-zinc-600" /> OUT OF STOCK
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleBuy(offer, shopTab)}
                        className="flex items-center gap-1.5 text-xs font-mono bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 py-1.5 px-3 rounded-xl text-white transition font-bold"
                      >
                        <span>Requisition</span>
                        <span className="flex items-center gap-1 font-extrabold text-zinc-200">
                          {renderCurrencyIcon(offer.currency)} {offer.price.toLocaleString()}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* BAR STAND GACHA EXPERIENCE */
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-pink-950/10 to-purple-950/10 border border-pink-900/20 p-6 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/5 rounded-full blur-[90px] pointer-events-none"></div>
              
              <h3 className="font-display font-black text-pink-100 text-sm tracking-wider uppercase border-b border-pink-900/30 pb-2 flex items-center gap-2">
                <Gift className="w-4 h-4 text-pink-400" /> THE BAR STAND Blueprints & Recruits
              </h3>
              <p className="text-zinc-400 text-xs mt-2 font-sans leading-relaxed">
                Interact with smuggling rings, buy specialized gacha crates for crystals, and unlock powerful past conquests or obtain rare relic upgrade materials instantly!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {GACHA_PACKS.map(pack => (
                  <div 
                    key={pack.id} 
                    className="bg-zinc-950/60 border border-zinc-900/80 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-pink-900/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-pink-950/30 border border-pink-500/20 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {pack.icon}
                      </div>
                      <div>
                        <h4 className="font-display font-black text-white text-xs tracking-tight">{pack.name}</h4>
                        <p className="text-zinc-500 text-[11px] leading-tight mt-1">{pack.description}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenGacha(pack)}
                      className="w-full flex items-center justify-between text-xs font-mono bg-pink-950/30 hover:bg-pink-900 border border-pink-500/20 hover:border-pink-500/50 py-2.5 px-4 rounded-xl text-pink-300 hover:text-white transition font-black tracking-wider uppercase"
                    >
                      <span>Buy Pack</span>
                      <span className="flex items-center gap-1 text-white">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {pack.costCrystals} Crystals
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GACHA REVEAL DIALOG AND PACK ANIMATION MODAL */}
      <AnimatePresence>
        {isOpening && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4"
          >
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-6xl mb-6"
            >
              📦
            </motion.div>
            <h3 className="font-display font-black text-xl text-pink-400 uppercase tracking-widest animate-pulse">
              Cracking smuggle vault...
            </h3>
            <p className="text-zinc-500 font-mono text-xs mt-2">Integrating network authorization credentials...</p>
          </motion.div>
        )}

        {gachaReveal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            id="gacha_reveal_modal"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-md w-full space-y-6 shadow-glow relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>
              
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono text-pink-400 tracking-widest uppercase font-bold block">
                  Vault Decrypted
                </span>
                <h3 className="font-display font-black text-lg text-white uppercase">
                  {gachaReveal.packName}
                </h3>
              </div>

              {/* Loot List */}
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {gachaReveal.rewards.map((reward, i) => (
                  <div key={i} className="bg-black/60 border border-zinc-900 p-3.5 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block leading-none mb-1">
                          {reward.isUnlock ? 'INSTANT RECRUIT' : 'ACQUIRED'}
                        </span>
                        <h5 className="font-display font-bold text-white text-xs leading-tight">
                          {reward.name}
                        </h5>
                      </div>
                    </div>
                    <span className="font-mono font-black text-cyan-400 text-sm">
                      +{reward.qty}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setGachaReveal(null)}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-black font-mono py-3 rounded-xl uppercase tracking-wider transition text-xs shadow-glow"
              >
                CLAIM REWARDS
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
