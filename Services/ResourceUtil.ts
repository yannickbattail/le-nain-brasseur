import { ICategorizedMaterial } from '../Models/Resources/ICategorizedMaterial';

class ResourceUtil {
    public show(res: ICategorizedMaterial, quantity: number): string {
        let u = res.unit;
        let q = quantity;
        if (u == 'g') {
            if (quantity >= 1000000) {
                u = 'T';
                q = Math.round(q / 10000) / 100;
            } else if (quantity >= 1000) {
                u = 'kg';
                q = Math.round(q / 100) / 10;
            }
        }
        if (u == 'cl') {
            if (quantity >= 100) {
                u = 'l';
                q = Math.round(q / 10) / 10;
            }
        }
        return q + u;
    }
}
