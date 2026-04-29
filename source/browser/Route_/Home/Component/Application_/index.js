import { useState, useEffect } from 'react';
import { Application, useApplication } from '@pixi/react';
import * as pixiLayout from '@pixi/layout';
import * as pixiJs from 'pixi.js';

const dimensionGet = () => {
  const { innerWidth, innerHeight } = window;

  return { width: innerWidth, height: innerHeight };
};

const Application__ = ({ children }) => {
  const {
    app: { stage, renderer }
  } = useApplication();

  useEffect(() => {
    Object.assign(
      stage,
      /** @type {pixiJs.ContainerOptions} */ ({
        layout: /** @type {pixiLayout.LayoutOptions} */ ({
          ...dimensionGet(),
          justifyContent: 'center',
          alignItems: 'center'
        })
      })
    );

    const onRendererResizeHandle = () =>
      Object.assign(
        stage,
        /** @type {pixiJs.ContainerOptions} */ ({
          layout: /** @type {pixiLayout.LayoutOptions} */ (dimensionGet())
        })
      );

    renderer.on('resize', onRendererResizeHandle);

    return () => {
      renderer.off('resize', onRendererResizeHandle);
    };
  }, [stage, renderer]);

  return children;
};

const Application_ = ({
  backgroundColor = undefined,
  children = undefined
}) => {
  const [initialized, initializedSet] = useState(false);

  return (
    <Application
      resizeTo={window}
      backgroundColor={backgroundColor}
      onInit={() => initializedSet(true)}
    >
      {initialized && <Application__>{children}</Application__>}
    </Application>
  );
};

export default Application_;
