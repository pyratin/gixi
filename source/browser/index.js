import * as pixiJs from 'pixi.js';
import { Assets, Application, Container, Graphics, Sprite } from 'pixi.js';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';

import '#browser/index.scss';

gsap.registerPlugin(gsapPixiPlugin);
gsapPixiPlugin.registerPIXI(pixiJs);

const textureCollection = await Assets.load('/asset/sprite/monsters.json').then(
  ({ textures }) => Object.values(textures)
);

const application = new Application();

await application.init({ resizeTo: window, backgroundColor: 0x1099bb });

document.body.appendChild(application.canvas);

const container = new Container({
  position: (() => {
    const { screen: { width = 0, height = 0 } = {} } = application;

    return { x: width / 2, y: height / 2 };
  })()
});

application.stage.addChild(container);

const graphics = new Graphics()
  .rect(
    ...(() => {
      const { screen: { width = 0, height = 0 } = {} } = application;

      return /** @type {const} */ ([-width / 2, -height / 2, width, height]);
    })()
  )
  .stroke({ alignment: 1, width: 10, color: 0x000000 });

container.addChild(graphics);

Array.from({ length: 100 }).map((_, index) => {
  const _container = new Container({
    label: '_container',
    position: (() => {
      const { screen: { width = 0, height = 0 } = {} } = application;

      return {
        x: -width / 2 + Math.random() * width,
        y: -height / 2 + Math.random() * height
      };
    })()
  });

  container.addChild(_container);

  const sprite = new Sprite({
    label: 'sprite',
    texture: textureCollection[index % textureCollection.length],
    anchor: 0.5,
    tint: Math.random() * 0xffffff
  });

  _container.addChild(sprite);
});

gsap.to(
  container
    .getChildrenByLabel('_container')
    .map((_container) => _container.getChildByLabel('sprite')),
  { pixi: { angle: 360 }, duration: 1, repeat: -1, ease: 'none' }
);

gsap.to(container, {
  pixi: { angle: 360 },
  duration: 4,
  repeat: -1,
  ease: 'none'
});

gsap.fromTo(
  container,
  { pixi: { scale: 0 } },
  { scale: 1, duration: 2, repeat: -1, yoyo: true, ease: 'none' }
);

Object.assign(
  application.stage,
  /** @type {pixiJs.ContainerOptions} */ ({
    eventMode: 'static'
  })
);

application.stage.on('pointertap', () => {
  container.cacheAsTexture(!container.isCachedAsTexture);
});
