import { StandardEntity } from "./base/sys$StandardEntity";
export class EmbeddedTestEntity extends StandardEntity {
  static NAME = "scr_EmbeddedTestEntity";
  ownAttribute?: string | null;
  embedded?: any | null;
}
export type EmbeddedTestEntityViewName = "_base" | "_local" | "_minimal";
export type EmbeddedTestEntityView<
  V extends EmbeddedTestEntityViewName
> = V extends "_base"
  ? Pick<EmbeddedTestEntity, "id" | "ownAttribute">
  : V extends "_local"
  ? Pick<EmbeddedTestEntity, "id" | "ownAttribute">
  : never;
