import { Assets, Application, Container, Graphics, Sprite } from 'pixi.js';

import '#browser/index.scss';

/** @type {[string, string[]][]} */
const bundleDefinitionCollection = [
  ['start-screen', ['eggHead']],
  ['game-screen', ['flowerTop']]
];

Assets.init({
  manifest: {
    bundles: bundleDefinitionCollection.map(([name, assetAliasCollection]) => ({
      name,
      assets: assetAliasCollection.map((alias) => ({
        alias,
        src: `/asset/sprite/${alias}.png`
      }))
    }))
  }
});

Assets.backgroundLoadBundle(bundleDefinitionCollection.map(([name]) => name));

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
        screen: { width = 0, height = 0 }
      } = application;

      return /** @type {const} */ ([-width / 2, -height / 2, width, height]);
    })()
  )
  .stroke({ alignment: 1, width: 10, color: 0x000000 });

container.addChild(graphics);

let bundleDefinitionIndexActive = 0;

const bundleRender = async () => {
  container.children.map((child) => child.destroy());

  const _container = new Container({
    eventMode: 'static',
    cursor: 'pointer',
    onpointertap: () => {
      bundleDefinitionIndexActive = !bundleDefinitionIndexActive ? 1 : 0;

      bundleRender();
    }
  });

  container.addChild(_container);

  const [name, [alias]] =
    bundleDefinitionCollection[bundleDefinitionIndexActive];

  const texture = await Assets.loadBundle(name).then(
    (bundleObject) => bundleObject[alias]
  );

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
};

bundleRender();
