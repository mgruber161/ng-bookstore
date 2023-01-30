export interface IBooksGetDto {
    records: IRecord[]
  }
  
  export interface IRecord {
    id: string
    createdTime: string
    fields: IFields
  }
  
  export interface IFields {
    title: string
    isbn: string
    author: string
    preview: string
  }

  export interface IPostDto {
    fields : IFields
  }

  export interface IBook{
    id: string
    title: string
    isbn: string
    author: string
    preview: string
}