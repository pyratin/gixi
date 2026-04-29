import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      /** Registered at runtime via `@pixi/react` useExtend */
      // @ts-expect-error -- missing dependencies
      pixiLayoutContainer: import('@pixi/react').PixiReactElementProps<
        typeof import('@pixi/layout/components').LayoutContainer
      > & {
        // @ts-expect-error -- missing dependencies
        layout?: Partial<import('@pixi/layout').LayoutStyles> | boolean;
      };
      /** Registered at runtime via `@pixi/react` useExtend */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pixiText: any;
    }
  }
}
