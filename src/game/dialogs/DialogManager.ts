import { GameManager } from '../GameManager';

export interface GameDialogStep {
  actor: GameDialogActor;
  phrase: string;
  position: 'left' | 'right';
}

export interface GameDialogActor {
  id: string;
  image: string;
  title: string;
}

export interface GameDialog {
  id: string;
  steps: GameDialogStep[];
  onDialogFinishedTrigger?: string;
}

export class DialogManager {

  private static dialogs: GameDialog[];
  private static dialogStartCallback: (dialog: GameDialog) => void;

  public static initialize(dialogStartCallback: (dialog: GameDialog) => void) {
    this.dialogStartCallback = dialogStartCallback;
    this.dialogs = [];
  }

  public static registerDialog(dialog: GameDialog) {
    if (this.dialogs.find(el => el.id === dialog.id)) {
      throw new TypeError(`Can not register dialog with id: ${dialog.id}. Dialog with that id is already registered`);
    }

    this.dialogs.push(dialog);
  }

  public static registerDialogs(dialogs: GameDialog[]) {
    dialogs.forEach(el => DialogManager.registerDialog(el));
  }

  public static runDialog(id: string) {
    if (!this.dialogs || !this.dialogs.find(el => el.id === id)) {
      throw new TypeError(`Can not run dialog with id: ${id}. Dialog with that id is not registered`);
    }

    const dialog = DialogManager.dialogs.find(el => el.id === id);

    this.dialogStartCallback(dialog);
  }

  public static clear() {
    this.dialogs = [];
  }
}