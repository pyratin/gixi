import { useState, useEffect } from 'react';
import { Assets, Sprite } from 'pixi.js';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import { useExtend } from '@pixi/react';

import Application_ from './Component/Application_';
import style from './index.module.scss';

const assetAliasCollection = ['flowerTop', 'eggHead'];

Assets.add(
  assetAliasCollection.map((alias) => ({
    alias,
    src: `/asset/sprite/${alias}.png`
  }))
);

Assets.backgroundLoad(assetAliasCollection);

const LayoutContainer__ = ({
  assetAliasIndexActive,
  assetAliasIndexActiveSet
}) => {
  useExtend({ LayoutContainer, Sprite });

  const [texture, textureSet] = useState(undefined);

  useEffect(() => {
    Assets.load(assetAliasCollection[assetAliasIndexActive]).then(textureSet);
  }, [assetAliasIndexActive]);

  return (
    <pixiLayoutContainer
      layout={{ padding: 20, borderWidth: 1, borderColor: 0x000000 }}
      eventMode='static'
      cursor='pointer'
      onPointerTap={() =>
        assetAliasIndexActiveSet((assetAliasIndexActive = 0) =>
          !assetAliasIndexActive ? 1 : 0
        )
      }
    >
      <pixiSprite texture={texture} layout={{}} />
    </pixiLayoutContainer>
  );
};

const LayoutContainer_ = () => {
  useExtend({ LayoutContainer });

  const [assetAliasIndexActive, assetAliasIndexActiveSet] = useState(0);

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
      <LayoutContainer__
        assetAliasIndexActive={assetAliasIndexActive}
        assetAliasIndexActiveSet={assetAliasIndexActiveSet}
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
