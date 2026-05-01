import * as pixiJs from 'pixi.js';
import { Assets, Application, Container, Graphics, Sprite } from 'pixi.js';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';

import '#browser/index.scss';

gsap.registerPlugin(gsapPixiPlugin);

gsapPixiPlugin.registerPIXI(pixiJs);

const assetAliasCollection = ['flowerTop', 'eggHead'];

Assets.add(
  assetAliasCollection.map((alias) => ({
    alias,
    src: `/asset/sprite/${alias}.png`
  }))
);

Assets.backgroundLoad(assetAliasCollection);

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
      const {
        screen: { width, height }
      } = application;

      return /** @type {const} */ ([-width / 2, -height / 2, width, height]);
    })()
  )
  .stroke({ alignment: 1, width: 10, color: 0x000000 });

container.addChild(graphics);

let assetAliasIndexActive = 0;

const _container = new Container({
  eventMode: 'static',
  cursor: 'pointer',
  onpointertap: async (event) => {
    assetAliasIndexActive = !assetAliasIndexActive ? 1 : 0;

    Object.assign(
      event.target.getChildByLabel('graphics'),
      /** @type {pixiJs.SpriteOptions} */ ({
        texture: await Assets.load(assetAliasCollection[assetAliasIndexActive])
      })
    );
  }
});

container.addChild(_container);

Assets.load(assetAliasCollection[assetAliasIndexActive]).then((texture) => {
  const sprite = new Sprite({ label: 'graphics', texture, anchor: 0.5 });

  _container.addChild(sprite);

  const _graphics = new Graphics()
    .rect(
      ...(() => {
        const { width, height } = _container;

        return /** @type {const} */ ([-width / 2, -height / 2, width, height]);
      })()
    )
    .stroke({ alignment: 1, width: 1, color: 0x000000 });

  _container.addChild(_graphics);
});

gsap.to(_container, {
  pixi: { angle: 0 },
  duration: 4,
  repeat: -1,
  ease: 'none'
});
