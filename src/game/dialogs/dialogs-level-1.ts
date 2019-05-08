import { GameDialog, GameDialogActor } from './DialogManager';
import { LEVEL_1_TRIGGERS } from '../levels';

export const LEVEL_1_DIALOGS_IDS = {
  PROFESSOR_DIALOG: 'PROFESSOR_DIALOG',
};

const professorActor: GameDialogActor = {
  id: '1',
  image: '/dialog/professor.png',
  title: 'Professor'
};

export const LEVEL_1_DIALOGS: GameDialog[] = [
  {
    id: LEVEL_1_DIALOGS_IDS.PROFESSOR_DIALOG,
    steps: [
      {
        actor: professorActor,
        phrase: 'Are you okay, student?',
        position: 'left',
      },
      {
        actor: professorActor,
        phrase: 'Go get some sleep!',
        position: 'left',
      },
    ],
    onDialogFinishedTrigger: LEVEL_1_TRIGGERS.ON_PROFESSOR_DIALOG_FINISHED,
  }
];
