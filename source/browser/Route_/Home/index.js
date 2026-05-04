import { useRef, useEffect } from 'react';
import * as pixiJs from 'pixi.js';
import { Assets, AnimatedSprite } from 'pixi.js';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import { useExtend } from '@pixi/react';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';
import { useGSAP } from '@gsap/react';

import Application_ from './Component/Application_';
import style from './index.module.scss';

gsap.registerPlugin(useGSAP, gsapPixiPlugin);
gsapPixiPlugin.registerPIXI(pixiJs);

const textureCollection = await Assets.load('/asset/sprite/mc.json').then(
  ({ textures }) => Object.values(textures)
);

const LayoutContainer__ = () => {
  useExtend({ LayoutContainer, AnimatedSprite });

  const ref = useRef(undefined);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentAnimatedSprite = /** @type {AnimatedSprite} */ (
      refCurrent.getChildByLabel('animatedSprite')
    );

    refCurrentAnimatedSprite.gotoAndPlay(
      (Math.random() * textureCollection.length) | 0
    );
  }, []);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const randomDefinition = Object.fromEntries(
      ['left', 'top'].map((key) => [key, Math.random()])
    );

    const onRefCurrentLayoutHandle = () => {
      Object.assign(
        refCurrent,
        /** @type {pixiJs.ContainerOptions} */ ({
          layout: (() => {
            const {
              parent: {
                parent: {
                  layout: {
                    _computedLayout: { width = 0, height = 0 } = {}
                  } = {}
                } = {}
              } = {},
              layout: {
                _computedLayout: { width: _width = 0, height: _height = 0 } = {}
              } = {}
            } = refCurrent;

            return {
              left: -_width / 2 + randomDefinition.left * width,
              top: -_height / 2 + randomDefinition.top * height
            };
          })(),
          scale: Math.random() * 0.5 + 1,
          angle: Math.random() * 360
        })
      );
    };

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);
    };
  }, []);

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        borderColor: 0x000000
      }}
    >
      <pixiAnimatedSprite
        label='animatedSprite'
        textures={textureCollection}
        layout={{}}
        animationSpeed={0.5}
      />
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer });

  const ref = useRef(undefined);

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
        borderWidth: 10,
        borderColor: 0x000000
      }}
    >
      {Array.from({ length: 50 }).map((_, index) => (
        <LayoutContainer__ key={index} />
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
