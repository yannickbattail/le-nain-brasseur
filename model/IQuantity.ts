import { Quantity } from "./Quantity.js";
import { IResource } from "./IResource.js";

export interface IQuantity {
  $type: string;

  getQuantity(): number;

  getResource(): IResource;

  opposite(): Quantity;

  show(): string;
}
