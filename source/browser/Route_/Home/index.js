import { useRef, useState, useEffect } from 'react';
import { useExtend } from '@pixi/react';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import * as pixiJs from 'pixi.js';
import { Assets, Sprite, Graphics, Circle } from 'pixi.js';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import gsapPixiPlugin from 'gsap/PixiPlugin';

import Application_ from './Component/Application_';
import style from './index.module.scss';

gsap.registerPlugin(useGSAP, gsapPixiPlugin);

gsapPixiPlugin.registerPIXI(pixiJs);

const assetAliasCollection = ['flowerTop', 'eggHead'];

Assets.add(
  assetAliasCollection.map((alias) => ({
    alias,
    src: `/asset/sprite/${alias}.png`
  }))
);

Assets.backgroundLoad(assetAliasCollection);

const LayoutContainer_ = ({
  assetAliasIndexActive,
  assetAliasIndexActiveSet
}) => {
  useExtend({ LayoutContainer, Sprite, Graphics });

  const { contextSafe } = useGSAP();

  const ref = useRef(undefined);

  const [texture, textureSet] = useState(undefined);

  const [_activeFlag, _activeFlagSet] = useState(undefined);

  const [activeFlag, activeFlagSet] = useState(undefined);

  const animation = contextSafe((refCurrent = {}) => {
    gsap.to(refCurrent, {
      keyframes: [
        { pixi: { scale: 0.9, angle: -5 } },
        { pixi: { scale: 1.1, angle: 5 } },
        { pixi: { scale: 1, angle: 0 } }
      ],
      duration: 0.25,
      ease: 'bounce'
    });
  });

  useEffect(() => {
    Assets.load(assetAliasCollection[assetAliasIndexActive]).then(textureSet);
  }, [assetAliasIndexActive]);

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

      typeof _activeFlag === 'boolean' && animation(refCurrent);
    },
    { dependencies: [_activeFlag] }
  );

  useGSAP(
    () => {
      const refCurrent = /** @type {LayoutContainer} */ (ref.current);

      typeof activeFlag === 'boolean' &&
        (() => {
          animation(refCurrent);

          gsap.to(refCurrent, {
            pixi: activeFlag ? { y: -200 } : { y: 0 },
            delay: 0.25,
            duration: 1,
            ease: 'elastic.out'
          });
        })();
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
        padding: 20
      }}
      eventMode='static'
      cursor='pointer'
      onPointerEnter={() => _activeFlagSet(true)}
      onPointerLeave={() => _activeFlagSet(false)}
      onPointerTap={() => {
        assetAliasIndexActiveSet((assetAliasIndexActive = 0) =>
          !assetAliasIndexActive ? 1 : 0
        );

        activeFlagSet((activeFlag = false) => !activeFlag);

        _activeFlagSet(false);
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
        eventMode='none'
      >
        <pixiGraphics draw={() => {}} layout={{ position: 'absolute' }} />
      </pixiLayoutContainer>

      <pixiSprite texture={texture} layout={{}} />
    </pixiLayoutContainer>
  );
};

const Home = () => {
  const [assetAliasIndexActive, assetAliasIndexActiveSet] = useState(0);

  return (
    <div className={['Home', style.Home].join(' ')}>
      <Application_ backgroundColor={0x1099bb}>
        <LayoutContainer_
          assetAliasIndexActive={assetAliasIndexActive}
          assetAliasIndexActiveSet={assetAliasIndexActiveSet}
        />
      </Application_>
    </div>
  );
};

export default Home;
