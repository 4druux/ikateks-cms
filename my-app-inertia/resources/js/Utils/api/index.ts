import axios from "axios";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export * from "./users";
export * from "./products";
export * from "./news";
export * from "./principals";
export * from "./customers";
