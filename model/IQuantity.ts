import { Quantity } from "./Quantity";
import { IResource } from "./IResource";

export interface IQuantity {
  $type: string;

  getQuantity(): number;

  getResource(): IResource;

  opposite(): Quantity;

  show(): string;
}
