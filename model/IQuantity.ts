/// <reference path="./IResource.ts" />

interface IQuantity {
    $type : string;
    getQuantity() : number ;
    getResource() : IResource;
    show() : string;
}