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

const textureCollection = await Assets.load(
  '/asset/sprite/0123456789.json'
).then(({ textures, data: { frames } }) =>
  Object.entries(textures).map(([key, texture]) => ({
    texture,
    time: frames[key].duration
  }))
);

const LayoutContainer__ = ({ index }) => {
  useExtend({ LayoutContainer, AnimatedSprite, Graphics });

  const ref = useRef(undefined);

  const [_activeFlag, _activeFlagSet] = useState(false);

  const [activeFlag, activeFlagSet] = useState(false);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentAnimatedSprite = /** @type {AnimatedSprite} */ (
      refCurrent.getChildByLabel('animatedSprite')
    );

    refCurrentAnimatedSprite.play();
  }, []);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentGraphics = /** @type {Graphics} */ (
      refCurrent.getChildByLabel('graphics-container').getChildAt(0)
    );

    const onRefCurrentLayoutHandle = () => {
      const { layout: { _computedLayout: { width = 0 } = {} } = {} } =
        refCurrent;

      Object.assign(
        refCurrent,
        /** @type {pixiJs.ContainerOptions} */ ({
          hitArea: new Circle(width / 2, width / 2, width / 2)
        })
      );

      refCurrentGraphics
        .clear()
        .circle(0, 0, width / 2)
        .fill({ color: 0xffffff, alpha: 0.5 })
        .stroke({ alignment: 1, width: 10, color: 0x000000, alpha: 0.5 });
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
            { pixi: { x: '-=1', y: '-=1', angle: '-=5', scale: '-=.1' } },
            { pixi: { x: '+=2', y: '+=2', angle: '+=10', scale: '+=.2' } },
            { pixi: { x: '-=1', y: '-=1', angle: '-=5', scale: '-=.1' } }
          ],
          duration: 0.5,
          ease: 'back'
        });
    },
    { dependencies: [_activeFlag] }
  );

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      gsap.to(refCurrent, {
        pixi: activeFlag ? { y: '-=50', scale: '+=.15' } : { y: 0, scale: 1 },
        duration: 0.5,
        ease: 'elastic'
      });
    },
    { dependencies: [activeFlag] }
  );

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        borderWidth: 0,
        borderColor: 0x000000,
        borderRadius: 100
      }}
      eventMode='static'
      cursor='pointer'
      onPointerEnter={() => _activeFlagSet(true)}
      onPointerLeave={() => _activeFlagSet(false)}
      onPointerTap={() => {
        activeFlagSet((activeFlag) => !activeFlag);

        _activeFlagSet(false);
      }}
    >
      <pixiLayoutContainer
        label='graphics-container'
        layout={{
          position: 'absolute',
          width: '100%',
          height: '100%',
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
        scale={2}
        animationSpeed={!index ? 0.5 : 1}
      />
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer });

  return (
    <pixiLayoutContainer
      layout={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25,
        borderWidth: 0,
        borderColor: 0x000000
      }}
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <LayoutContainer__ key={index} index={index} />
      ))}
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
