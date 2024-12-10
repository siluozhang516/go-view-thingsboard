import request from "@/utils/axios";

export function getData(params = {}) {
    return request({
        url: "/api/device/data/tree?mock=1",
        method: "get",
        params
    });
}

export interface DataTree {
    id: string,
    name: string,
    children: DataTree[]
}