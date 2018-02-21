export class RegionModel {
    name: string;
    latLon: string;
    radius: number;
    district: Array<{ name: string; latLon: string; radius: number }>;
}
