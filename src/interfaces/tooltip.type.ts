export type ITooltip =
  | null
  | string
  | {
      className?: string;
      html?: string;
      style?: Partial<CSSStyleDeclaration>;
      text?: string;
    };
