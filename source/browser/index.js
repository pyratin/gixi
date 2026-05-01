import * as pixiJs from 'pixi.js';
import {
  Assets,
  Application,
  Container,
  AnimatedSprite,
  Graphics
} from 'pixi.js';

import '#browser/index.scss';

const textureCollection = await Assets.load(
  '/asset/sprite/0123456789.json'
).then(({ textures, data: { frames } }) =>
  Object.entries(textures).map(([key, texture]) => ({
    texture,
    time: frames[key].duration
  }))
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

Array.from({ length: 2 }).map((_, index) => {
  const _container = new Container();

  container.addChild(_container);

  const animatedSprite = new AnimatedSprite({
    textures: textureCollection,
    anchor: 0.5,
    scale: 4,
    animationSpeed: !index ? 0.5 : 1
  });

  _container.addChild(animatedSprite);

  animatedSprite.play();

  const graphics = new Graphics()
    .rect(
      ...(() => {
        const { x, y, width, height } = _container.getLocalBounds();

        return /** @type {const} */ ([x, y, width, height]);
      })()
    )
    .stroke({ alignment: 1, width: 1, color: 0x000000 });

  _container.addChild(graphics);

  Object.assign(
    _container,
    /** @type {pixiJs.ContainerOptions} */ ({
      position: (() => {
        const { width } = container;

        return { x: (width / 2) * (!index ? -1 : 1), y: 0 };
      })()
    })
  );
});
