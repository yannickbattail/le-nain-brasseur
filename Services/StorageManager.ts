import { IQuantity } from '../Models/Resources/IQuantity';
import { Quantity } from '../Models/Resources/Quantity';
import { CategorizedItem } from '../Models/Resources/CategorizedItem';
import { CategorizedMaterial } from '../Models/Resources/CategorizedMaterial';

export class StorageManager {
    constructor(
        protected storage: Array<Quantity>,
        protected preventNegativeStorage: boolean,
    ) {}

    getStorage(): Array<IQuantity> {
        return this.storage;
    }

    public getStorageByCategory(category: string): Array<IQuantity> {
        return this.storage.filter((resQ) => {
            const resource = resQ.getResource();
            return (resource instanceof CategorizedItem || resource instanceof CategorizedMaterial) && resource.category == category;
        });
    }

    public increaseStorage(quantity: IQuantity) {
        let resQ = this.getResourceInStorage(quantity.getResource().getName());
        if (resQ == null) {
            resQ = new Quantity(0, quantity.getResource());
            this.storage.push(resQ);
        }
        if (resQ.getQuantity() + quantity.getQuantity() < 0 && this.preventNegativeStorage) {
            resQ.setQuantity(0);
        } else {
            resQ.setQuantity(resQ.getQuantity() + quantity.getQuantity());
        }
        this.removeZeroResource();
    }

    public decreaseStorage(quantity: IQuantity) {
        let resQ = this.getResourceInStorage(quantity.getResource().getName());
        if (resQ == null) {
            resQ = new Quantity(0, quantity.getResource());
            this.storage.push(resQ);
        }
        if (resQ.getQuantity() + -1 * quantity.getQuantity() < 0 && this.preventNegativeStorage) {
            resQ.setQuantity(0);
        } else {
            resQ.setQuantity(resQ.getQuantity() + -1 * quantity.getQuantity());
        }
        this.removeZeroResource();
    }

    public getResourceInStorage(resourceName: string): Quantity | null {
        const res = this.storage.filter((res: Quantity) => res.getResource().getName() == resourceName);
        if (res.length) {
            return res[0];
        }
        return null;
    }

    public hasResources(resourcesQuantity: IQuantity[]): boolean {
        let hasRes = true;
        resourcesQuantity.forEach((resQ) => {
            const playerRes = this.getResourceInStorage(resQ.getResource().getName());
            if (playerRes == null || playerRes.getQuantity() < resQ.getQuantity()) {
                hasRes = false;
            }
        });
        return hasRes;
    }

    private removeZeroResource() {
        this.storage = this.storage.filter((q) => q.getQuantity() != 0);
    }
}
