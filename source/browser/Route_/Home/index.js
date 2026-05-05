import { useState, useEffect } from 'react';
import { Assets, Sprite } from 'pixi.js';
import '@pixi/layout';
import { LayoutContainer } from '@pixi/layout/components';
import { useExtend } from '@pixi/react';

import Application_ from './Component/Application_';
import style from './index.module.scss';

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
  bundleDefinitionIndexActive,
  bundleDefinitionIndexActiveSet
}) => {
  useExtend({ LayoutContainer, Sprite });

  const [texture, textureSet] = useState(undefined);

  useEffect(() => {
    const [name, [alias]] =
      bundleDefinitionCollection[bundleDefinitionIndexActive];

    Assets.loadBundle(name).then((bundleObject) =>
      textureSet(bundleObject[alias])
    );
  }, [bundleDefinitionIndexActive]);

  return (
    <pixiLayoutContainer
      layout={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderWidth: 1,
        borderColor: 0x000000
      }}
      eventMode='static'
      cursor='pointer'
      onPointerTap={() =>
        bundleDefinitionIndexActiveSet((bundleDefinitionIndexActive = 0) =>
          !bundleDefinitionIndexActive ? 1 : 0
        )
      }
    >
      <pixiSprite texture={texture} layout={{}} />
    </pixiLayoutContainer>
  );
};

const Home = () => {
  const [bundleDefinitionIndexActive, bundleDefinitionIndexActiveSet] =
    useState(0);

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
