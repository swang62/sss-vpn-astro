import { atom } from "nanostores";

export type User = {
  email: string;
  id: string;
  name: string;
};

const defaultUser: User = {
  email: "",
  id: "",
  name: "",
};

export const user = atom(defaultUser);
