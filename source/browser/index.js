import * as pixiJs from 'pixi.js';
import { Assets, Application, Container, Graphics, Text } from 'pixi.js';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';

import '#browser/index.scss';

await Assets.load({
  alias: 'Grandstander',
  src: '/asset/font/Grandstander/Grandstander-VariableFont_wght.ttf',
  data: { family: 'Grandstander' }
});

gsap.registerPlugin(gsapPixiPlugin);
gsapPixiPlugin.registerPIXI(pixiJs);

const application = new Application();

await application.init({ resizeTo: window, backgroundColor: 0x1099bb });

document.body.appendChild(application.canvas);

const container = new Container({
  ...(() => {
    const { screen: { width = 0, height = 0 } = {} } = application;

    const position = { x: width / 2, y: height / 2 };

    return { position, pivot: position };
  })()
});

application.stage.addChild(container);

const graphics = new Graphics()
  .rect(
    ...(() => {
      const { screen: { width = 0, height = 0 } = {} } = application;

      return /** @type {const} */ ([0, 0, width, height]);
    })()
  )
  .stroke({ alignment: 1, width: 10, color: 0x000000 });

container.addChild(graphics);

const _container = new Container();

container.addChild(_container);

['MAHA', 'DEVAN', 'SUBRA', 'MANIAN'].reduce((memo, textFragment) => {
  const __container = new Container({ label: '__container' });

  _container.addChild(__container);

  const text = new Text(
    /** @type {pixiJs.CanvasTextOptions} */ ({
      text: textFragment,
      style: {
        fontFamily: 'Grandstander',
        fontSize: 32,
        fontWeight: 'bolder',
        fill: 0xffffff
      }
    })
  );

  const _graphics = new Graphics()
    .roundRect(
      ...(() => {
        const { width = 0, height = 0 } = text;

        const padding = 10;

        return /** @type {const} */ ([
          -padding,
          -padding,
          width + padding * 2,
          height + padding * 2,
          8
        ]);
      })()
    )
    .fill({ color: 0xed427c })
    .stroke({ alignment: 1, width: 2, color: 0xffffff });

  __container.addChild(_graphics, text);

  Object.assign(
    __container,
    /** @type {pixiJs.ContainerOptions} */ ({
      ...(() => {
        const { width, height } = __container;

        return {
          position: {
            x:
              memo.reduce((_memo, { width }) => _memo + width + 10, 0) +
              width / 2,
            y: height / 2
          },
          pivot: { x: width / 2, y: height / 2 }
        };
      })()
    })
  );

  return [...memo, __container];
}, []);

Object.assign(
  _container,
  /** @type {pixiJs.ContainerOptions} */ ({
    position: (() => {
      const { screen: { width = 0, height = 0 } = {} } = application;

      const { width: _width = 0, height: _height = 0 } = _container;

      return { x: (width - _width) / 2, y: (height - _height) / 2 };
    })()
  })
);

gsap.to(_container.getChildrenByLabel('__container'), {
  // pixi: { angle: 360 },
  duration: 1,
  repeat: -1,
  ease: 'none'
});

gsap.from(_container.getChildrenByLabel('__container'), {
  pixi: { alpha: 0, y: -100, angle: 'random(-80, 80)' },
  duration: 1,
  repeat: -1,
  yoyo: true,
  ease: 'back',
  stagger: 0.1,
  repeatDelay: 1
});
