import * as pixiJs from 'pixi.js';
import {
  Assets,
  Application,
  Container,
  Graphics,
  AnimatedSprite
} from 'pixi.js';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';

import '#browser/index.scss';

gsap.registerPlugin(gsapPixiPlugin);

gsapPixiPlugin.registerPIXI(pixiJs);

const textureCollection = await Assets.load('/asset/sprite/fighter.json').then(
  ({ textures }) => Object.values(textures)
);

const application = new Application();

await application.init({ resizeTo: window, backgroundColor: 0x1099bb });

document.body.appendChild(application.canvas);

const container = new Container({
  ...(() => {
    const { width, height } = application.screen;

    return { position: { x: width / 2, y: height / 2 } };
  })()
});

application.stage.addChild(container);

const graphics = new Graphics()
  .rect(
    ...(() => {
      const { width, height } = application.screen;

      return /** @type {const} */ ([-width / 2, -height / 2, width, height]);
    })()
  )
  .stroke({ alignment: 1, width: 10, color: 0x000000 });

container.addChild(graphics);

const _container = new Container();

container.addChild(_container);

const animatedSprite = new AnimatedSprite({
  textures: textureCollection,
  anchor: 0.5,
  animationSpeed: 0.5
});

_container.addChild(animatedSprite);

animatedSprite.play();

const _graphics = new Graphics()
  .rect(
    ...(() => {
      const { width, height } = _container.getLocalBounds();

      return /** @type {const} */ ([-width / 2, -height / 2, width, height]);
    })()
  )
  .stroke({ alignment: 1, width: 1, color: 0x000000 });

_container.addChild(_graphics);

gsap.to(_container, {
  pixi: { angle: 360 },
  duration: 4,
  repeat: -1,
  ease: 'none'
});
