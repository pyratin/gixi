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

gsap.registerPlugin(gsapPixiPlugin, useGSAP);
gsapPixiPlugin.registerPIXI(pixiJs);

const textureCollection = await Assets.load('/asset/sprite/fighter.json').then(
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

    refCurrentAnimatedSprite.play();
  }, []);

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      gsap.to(refCurrent, {
        pixi: { angle: 360 },
        duration: 2,
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
        borderWidth: 1,
        borderColor: 0x000000
      }}
    >
      <pixiAnimatedSprite
        label='animatedSprite'
        textures={textureCollection}
        layout={{}}
      />
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer });

  return (
    <pixiLayoutContainer
      layout={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 10,
        borderColor: 0x000000
      }}
    >
      <LayoutContainer__ />
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
