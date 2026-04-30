import { useRef, useState, useEffect } from 'react';
import { useExtend } from '@pixi/react';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import * as pixiJs from 'pixi.js';
import { Assets, AnimatedSprite, Graphics, Circle } from 'pixi.js';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';

import Application_ from './Component/Application_';
import style from './index.module.scss';

gsap.registerPlugin(useGSAP, gsapPixiPlugin);

gsapPixiPlugin.registerPIXI(pixiJs);

const textureCollection = await Assets.load('/asset/sprite/fighter.json').then(
  ({ textures }) => Object.values(textures)
);

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer, AnimatedSprite, Graphics });

  const ref = useRef(undefined);

  const [_activeFlag, _activeFlagSet] = useState(false);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentGraphics = /** @type {Graphics} */ (
      refCurrent.getChildByLabel('graphics-container').getChildAt(0)
    );

    const onRefCurrentLayoutHandle = () => {
      const {
        layout: { _computedLayout: { width = 0, height = 0 } = {} } = {}
      } = refCurrent;

      Object.assign(
        refCurrent,
        /** @type {pixiJs.ContainerOptions} */ ({
          hitArea: new Circle(width / 2, height / 2, height / 2)
        })
      );

      refCurrentGraphics
        .clear()
        .circle(0, 0, height / 2)
        .fill({ color: 0xffffff, alpha: 0.25 })
        .stroke({ alignment: 1, width: 5, color: 0x000000, alpha: 0.25 });
    };

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);
    };
  }, []);

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      _activeFlag &&
        gsap.to(refCurrent, {
          keyframes: [
            { pixi: { x: '-=1', y: '-=1', scale: '-=.1', angle: '-=5' } },
            { pixi: { x: '+=2', y: '+=2', scale: '+=.2', angle: '+=10' } },
            { pixi: { x: '-=1', y: '-=1', scale: '-=.1', angle: '-=5' } }
          ],
          duration: 0.5,
          ease: 'bounce'
        });
    },
    { dependencies: [_activeFlag] }
  );

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
      }}
      eventMode='static'
      cursor='pointer'
      onPointerEnter={() => _activeFlagSet(true)}
      onPointerLeave={() => _activeFlagSet(false)}
    >
      <pixiLayoutContainer
        label='graphics-container'
        layout={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 0,
          borderColor: 0x000000
        }}
        eventMode='none'
      >
        <pixiGraphics draw={() => {}} layout={{ position: 'absolute' }} />
      </pixiLayoutContainer>

      <pixiAnimatedSprite
        label='animatedSprite'
        textures={textureCollection}
        layout={{}}
      />
    </pixiLayoutContainer>
  );
};

const Home = () => {
  return (
    <div className={['Home', style.Home].join(' ')}>
      <Application_ backgroundColor={0x1099bb}>
        <LayoutContainer_ />
      </Application_>
    </div>
  );
};

export default Home;
