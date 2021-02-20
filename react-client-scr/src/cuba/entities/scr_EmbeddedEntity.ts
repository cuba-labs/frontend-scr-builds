import { EmbeddableEntity } from "./base/sys$EmbeddableEntity";
export class EmbeddedEntity extends EmbeddableEntity {
  static NAME = "scr_EmbeddedEntity";
  name?: string | null;
}
export type EmbeddedEntityViewName = "_base" | "_local" | "_minimal";
export type EmbeddedEntityView<
  V extends EmbeddedEntityViewName
> = V extends "_base"
  ? Pick<EmbeddedEntity, "name">
  : V extends "_local"
  ? Pick<EmbeddedEntity, "name">
  : V extends "_minimal"
  ? Pick<EmbeddedEntity, "name">
  : never;
