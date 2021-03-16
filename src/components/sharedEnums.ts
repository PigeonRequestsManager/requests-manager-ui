// TODO: change object to enum as its nicer in TS
// export enum editors {
//     headers = 'headers',
//     body = 'body'
// }

export const editorsDict = {
  headers: 'headers',
  body: 'body'
}

export type EditorsType = keyof typeof editorsDict

export const EditorsArray = Object.keys(editorsDict) as EditorsType[]
