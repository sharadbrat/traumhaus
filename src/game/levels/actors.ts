import { GameDialogActor } from '../dialogs';

export const professorActor: GameDialogActor = {
  id: 'professorActor',
  image: '/dialog/professor.png',
  title: 'Professor'
};

export const playerActor: GameDialogActor = {
  id: 'playerActor',
  image: '/dialog/player.png',
  title: 'You'
};

export const ghostActor: GameDialogActor = {
  id: 'playerGhostActor',
  image: '/dialog/player_ghost.png',
  title: 'You'
};

export const signActor: GameDialogActor = {
  id: 'signActor',
  image: '/dialog/sign.png',
  title: 'Sign'
};

export const gameActor: GameDialogActor = {
  id: 'gameActor',
  title: 'Tutorial'
};
