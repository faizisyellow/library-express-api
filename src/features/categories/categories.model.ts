export type CreateCategoryRequest = {
  name: string;
};

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  id: string;
}

export type CreateCategoryResponse = {
  name: string;
  id: string;
};

export interface GetCategoryResponse {
  id: string;
  name: string;
}
