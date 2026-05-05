import { useRef, useEffect } from 'react';
import * as pixiJs from 'pixi.js';
import { Assets, Sprite, Text } from 'pixi.js';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import { useExtend } from '@pixi/react';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';
import { useGSAP } from '@gsap/react';
import 'pixi.js/advanced-blend-modes';

import Application_ from './Component/Application_';
import style from './index.module.scss';

gsap.registerPlugin(gsapPixiPlugin, useGSAP);
gsapPixiPlugin.registerPIXI(pixiJs);

const dimensionMaximum = 700;

const columnCount = 25;

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
  useExtend({ LayoutContainer, Sprite, Text });

  const ref = useRef(undefined);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

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
              } = {}
            } = refCurrent;

            const dimension = Math.min(width, height) / (columnCount / 5);

            return {
              width: dimension,
              height: dimension
            };
          })()
        })
      );
    };

    refCurrent.on('layout', onRefCurrentLayoutHandle);

    return () => {
      refCurrent.off('layout', onRefCurrentLayoutHandle);
    };
  }, []);

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      const refCurrentSprite = /** @type {Sprite} */ (
        refCurrent.getChildByLabel('sprite')
      );

      gsap.to(refCurrentSprite, {
        pixi: { angle: 360 * (index % 2 ? -1 : 1) },
        duration: 10,
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 0x000000
      }}
    >
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
          backgroundColor: 0xffffff,
          padding: 4
        }}
      >
        <pixiText
          {...(() =>
            /** @type {pixiJs.CanvasTextOptions} */ ({
              text: blendMode,
              layout: {},
              style: {
                fontFamily: 'short-stack',
                fontSize: 16
              }
            }))()}
        />
      </pixiLayoutContainer>
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer });

  return (
    <pixiLayoutContainer
      layout={{
        width: '100%',
        maxWidth: dimensionMaximum,
        height: '100%',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
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
