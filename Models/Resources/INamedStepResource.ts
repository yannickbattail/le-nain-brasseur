import { IResource } from './IResource.js';

export interface INamedStepResource extends IResource {
    image: string;
    stepNames: string[];
}
