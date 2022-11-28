export interface User {
  uid?: string,
  username: string,
  email: string
}

//user doc accessed using user sub collection
export interface UserDoc {
  id?: string,
  documentid: string, //reference for interface document
}

export interface Document {
  id?: string,
  title: string,
  url: string,
  kategori: string,
  visibility: boolean,
  ownerid: string,  //reference for interface user
}
