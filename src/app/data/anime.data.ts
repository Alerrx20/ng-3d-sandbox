import { AnimeSceneEntry } from '../model';

export const animeScenes: Record<string, AnimeSceneEntry[]> = {
  demonSlayer: [
    {
      src: 'assets/gifs/demon-slayer-1.gif',
      offsetX: { desktop: -460, tablet: -322, mobile: -184 },
      offsetY: { desktop: -190, tablet: -133, mobile: -76 },
      rotate: -8
    },
    {
      src: 'assets/gifs/demon-slayer-2.gif',
      offsetX: { desktop: -10, tablet: -7, mobile: -4 },
      offsetY: { desktop: -250, tablet: -210, mobile: -120 },
      rotate: 2
    },
    {
      src: 'assets/gifs/demon-slayer-3.gif',
      offsetX: { desktop: 520, tablet: 301, mobile: 172 },
      offsetY: { desktop: -100, tablet: -70, mobile: -40 },
      rotate: -4
    }
  ],

  silentVoice: [
    {
      src: 'assets/gifs/silent-voice-1.gif',
      offsetX: { desktop: -500, tablet: -350, mobile: -200 },
      offsetY: { desktop: -100, tablet: -70, mobile: -40 },
      rotate: 3
    },
    {
      src: 'assets/gifs/silent-voice-2.gif',
      offsetX: { desktop: -10, tablet: -7, mobile: -4 },
      offsetY: { desktop: -220, tablet: -189, mobile: -108 },
      rotate: -4
    },
    {
      src: 'assets/gifs/silent-voice-3.gif',
      offsetX: { desktop: 500, tablet: 294, mobile: 168 },
      offsetY: { desktop: -70, tablet: -49, mobile: -28 },
      rotate: -2
    }
  ],

  attackOnTitan: [
    {
      src: 'assets/gifs/attack-on-titan-1.gif',
      offsetX: { desktop: -570, tablet: -329, mobile: -188 },
      offsetY: { desktop: -110, tablet: -77, mobile: -44 },
      rotate: -5
    },
    {
      src: 'assets/gifs/attack-on-titan-2.gif',
      offsetX: { desktop: 50, tablet: 35, mobile: 20 },
      offsetY: { desktop: -220, tablet: -140, mobile: -80 },
      rotate: 4
    },
    {
      src: 'assets/gifs/attack-on-titan-3.gif',
      offsetX: { desktop: 450, tablet: 315, mobile: 180 },
      offsetY: { desktop: 20, tablet: 14, mobile: 8 },
      rotate: 10
    }
  ],

  spiritedAway: [
    {
      src: 'assets/gifs/spirited-away-1.gif',
      offsetX: { desktop: -550, tablet: -350, mobile: -200 },
      offsetY: { desktop: -100, tablet: -70, mobile: -40 },
      rotate: -5
    },
    {
      src: 'assets/gifs/spirited-away-2.gif',
      offsetX: { desktop: -10, tablet: -7, mobile: -4 },
      offsetY: { desktop: -220, tablet: -140, mobile: -80 },
      rotate: 3
    },
    {
      src: 'assets/gifs/spirited-away-3.gif',
      offsetX: { desktop: 540, tablet: 259, mobile: 148 },
      offsetY: { desktop: -100, tablet: -70, mobile: -40 },
      rotate: -7
    }
  ],

  bunnyGirl: [
    {
      src: 'assets/gifs/bunny-girl-1.gif',
      offsetX: { desktop: -470, tablet: -315, mobile: -180 },
      offsetY: { desktop: -100, tablet: -70, mobile: -40 },
      rotate: -2
    },
    {
      src: 'assets/gifs/bunny-girl-2.gif',
      offsetX: { desktop: -100, tablet: -70, mobile: -40 },
      offsetY: { desktop: -220, tablet: -140, mobile: -80 },
      rotate: -3
    },
    {
      src: 'assets/gifs/bunny-girl-3.gif',
      offsetX: { desktop: 480, tablet: 280, mobile: 160 },
      offsetY: { desktop: -100, tablet: -70, mobile: -40 },
      rotate: 2
    }
  ]
};
