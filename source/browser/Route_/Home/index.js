import { useRef, useEffect } from 'react';
import * as pixiJs from 'pixi.js';
import { Assets, Sprite } from 'pixi.js';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import { useExtend } from '@pixi/react';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';
import { useGSAP } from '@gsap/react';

import Application_ from './Component/Application_';
import style from './index.module.scss';

gsap.registerPlugin(gsapPixiPlugin, useGSAP);
gsapPixiPlugin.registerPIXI(pixiJs);

const textureCollection = await Assets.load('/asset/sprite/monsters.json').then(
  ({ textures }) => Object.values(textures)
);

const LayoutContainer__ = ({ index }) => {
  useExtend({ LayoutContainer, Sprite });

  const ref = useRef(undefined);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const randomDefinition = Object.fromEntries(
      ['left', 'top'].map((key) => [key, Math.random()])
    );

    const onRefCurrentLayoutHandle = () => {
      const {
        parent: {
          parent: {
            layout: { _computedLayout: { width = 0, height = 0 } = {} } = {}
          } = {}
        } = {},
        layout: {
          _computedLayout: { width: _width = 0, height: _height = 0 } = {}
        } = {}
      } = refCurrent;

      Object.assign(
        refCurrent,
        /** @type {pixiJs.ContainerOptions} */ ({
          layout: {
            left: -_width / 2 + randomDefinition.left * width,
            top: -_height / 2 + randomDefinition.top * height
          }
        })
      );
    };

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);
    };
  }, []);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentSprite = /** @type {Sprite} */ (
      refCurrent.getChildByLabel('sprite')
    );

    Object.assign(
      refCurrentSprite,
      /** @type {pixiJs.SpriteOptions} */ ({
        tint: Math.random() * 0xffffff
      })
    );
  }, []);

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      gsap.to(refCurrent, {
        pixi: { angle: 360 },
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
      layout={{ position: 'absolute' }}
      eventMode='none'
    >
      <pixiSprite
        label='sprite'
        texture={textureCollection[index % textureCollection.length]}
        layout={{}}
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
        pixi: { angle: 360 },
        duration: 4,
        repeat: -1,
        ease: 'none'
      });

      gsap.fromTo(
        refCurrent,
        { pixi: { scale: 0 } },
        {
          pixi: { scale: 1 },
          duration: 2,
          repeat: -1,
          ease: 'none',
          yoyo: true
        }
      );
    },
    { dependencies: [] }
  );

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        width: '100%',
        height: '100%',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 10,
        borderColor: 0x000000
      }}
      eventMode='static'
      cursor='pointer'
      onPointerTap={(event) => {
        const eventTarget = /** @type {LayoutContainer} */ (event.target);

        eventTarget.cacheAsTexture(!eventTarget.isCachedAsTexture);
      }}
    >
      {Array.from({ length: 100 }).map((_, index) => (
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
