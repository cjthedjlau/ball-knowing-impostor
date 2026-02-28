export const LOADING_PHRASES = [
  "Lacing up cleats...",
  "Tucking in the jersey...",
  "Chalking the batter's box...",
  "Taping the ankles...",
  "Stretching in the outfield...",
  "Warming up in the bullpen...",
  "Tightening the chin strap...",
  "Waxing the hockey stick...",
  "Adjusting the eye black...",
  "Pulling up the knee socks...",
  "Buckling the helmet...",
  "Calling the play in the huddle...",
  "Putting on the batting gloves...",
  "Inflating the ball...",
  "Checking the lineup card...",
  "Chalking the free throw line...",
  "Polishing the cleats...",
  "Getting the signals from the coach...",
  "Stepping into the batter's box...",
  "Tying the skates...",
];

export const getLoadingPhrase = () =>
  LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];