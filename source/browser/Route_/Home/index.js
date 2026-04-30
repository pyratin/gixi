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

/** @type {[string, string[]][]} */
const bundleDefinitionCollection = [
  ['start-screen', ['flowerTop']],
  ['game-screen', ['eggHead']]
];

Assets.init({
  manifest: {
    bundles: bundleDefinitionCollection.map(([name, assetAliasCollection]) => ({
      name,
      assets: assetAliasCollection.map((alias) => ({
        alias,
        src: `/asset/sprite/${alias}.png`
      }))
    }))
  }
});

Assets.backgroundLoadBundle(bundleDefinitionCollection.map(([name]) => name));

const LayoutContainer_ = ({
  bundleDefinitionIndexActive = 0,
  bundleDefinitionIndexActiveSet
}) => {
  useExtend({ LayoutContainer, Sprite, Graphics });

  const { contextSafe } = useGSAP();

  const ref = useRef(undefined);

  const [texture, textureSet] = useState(undefined);

  const animation = contextSafe((event = {}) => {
    gsap.to(event.target, {
      keyframes: [
        { pixi: { x: 2, scale: 1.05, angle: 2 } },
        { pixi: { x: -2, scale: 0.95, angle: -2 } },
        { pixi: { x: 0, scale: 1, angle: 0 } }
      ],
      duration: 0.25,
      ease: 'bounce',
      overwrite: 'auto'
    });
  });

  const _animation = contextSafe(
    (event = {}, bundleDefinitionIndexActive = false) => {
      gsap.to(event.target, {
        keyframes: [{ pixi: { y: bundleDefinitionIndexActive ? -200 : 0 } }],
        delay: 0.25,
        duration: 0.5,
        ease: 'bounce',
        overwrite: 'auto'
      });
    }
  );

  useEffect(() => {
    const [name, [alias]] =
      bundleDefinitionCollection[bundleDefinitionIndexActive];

    Assets.loadBundle(name).then((bundleObject) =>
      textureSet(bundleObject[alias])
    );
  }, [bundleDefinitionIndexActive]);

  useEffect(() => {
    const refCurrent = /** @type {LayoutContainer} */ (ref.current);

    const refCurrentGraphics = /** @type {Graphics} */ (
      refCurrent.getChildByLabel('graphics-container').getChildAt(0)
    );

    const onRefCurrentLayoutHandle = () => {
      const {
        layout: { _computedLayout: { width = 0, height = 0 } = {} } = {}
      } = refCurrent;

      const radius = Math.max(width, height) / 2;

      Object.assign(
        refCurrent,
        /** @type {pixiJs.ContainerOptions} */ ({
          hitArea: new Circle(width / 2, height / 2, radius)
        })
      );

      refCurrentGraphics
        .clear()
        .circle(0, 0, radius)
        .fill({ color: 0xffffff, alpha: 0.25 })
        .stroke({ alignment: 1, width: 8, color: 0x000000, alpha: 0.25 });
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
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20 * (!bundleDefinitionIndexActive ? 1 : 1.6)
      }}
      eventMode='static'
      cursor='pointer'
      onPointerEnter={animation}
      onPointerTap={(event = {}) => {
        bundleDefinitionIndexActiveSet((bundleDefinitionIndexActive = 0) => {
          const _bundleDefinitionIndexActive = !bundleDefinitionIndexActive
            ? 1
            : 0;

          _animation(event, !!_bundleDefinitionIndexActive);

          return _bundleDefinitionIndexActive;
        });
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
  const [bundleDefinitionIndexActive, bundleDefinitionIndexActiveSet] =
    useState(undefined);

  return (
    <div className={['Home', style.Home].join(' ')}>
      <Application_ backgroundColor={0x1099bb}>
        <LayoutContainer_
          bundleDefinitionIndexActive={bundleDefinitionIndexActive}
          bundleDefinitionIndexActiveSet={bundleDefinitionIndexActiveSet}
        />
      </Application_>
    </div>
  );
};

export default Home;
