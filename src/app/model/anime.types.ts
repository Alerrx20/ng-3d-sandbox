export interface AnimeSceneEntry {
  src: string;
  offsetX: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  offsetY: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  rotate: number;
}

export type AnimeTitle = {
  id: string;
  displayName: string;
};

export type MousePosition = {
  x: number;
  y: number;
};
