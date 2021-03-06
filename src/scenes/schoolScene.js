import Phaser from 'phaser';
import generateMaps from '../utils/generateMaps';
import characterMov from '../utils/characterMovement';
import mainCharAnimInfo from '../assets/data/mainCharAnims.json';
import utils from '../utils/utilsFunctions';
import MainCharacter from '../objects/mainCharacter';
import Character from '../objects/character';
import EventDispatcher from '../objects/eventDispatcher';

export default class SchoolScene extends Phaser.Scene {
  constructor() {
    super('School');
  }

  create(data) {
    this.mainCharDialog = "Where's the professor?, He's supposed to be here";
    this.demonDialogText = 'Your puny teacher no longer exists in this dimension.'
    + " The fool opened a gate between our worlds allowing us to enter, now it's just a matter of time before we take over";
    this.mainCharDialog2 = 'We are not going to let that happen!';
    this.exitSchool = () => {
      this.scene.stop('School');
      this.scene.start('Town', {
        fromSchool: true,
        charsInfo: this.allCharsInfo,
        money: this.money,
      });
    };
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.money = data.money;
    this.candy = this.sys.game.globals.candies;
    this.textFx = this.sound.add('textFX', {
      volume: 0.2, loop: false,
    });
    this.meetEnemyFX = this.sound.add('meetEnemyFX', { volume: 0.1, loop: false });
    this.cursors = this.input.keyboard.createCursorKeys();
    const button = this.add.image(620, 390, 'maximize', 0).setScrollFactor(0);
    button.setInteractive();
    button.setDepth(30);
    const mapSchool = this.make.tilemap({ key: 'schoolMap' });
    this.emitter = EventDispatcher.getInstance();
    this.playerName = this.sys.game.globals.playerName;


    const arrayTiles = generateMaps.generateTilesSet(mapSchool, generateMaps.tilesParams);
    const arrayLayers = generateMaps.generateStaticLayers(mapSchool, ['Ground', 'World', 'Above', 'Decorators'], arrayTiles, 0, 0);

    const schoolEntranceSpawn = mapSchool.findObject('Objects', obj => obj.name === 'schoolPlayerSpawnPoint');
    const schoolStartBossBattePoint = mapSchool.findObject('Objects', obj => obj.name === 'startBossBattlePoint');
    const enemySpawnPoint1 = mapSchool.findObject('Objects', obj => obj.name === 'schoolEnemySpawnPoint1');
    const enemySpawnPoint2 = mapSchool.findObject('Objects', obj => obj.name === 'schoolEnemySpawnPoint2');
    const enemySpawnPoint3 = mapSchool.findObject('Objects', obj => obj.name === 'schoolEnemySpawnPoint3');
    const enemySpawnPoint4 = mapSchool.findObject('Objects', obj => obj.name === 'schoolEnemySpawnPoint4');
    const enemySpawnPoint5 = mapSchool.findObject('Objects', obj => obj.name === 'schoolEnemySpawnPoint5');
    const chestSpawnPoint = mapSchool.findObject('Objects', obj => obj.name === 'schoolChestSpawnPoint1');

    if (data.fromBattle) {
      this.mainChar = new MainCharacter(this, data.charPosX, data.charPosY - 12, 'mainDown', 1, 'mainFace',
        data.charsInfo.main.hp, data.charsInfo.main.ap, data.charsInfo.main.xp, this.playerName,
        data.charsInfo.main.damage, data.charsInfo.main.superDamage,
        data.charsInfo.main.maxHP, data.charsInfo.main.level);
      this.redHead = new Character(data.charsInfo.redHead.hp, data.charsInfo.redHead.maxHP,
        data.charsInfo.redHead.ap, data.charsInfo.redHead.xp, 'Ro', data.charsInfo.redHead.damage,
        data.charsInfo.redHead.superDamage, data.charsInfo.main.level);
      if (this.sys.game.globals.withDanny) {
        this.danny = new Character(data.charsInfo.danny.hp, data.charsInfo.danny.maxHP,
          data.charsInfo.danny.ap,
          data.charsInfo.danny.xp, 'Danny', data.charsInfo.danny.damage,
          data.charsInfo.danny.superDamage, data.charsInfo.main.level);
      }
    } else if (this.sys.game.globals.withDanny) {
      this.mainChar = new MainCharacter(this, schoolEntranceSpawn.x + 5, schoolEntranceSpawn.y + 5, 'mainUp', 1, 'mainFace',
        data.charsInfo.main.hp, data.charsInfo.main.ap, data.charsInfo.main.xp, this.playerName,
        data.charsInfo.main.damage, data.charsInfo.main.superDamage,
        data.charsInfo.main.maxHP, data.charsInfo.main.level, true);
      this.redHead = new Character(data.charsInfo.redHead.hp, data.charsInfo.redHead.maxHP,
        data.charsInfo.redHead.ap, data.charsInfo.redHead.xp, 'Ro', data.charsInfo.redHead.damage,
        data.charsInfo.redHead.superDamage, data.charsInfo.main.level);
      this.danny = new Character(data.charsInfo.danny.hp, data.charsInfo.danny.maxHP,
        data.charsInfo.danny.ap,
        data.charsInfo.danny.xp, 'Danny', data.charsInfo.danny.damage,
        data.charsInfo.danny.superDamage, data.charsInfo.main.level);
    } else {
      this.mainChar = new MainCharacter(this, schoolEntranceSpawn.x + 5, schoolEntranceSpawn.y + 5, 'mainUp', 1, 'mainFace',
        data.charsInfo.main.hp, data.charsInfo.main.ap, data.charsInfo.main.xp, this.playerName,
        data.charsInfo.main.damage, data.charsInfo.main.superDamage,
        data.charsInfo.main.maxHP, data.charsInfo.main.level, true);
      this.redHead = new Character(data.charsInfo.redHead.hp, data.charsInfo.redHead.maxHP,
        data.charsInfo.redHead.ap, data.charsInfo.redHead.xp, 'Ro', data.charsInfo.redHead.damage,
        data.charsInfo.redHead.superDamage, data.charsInfo.main.level);
    }


    if (this.sys.game.globals.withDanny) {
      this.charStats = {
        mainHP: this.mainChar.hp,
        mainAP: this.mainChar.ap,
        mainLevel: this.mainChar.level,
        redHeadHP: this.redHead.hp,
        redHeadAP: this.redHead.ap,
        redHeadLevel: this.mainChar.level,
        dannyHP: this.danny.hp,
        dannyAP: this.danny.ap,
        dannyLevel: this.mainChar.level,
      };
    } else {
      this.charStats = {
        mainHP: this.mainChar.hp,
        mainAP: this.mainChar.ap,
        mainLevel: this.mainChar.level,
        redHeadHP: this.redHead.hp,
        redHeadAP: this.redHead.ap,
        redHeadLevel: this.mainChar.level,
      };
    }
    this.physics.world.enable(this.mainChar);
    const hud = utils.displayHudElements(this, this.money, this.candy, this.charStats);

    this.plantSlime = utils.createMonster(this, enemySpawnPoint2.x, enemySpawnPoint2.y, 'plantDown', 1, 'schoolPlant', 'plantWalkDown');
    this.blueRedSlime = utils.createMonster(this, enemySpawnPoint3.x, enemySpawnPoint3.y, 'redSlimeDown', 1, 'schoolRedSlime', 'redSlimeWalkDown');
    this.fly = utils.createMonster(this, enemySpawnPoint4.x, enemySpawnPoint4.y, 'flyDown', 1, 'schoolFly', 'flyWalkDown');
    this.bee = utils.createMonster(this, enemySpawnPoint5.x, enemySpawnPoint5.y, 'beeDown', 1, 'schoolBee', 'beeWalkDown');
    this.demon = utils.createMonster(this, enemySpawnPoint1.x - 100, enemySpawnPoint1.y, 'demonStand', 0, 'demon', 'demonStandAnim');

    this.schoolEnemyGroup = this.add.group();
    this.schoolEnemyGroup.add(this.plantSlime);
    this.schoolEnemyGroup.add(this.blueRedSlime);
    this.schoolEnemyGroup.add(this.fly);
    this.schoolEnemyGroup.add(this.bee);
    this.schoolEnemyGroup.add(this.demon);
    this.enemies = this.schoolEnemyGroup.getChildren();

    generateMaps.generateCollision(this, this.schoolEnemyGroup, 'World', 'Decorators', arrayLayers, ['World', 'Decorators']);
    generateMaps.generateCollision(this, this.mainChar, 'World', 'Decorators', arrayLayers, ['World', 'Decorators']);
    generateMaps.generateDepth(arrayLayers, 'Above', 10);
    generateMaps.setWorld(this, mapSchool, this.mainChar, 3);


    this.mainChar.body.setSize(this.mainChar.width, this.mainChar.height / 2, false)
      .setOffset(0, this.mainChar.height / 2);

    const schoolExit = mapSchool.findObject('Objects', obj => obj.name === 'schoolExit');


    const exit = this.physics.add.sprite(schoolExit.x, schoolExit.y, 'emptySprite');
    const startBoss = this.physics.add.sprite(schoolStartBossBattePoint.x, schoolStartBossBattePoint.y + 10, 'emptySprite');

    exit.body.setSize(schoolExit.width, schoolExit.height);
    startBoss.body.setSize(schoolStartBossBattePoint.width, schoolStartBossBattePoint.height + 10);

    exit.setOrigin(-1, 0);

    this.sys.game.globals.enemiesDefeated.forEach(enemy => {
      this.enemies.forEach(schoolEnemy => {
        if (enemy === schoolEnemy.name) schoolEnemy.destroy();
      });
    });

    this.allCharsInfo = {
      main: {
        hp: this.mainChar.hp,
        maxHP: this.mainChar.maxHP,
        ap: this.mainChar.ap,
        name: this.mainChar.name,
        damage: this.mainChar.damage,
        superDamage: this.mainChar.superDamage,
        xp: this.mainChar.xp,
        level: this.mainChar.level,
      },
      redHead: {
        hp: this.redHead.hp,
        maxHP: this.redHead.maxHP,
        ap: this.redHead.ap,
        damage: this.redHead.damage,
        superDamage: this.redHead.superDamage,
        xp: this.redHead.xp,
      },
    };

    if (this.sys.game.globals.withDanny) {
      this.allCharsInfo.danny = {
        hp: this.danny.hp,
        maxHP: this.danny.maxHP,
        ap: this.danny.ap,
        damage: this.danny.damage,
        superDamage: this.danny.superDamage,
        xp: this.danny.xp,
      };
    }

    this.onMeetEnemy = (player, enemy) => {
      this.startBattle = () => {
        this.scene.stop('School');
        if (enemy.name === 'demon') {
          this.scene.start('Battle', {
            posX: this.mainChar.x,
            posY: this.mainChar.y,
            charsInfo: this.allCharsInfo,
            enemyToKill: enemy.name,
            fromDemon: true,
            money: this.money,
          });
        } else {
          this.scene.start('Battle', {
            posX: this.mainChar.x,
            posY: this.mainChar.y,
            charsInfo: this.allCharsInfo,
            enemyToKill: enemy.name,
            fromSchool: true,
            money: this.money,
          });
        }
      };
      this.meetEnemyFX.play();
      this.cameras.main.shake(300, 0.02);
      this.time.delayedCall(300, this.startBattle, [], this);
    };

    this.dialogStart = true;
    this.bossCutScene = () => {
      if (this.dialogStart) {
        this.textBoxMain = utils.createTextBox(this, this.mainChar.x - 80, this.mainChar.y + 20, {
          wrapWidth: 400,
          fixedWidth: 400,
          fixedHeight: 70,
        }, 'messageBattleUI', 'mainFace', this.textFx, '26px', 'demonDialog');
        this.textBoxMain.start(this.mainCharDialog, 50);
        this.textBoxMain.setOrigin(0);
        this.textBoxMain.setScale(0.3, 0.3);
        this.textBoxMain.setDepth(40);
        this.dialogStart = false;
      }
    };

    this.demonDialog = () => {
      this.textBoxMain = utils.createTextBox(this, this.mainChar.x - 80, this.mainChar.y + 20, {
        wrapWidth: 400,
        fixedWidth: 400,
        fixedHeight: 70,
      }, 'messageBattleUI', 'demonFace', this.textFx, '26px', 'mainDialog');
      this.textBoxMain.start(this.demonDialogText, 50);
      this.textBoxMain.setOrigin(0);
      this.textBoxMain.setScale(0.3, 0.3);
      this.textBoxMain.setDepth(40);
    };

    this.dialogMainChar = () => {
      this.textBoxMain = utils.createTextBox(this, this.mainChar.x - 80, this.mainChar.y + 20, {
        wrapWidth: 400,
        fixedWidth: 400,
        fixedHeight: 70,
      }, 'messageBattleUI', 'mainFace', this.textFx, '26px', 'battleBoss');
      this.textBoxMain.start(this.mainCharDialog2, 50);
      this.textBoxMain.setOrigin(0);
      this.textBoxMain.setScale(0.3, 0.3);
      this.textBoxMain.setDepth(40);
    };

    this.onMeetDemon = () => {
      this.tweens.add({ targets: this.mainChar, duration: 3500, x: enemySpawnPoint1 - 100 });
      this.mainChar.anims.play('mainCharWalkRight');
    };

    if (!this.sys.game.globals.schoolChestOpened) {
      this.chest = utils.createActiveChest(this, chestSpawnPoint.x, chestSpawnPoint.y, 'chestOpen', 'chestOpenAnim',
        hud, this.money, this.charStats, this.mainChar, 6, this.textFx);
    } else {
      this.chest = this.physics.add.sprite(chestSpawnPoint.x, chestSpawnPoint.y - 5, 'chestOpen', 3);
    }

    this.mainChar.setDepth(1);
    this.chest.body.setSize(this.chest.width, this.chest.height);
    this.chest.body.immovable = true;
    this.physics.add.collider(this.mainChar, this.chest);

    this.physics.add.overlap(this.mainChar, exit, this.exitSchool, null, this);
    this.physics.add.overlap(this.mainChar, this.schoolEnemyGroup, this.onMeetEnemy, null, this);
    this.physics.add.overlap(this.mainChar, startBoss, this.bossCutScene, null, this);

    this.emitter.on('demonDialog', this.demonDialog);
    this.emitter.on('mainDialog', this.dialogMainChar);
    this.emitter.on('battleBoss', this.onMeetDemon);


    utils.setFullScreen(this, button);
    this.sys.game.globals.bgMusic.stop();
    utils.playBGMusic(this, 'schoolMusic', 0.1, true);
  }

  update() {
    characterMov.charMovementControl(this.mainChar, this.cursors, 155, 50, -50, -50, 50,
      mainCharAnimInfo, 1);
  }
}