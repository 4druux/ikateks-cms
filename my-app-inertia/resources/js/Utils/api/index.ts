import axios from "axios";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export * from "./users";
export * from "./about";
export * from "./advantage";
export * from "./products";
export * from "./news";
export * from "./principals";
export * from "./customers";
export * from "./settings";
export * from "./hero";
