export type CreateBookRequest = {
  title: string;
  author: string;
  coverImage: string;
  categoryId: string;
  stock:number;
};

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  coverImage?: string;
  categoryId?: string;
  stock?:number;
}

export interface GetBookReponse {
  category: {
    id: string;
    name: string;
  };
  id: string;
  title: string;
  author: string;
  coverImage: string;
  stock:number;
}
