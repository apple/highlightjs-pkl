import { LanguageFn } from "highlight.js";

declare module "highlightjs-pkl" {
  const pkl: LanguageFn;
  export default pkl;
}
