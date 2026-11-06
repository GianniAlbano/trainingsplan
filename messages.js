// Tägliche Nachricht auf „Heute“ (Englisch, ohne Namen). Rein regelbasiert, ohne KI.
// Gleiche Nachricht den ganzen Tag: Auswahl hängt nur vom Datum ab.
// Läuft im Browser (window.TP_MESSAGES) und in Node (module.exports), damit eine
// spätere Push-Benachrichtigung dieselben Texte nutzen kann.
(function (root) {
  const GREET = [
    "Good morning, sunshine!", "Hey legend!", "Rise and shine, future marathoner!", "Hello, speedy!",
    "Morning, champ!", "Hey you with the strong legs!", "Hi there, superstar!", "Well hello, marathon machine!",
    "Hey hey, happy feet!", "Guten Morgen… oops, wrong language. Good morning, legend!", "Look who's up, the runner of the year!",
    "Hello, fast friend!", "Ahoy, captain of the running crew!", "Hey there, kilometre collector!"
  ];
  // Kommen öfter: an etwa jedem zweiten Tag
  const GREET_SWEET = ["Hey sexy!", "Hey beautiful!", "Hello, gorgeous!", "Hey good-looking!", "Hey handsome!", "Good morning, beautiful!"];
  const GREET_DAY = {
    1: ["Happy Monday! Fresh week, fresh legs.", "Monday again, and you're still awesome."],
    5: ["It's Friday, you legend!", "Hello Friday, hello weekend vibes!"],
    6: ["Happy Saturday, runner!", "Saturday mood: unstoppable."],
    0: ["Sunday vibes, runner!", "Happy Sunday, sunshine!"]
  };
  const BODY = {
    rest: [
      "Today is a rest day. Your only job: be a happy couch potato. Muscles grow while you chill.",
      "Rest day! Put your feet up, your legs have earned it. Recovery is training too, just comfier.",
      "No running today. Hydrate, stretch a little and let your body do its quiet magic.",
      "Rest day = upgrade day. Your body is installing new fitness. Please don't interrupt the download.",
      "Official orders: nap if you can, snack if you want, smile because you're doing great.",
      "Today we rest like professionals. Does a long walk to the fridge count as cross-training?"
    ],
    easy: [
      "Easy run on the menu. Slow and chatty: if you can't talk, you're going too fast.",
      "Today is an easy run. Enjoy the scenery, breathe and keep it gentle.",
      "Easy-peasy run day! Relaxed pace, happy heart, zero heroics.",
      "Time for an easy run. Think Sunday stroll, but in running shoes.",
      "Easy run today, the secret sauce of every marathon. Low effort, big reward."
    ],
    long: [
      "It's long run day! Pack a snack, pick a good playlist and enjoy the journey.",
      "Long run today! Every kilometre is a little deposit in your marathon bank.",
      "Long and slow is the name of the game today. Berlin gets closer with every step.",
      "Today is the big one of the week. Start easy, drink often, finish proud."
    ],
    interval: [
      "Interval day! Time to wake up those fast legs. Warm up well, then go get it.",
      "Speed time! Short, fast, fun, and the recovery jogs are part of the magic.",
      "Intervals today. It'll be spicy, but you're spicier.",
      "Today you get to feel fast. Intervals are on, so lace up and fly."
    ],
    tempo: [
      "Tempo run today: comfortably hard, like a really good playlist.",
      "Tempo time! Find that strong, steady rhythm and hold it like a pro.",
      "Today's tempo run teaches your body to love working hard. Steady and strong!"
    ],
    race: [
      "IT'S RACE DAY! The training is in the bank. Start easy, smile at the crowds and enjoy every metre.",
      "Race day! You've done the work, now go collect the fun. Start slow, finish strong."
    ],
    boulder: [
      "Bouldering today! Climb high, have fun and give your running legs a little holiday.",
      "Climbing day! Stronger grip, stronger core, happy legs on a break. Win-win-win."
    ],
    strength: [
      "Strength day! Strong hips, happy knees. A few minutes now saves many later.",
      "Stability time! Tiny exercises, big difference for your knees and ankles."
    ],
    cross: [
      "Cross-training today. Moving is moving, enjoy something different!",
      "Something different today. Your running legs say thank you."
    ],
    done: [
      "You already did it today! Look at you. Feet up, snack in hand, you've earned both.",
      "Training done. Now the best part: recovery. So proud of you!",
      "Mission complete for today. That's another brick in your marathon wall.",
      "Done and dusted! Your future self at the finish line is cheering already."
    ],
    sick: [
      "Take it easy today. Getting better is the most important workout right now.",
      "Rest and recover. Your plan will wait for you, the marathon isn't going anywhere.",
      "Couch, tea, blanket: that's today's training plan. Get well soon!"
    ]
  };
  // Tipp für morgen, wenn heute Ruhe oder locker ist
  const TOMORROW = {
    long: [
      "Long run tomorrow, so eat well today: pasta is basically a training tool.",
      "Big run tomorrow! Fuel up tonight, drink plenty of water and get to bed early."
    ],
    race: [
      "Race tomorrow! Easy legs today, good food, early night. You're ready.",
      "Tomorrow is race day. Lay out your kit tonight and eat something you know works."
    ],
    interval: [
      "Intervals tomorrow, so a good dinner and some extra sleep tonight will pay off.",
      "Fast legs needed tomorrow. Treat them nicely today!"
    ]
  };
  const LABEL = { rest:"Rest day", easy:"Easy run", long:"Long run", interval:"Intervals", tempo:"Tempo run", race:"Race day",
    boulder:"Bouldering", strength:"Strength", cross:"Cross-training", done:"Done for today", sick:"Recovery mode" };
  const MILESTONES = [300, 250, 200, 150, 100, 75, 50, 30, 21, 14, 10, 7, 5, 3, 2];

  function hash(s){ let h = 2166136261; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  const pick = (arr, seed) => arr[hash(seed) % arr.length];

  // ctx: { date:"JJJJ-MM-TT", weekday:0–6 (So = 0), kind, tomorrow, daysToRace, raceName }
  // kind: rest | easy | long | interval | tempo | race | boulder | strength | cross | done | sick
  // tomorrow: long | race | interval | null
  function build(ctx){
    const d = ctx.date, kind = BODY[ctx.kind] ? ctx.kind : "rest";
    const dayGreet = GREET_DAY[ctx.weekday];
    const r = hash(d + "w") % 10;
    const greet = r < 5 ? pick(GREET_SWEET, d + "g") : dayGreet && r < 7 ? pick(dayGreet, d + "g") : pick(GREET, d + "g");
    const parts = [greet, pick(BODY[kind], d + kind)];
    if (ctx.tomorrow && TOMORROW[ctx.tomorrow] && (kind === "rest" || kind === "easy" || kind === "done" || kind === "boulder" || kind === "strength"))
      parts.push(pick(TOMORROW[ctx.tomorrow], d + "t"));
    const n = ctx.daysToRace;
    if (n > 1 && MILESTONES.includes(n)) parts.push(`Only ${n} days until ${ctx.raceName || "race day"}!`);
    else if (n === 1 && kind !== "race") parts.push(`${ctx.raceName || "The race"} is tomorrow!`);
    return { label: LABEL[kind], text: parts.join(" ") };
  }
  const api = { build, LABEL };
  if (typeof module === "object" && module.exports) module.exports = api; else root.TP_MESSAGES = api;
})(typeof window !== "undefined" ? window : globalThis);
