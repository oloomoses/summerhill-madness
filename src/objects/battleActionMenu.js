import BattleMenu from './battleMenu';


export default class BattleActionMenu extends BattleMenu {
  constructor(x, y, scene) {
    super(x, y, scene);
    this.addMenuItem('Attack');
    this.addMenuItem('Run Away');
  }

  confirm() {
    this.scene.events.emit('SelectedAction', this.menuItemIndex);
  }
}