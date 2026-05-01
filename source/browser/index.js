import * as pixiJs from 'pixi.js';
import {
  Assets,
  Application,
  Container,
  Graphics,
  Sprite,
  Text,
  Texture
} from 'pixi.js';
import 'pixi.js/advanced-blend-modes';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';

import '#browser/index.scss';

gsap.registerPlugin(gsapPixiPlugin);
gsapPixiPlugin.registerPIXI(pixiJs);

const assetAliasCollection = ['panda', 'rainbow-gradient'];

const textureCollection = await Assets.load([
  ...assetAliasCollection.map((alias) => ({
    alias,
    src: `/asset/sprite/${alias}.png`
  }))
]).then((assetObject) =>
  assetAliasCollection.map((alias) => assetObject[alias])
);

const dimension = 600;

const columnCount = 5;

const _dimension = dimension / columnCount;

const application = new Application();

await application.init({
  resizeTo: window,
  backgroundColor: 0xffffff,
  useBackBuffer: true,
  antialias: true
});

document.body.appendChild(application.canvas);

const container = new Container({
  position: (() => {
    const {
      screen: { width, height }
    } = application;

    return { x: width / 2, y: height / 2 };
  })()
});

application.stage.addChild(container);

const graphics = new Graphics()
  .rect(-dimension / 2, -dimension / 2, dimension, dimension)
  .stroke({ alignment: 1, width: 1, color: 0x000000 });

container.addChild(graphics);

[
  'normal',
  'add',
  'screen',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'linear-burn',
  'linear-dodge',
  'linear-light',
  'hard-light',
  'soft-light',
  'pin-light',
  'difference',
  'exclusion',
  'overlay',
  'saturation',
  'color',
  'luminosity',
  'add-npm',
  'subtract',
  'divide',
  'vivid-light',
  'hard-mix',
  'negation'
].map((blendMode, index) => {
  const _container = new Container({
    label: '_container',
    position: (() => {
      const __dimension = (dimension - _dimension) / 2;

      return {
        x: -__dimension + (index % columnCount) * _dimension,
        y: -__dimension + Math.floor(index / columnCount) * _dimension
      };
    })()
  });

  container.addChild(_container);

  const _graphics = new Graphics()
    .rect(-_dimension / 2, -_dimension / 2, _dimension, _dimension)
    .stroke({ alignment: 1, width: 1, color: 0x000000 });

  _container.addChild(_graphics);

  const sprite = new Sprite({
    label: 'sprite',
    texture: textureCollection[0],
    anchor: 0.5,
    width: 100,
    height: 100
  });

  _container.addChild(sprite);

  const _sprite = new Sprite({
    texture: textureCollection[1],
    anchor: 0.5,
    width: _dimension,
    height: _dimension,
    blendMode: /** @type {pixiJs.BLEND_MODES} */ (blendMode)
  });

  _container.addChild(_sprite);

  const text = new Text(
    /** @type {pixiJs.CanvasTextOptions} */ ({
      text: blendMode,
      anchor: 0.5,
      position: { x: 0, y: _dimension / 2 },
      style: {
        fontSize: 16
      }
    })
  );

  Object.assign(
    text,
    /** @type {pixiJs.CanvasTextOptions} */ ({
      position: (() => {
        const { height } = text;

        return { x: 0, y: (_dimension - height) / 2 };
      })()
    })
  );

  const __sprite = new Sprite({
    texture: Texture.WHITE,
    anchor: 0.5,
    position: text.position,
    width: text.width,
    height: text.height
  });

  _container.addChild(__sprite);

  _container.addChild(text);
});

container
  .getChildrenByLabel('_container')
  .map((_container) => _container.getChildByLabel('sprite'))
  .map((sprite, index) => {
    gsap.to(sprite, {
      pixi: { angle: 360 * (index % 2 ? -1 : 1) },
      duration: 4,
      repeat: -1,
      ease: 'none'
    });
  });
