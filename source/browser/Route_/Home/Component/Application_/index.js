import { Application } from '@pixi/react';

const Application_ = ({
  backgroundColor = undefined,
  children = undefined
}) => {
  return (
    <Application resizeTo={window} backgroundColor={backgroundColor}>
      {children}
    </Application>
  );
};

export default Application_;
