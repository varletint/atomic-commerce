export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Status = "idle" | "loading" | "success" | "error";

export interface SelectOption {
  label: string;
  value: string;
}
