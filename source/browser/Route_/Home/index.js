import { useRef, useEffect } from 'react';
import { useExtend } from '@pixi/react';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import * as pixiJs from 'pixi.js';
import { Assets, Sprite, Graphics, Text } from 'pixi.js';
import 'pixi.js/advanced-blend-modes';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';

import Application_ from './Component/Application_';
import style from './index.module.scss';

gsap.registerPlugin(useGSAP, gsapPixiPlugin);
gsapPixiPlugin.registerPIXI(pixiJs);

const dimensionMinimum = 707;

const columnCount = 5;

const assetAliasCollection = ['panda', 'rainbow-gradient'];

const textureCollection = await Assets.load([
  ...assetAliasCollection.map((alias) => ({
    alias,
    src: `/asset/sprite/${alias}.png`
  })),
  {
    alias: 'short-stack',
    src: '/asset/font/Short_Stack/ShortStack-Regular.ttf',
    data: { family: 'short-stack' }
  }
]).then((assetObject) =>
  assetAliasCollection.map((alias) => assetObject[alias])
);

const LayoutContainer__ = ({ index, blendMode }) => {
  useExtend({ LayoutContainer, Sprite, Graphics, Text });

  const ref = useRef(undefined);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentGraphics = /** @type {Graphics} */ (
      refCurrent.getChildByLabel('graphics-container').getChildAt(0)
    );

    const onRefCurrentLayoutHandle = () => {
      const {
        parent: {
          parent: { layout: { _computedLayout: { width = 0 } = {} } = {} } = {}
        } = {}
      } = refCurrent;

      const dimension = width / columnCount;

      refCurrentGraphics
        .clear()
        .rect(0, 0, dimension, dimension)
        .stroke({ alignment: 1, width: 1, color: 0x000000, alpha: 0.25 });

      Object.assign(
        refCurrent,
        /** @type {pixiJs.ContainerOptions} */ ({
          layout: /** @type {pixiLayout.LayoutOptions} */ ({
            width: dimension,
            height: dimension,
            left: (index % columnCount) * dimension,
            top: Math.floor(index / columnCount) * dimension
          })
        })
      );
    };

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);
    };
  }, [index]);

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      const refCurrentSprite = /** @type {Graphics} */ (
        refCurrent.getChildByLabel('sprite')
      );

      gsap.to(refCurrentSprite, {
        pixi: { angle: 360 },
        duration: 5,
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
        position: 'absolute',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
        borderColor: 0x000000
      }}
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
      >
        <pixiGraphics draw={() => {}} layout={{ position: 'absolute' }} />
      </pixiLayoutContainer>

      <pixiSprite
        label='sprite'
        texture={textureCollection[0]}
        layout={{
          height: '75%',
          objectFit: 'contain'
        }}
      />

      <pixiSprite
        texture={textureCollection[1]}
        layout={{ position: 'absolute', width: '100%', height: '100%' }}
        blendMode={blendMode}
      />

      <pixiLayoutContainer
        layout={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: 0x000000,
          backgroundColor: 0xffffff
        }}
      >
        <pixiText
          {...(() =>
            /** @type {pixiJs.CanvasTextOptions} */ ({
              text: blendMode,
              layout: {},
              style: {
                fontSize: 12,
                fontWeight: 'bolder',
                fontFamily: 'short-stack'
              }
            }))()}
        />
      </pixiLayoutContainer>
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer });

  const ref = useRef(undefined);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const onRefCurrentLayoutHandle = () => {
      Object.assign(
        refCurrent,
        /** @type {pixiJs.ContainerOptions} */ ({
          layout: /** @type {pixiLayout.LayoutOptions} */ ({
            ...(() => {
              const {
                parent: {
                  layout: {
                    _computedLayout: { width = 0, height = 0 } = {}
                  } = {}
                } = {}
              } = refCurrent;

              const dimension = Math.min(width, height, dimensionMinimum);

              return {
                width: dimension,
                height: dimension
              };
            })()
          })
        })
      );
    };

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.on('layout', onRefCurrentLayoutHandle);
    };
  }, []);

  return (
    <pixiLayoutContainer
      ref={ref}
      layout={{
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        borderColor: 0x000000
      }}
    >
      {[
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
      ].map((blendMode, index) => (
        <LayoutContainer__ key={index} index={index} blendMode={blendMode} />
      ))}
    </pixiLayoutContainer>
  );
};

const Home = () => {
  return (
    <div className={['Home', style.Home].join(' ')}>
      <Application_ backgroundColor={0xffffff}>
        <LayoutContainer_ />
      </Application_>
    </div>
  );
};

export default Home;
