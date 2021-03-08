/// <reference path="./IResource.ts" />

interface IQuantity {
    $type : string;
    getQuantity() : number ;
    getResource() : IResource;
    opposite() : Quantity;
    show() : string;
}