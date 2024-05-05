import { httpGet } from './mock-http-interface';

// TODO define this type properly
type TResult = {
  'Arnie Quote'?: string;
  'FAILURE'?: string;
}

export const getArnieQuotes = async (urls : string[]) : Promise<TResult[]> => {
  // TODO: Implement this function.
  
  const results = urls.map(async (url): Promise<TResult> => {
    try {
      const { status, body } = await httpGet(url);
      const message =  JSON.parse(body).message;
      return (status === 200) ? { 'Arnie Quote': message } : { 'FAILURE': message };
    } catch (error: any) {
      return { 'FAILURE': error.message || 'Request failed' };
    }
  });

  return Promise.all(results);
};
