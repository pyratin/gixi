import * as pixiJs from 'pixi.js';
import { Application, Graphics } from 'pixi.js';
import { DropShadowFilter } from 'pixi-filters';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';
import gsapPhysics2D from 'gsap/Physics2DPlugin';

import '#browser/index.scss';

gsap.registerPlugin(gsapPixiPlugin, gsapPhysics2D);
gsapPixiPlugin.registerPIXI(pixiJs);

const application = new Application();

await application.init({ resizeTo: window, backgroundColor: 0x1099bb });

document.body.appendChild(application.canvas);

Object.assign(
  application.stage,
  /** @type {pixiJs.ContainerOptions} */ ({
    eventMode: 'static',
    cursor: 'pointer',
    hitArea: application.screen
  })
);

application.stage.on('pointertap', ({ clientX, clientY }) => {
  Array.from({ length: gsap.utils.random(15, 30, 1) }).map(() => {
    const graphics = new Graphics({
      position: { x: clientX, y: clientY },
      scale: 0,
      filters: [new DropShadowFilter()]
    })
      .circle(0, 0, gsap.utils.random(20, 40))
      .fill({ color: 0xffffff });

    application.stage.addChild(graphics);

    gsap
      .timeline({ onComplete: () => graphics.destroy() })
      .to(graphics, {
        pixi: { scale: gsap.utils.random(0.25, 1) },
        duration: 0.02,
        ease: 'power3.out'
      })
      .to(graphics, {
        physics2D: {
          velocity: gsap.utils.random(500, 1000),
          gravity: 1500,
          angle: gsap.utils.random(0, 360)
        },
        duration: 2,
        ease: 'none'
      });
  });
});
