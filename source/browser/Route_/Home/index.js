import { useRef, useEffect } from 'react';
import { useExtend } from '@pixi/react';
import * as pixiJs from 'pixi.js';
import { Assets, Graphics, AnimatedSprite } from 'pixi.js';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';
import { useGSAP } from '@gsap/react';

import Application_ from './Component/Application_';
import style from './index.module.scss';

gsap.registerPlugin(gsapPixiPlugin);
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
  useExtend({ LayoutContainer, AnimatedSprite });

  const ref = useRef(undefined);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentGraphics = /** @type {Graphics} */ (
      refCurrent.getChildByLabel('graphics')
    );

    const onRefCurrentLayoutHandle = () => {
      const {
        layout: { _computedLayout: { width = 0, height = 0 } = {} } = {}
      } = refCurrent;

      refCurrentGraphics
        .clear()
        .rect(0, 0, width, height)
        .stroke({ alignment: 1, width: 1, color: 0x000000 });
    };

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);
    };
  }, []);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentAnimatedSprite = /** @type {AnimatedSprite} */ (
      refCurrent.getChildByLabel('animatedSprite')
    );

    refCurrentAnimatedSprite.play();
  }, []);

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderWidth: 0,
        borderColor: 0x000000
      }}
    >
      <pixiAnimatedSprite
        label='animatedSprite'
        textures={textureCollection}
        layout={{}}
        scale={2}
        animationSpeed={!index ? 0.5 : 1}
      />

      <pixiGraphics
        label='graphics'
        draw={() => {}}
        layout={{ position: 'absolute' }}
      />
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer, Graphics });

  const ref = useRef(undefined);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentGraphics = /** @type {Graphics} */ (
      refCurrent.getChildByLabel('graphics')
    );

    const onRefCurrentLayoutHandle = () => {
      const { layout: { _computedLayout: { width, height } = {} } = {} } =
        refCurrent;

      refCurrentGraphics
        .clear()
        .rect(0, 0, width, height)
        .stroke({ alignment: 1, width: 10, color: 0x000000 });
    };

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);
    };
  }, []);

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      gsap.to(refCurrent, {
        // pixi: { angle: 360 },
        duration: 1,
        repeat: -1,
        ease: 'none'
      });
    },
    { dependencies: [] }
  );

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        position: 'relative',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderWidth: 0,
        borderColor: 0x000000
      }}
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <LayoutContainer__ key={index} index={index} />
      ))}

      <pixiGraphics
        label='graphics'
        draw={() => {}}
        layout={{ position: 'absolute' }}
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
