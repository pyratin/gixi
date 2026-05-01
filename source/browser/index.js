import {
  Assets,
  Application,
  Container,
  Graphics,
  AnimatedSprite
} from 'pixi.js';

import '#browser/index.scss';

const textureCollection = await Assets.load('/asset/sprite/mc.json').then(
  ({ textures }) => Object.values(textures)
);

const application = new Application();

await application.init({ resizeTo: window, backgroundColor: 0x1099bb });

document.body.appendChild(application.canvas);

const container = new Container({
  position: (() => {
    const { width, height } = application.screen;

    return { x: width / 2, y: height / 2 };
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

Array.from({ length: 50 }).map(() => {
  const _container = new Container({
    position: (() => {
      const { width, height } = application.screen;

      return {
        x: -width / 2 + Math.random() * width,
        y: -height / 2 + Math.random() * height
      };
    })(),
    scale: Math.random() * 0.5 + 1,
    angle: Math.random() * 360
  });

  container.addChild(_container);

  const animatedSprite = new AnimatedSprite({
    textures: textureCollection,
    anchor: 0.5,
    animationSpeed: 0.5
  });

  _container.addChild(animatedSprite);

  animatedSprite.gotoAndPlay((Math.random() * textureCollection.length) | 0);

  const _graphics = new Graphics()
    .rect(
      ...(() => {
        const { x, y, width, height } = _container.getLocalBounds();

        return /** @type {const} */ ([x, y, width, height]);
      })()
    )
    .stroke({
      alignment: 1,
      width: 1,
      color: 0x000000,
      alpha: 0.25
    });

  _container.addChild(_graphics);
});
