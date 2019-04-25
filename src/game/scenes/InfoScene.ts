import Phaser from "phaser";
import { SceneIdentifier } from './SceneManager';

export default class InfoScene extends Phaser.Scene {
  constructor() {
    super(SceneIdentifier.INFO_SCENE);
  }

  create(): void {
    const content = [
      "Dungeon Dash!",
      "",
      "Use arrow keys to walk around the map!",
      "Press space while moving to dash-attack!",
      "",
      "Credits & more information at",
      "https://github.com/mipearson/dungeondash"
    ];
    const text = this.add.text(25, 25, content, {
      fontFamily: "sans-serif",
      color: "#ffffff"
    });
    text.setAlpha(0.9);
  }
}
