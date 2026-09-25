export interface ListResponse<T> {
  data: T[];
}

export interface ItemResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    message: string;
  };
}
