import axios from 'axios';


export async function blobUrltoFileHelper<T extends { [name: string]: string }>(urls: T): Promise<File[]> {
  const files$ = Object.keys(urls).map((key: string) => {
    return axios.get<Blob>(urls[key], { responseType: "blob" })
      .then(blob => new File([blob.data], key))
  });
  return await Promise.all(files$);
}