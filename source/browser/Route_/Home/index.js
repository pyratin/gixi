import { useRef, useEffect } from 'react';
import { useExtend } from '@pixi/react';
import * as pixiLayout from '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import * as pixiJs from 'pixi.js';
import { Assets, AnimatedSprite } from 'pixi.js';

import Application_ from './Component/Application_';
import style from './index.module.scss';

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
      ['left', 'top', 'scale', 'angle'].map((key) => [key, Math.random()])
    );

    const onRefCurrentLayoutHandle = () => {
      const {
        parent: {
          parent: {
            layout: { _computedLayout: { width = 0, height = 0 } } = {}
          } = {}
        } = {},
        layout: {
          _computedLayout: { width: _width = 0, height: _height = 0 } = {}
        } = {}
      } = refCurrent;

      Object.assign(
        refCurrent,
        /** @type {pixiJs.ContainerOptions} */ ({
          layout: /** @type {pixiLayout.LayoutOptions} */ ({
            left: randomDefinition.left * width - _width / 2,
            top: randomDefinition.top * height - _height / 2
          }),
          scale: randomDefinition.scale * 0.5 + 1,
          angle: randomDefinition.angle * 360
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

  return (
    <pixiLayoutContainer
      layout={{
        position: 'relative',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
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
