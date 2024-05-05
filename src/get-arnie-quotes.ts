import { httpGet } from './mock-http-interface';

interface SuccessResult {
  'Arnie Quote': string;
}

interface FailureResult {
  'FAILURE': string;
}

type TResult = SuccessResult | FailureResult;

type THttpResponse = {
  status: number;
  body: string;
}

const processResults = (results: PromiseSettledResult<THttpResponse>[]): TResult[] => {
  return results.map(result => {
    if (result.status === 'fulfilled') {
      try {
        const message = JSON.parse(result.value.body).message;

        if (result.value.status === 200) {
          return { 'Arnie Quote': message };
        } else {
          return { 'FAILURE': message };
        }
      } catch (error) {
        // Handling JSON parsing errors
        return { 'FAILURE': 'Invalid JSON response' };
      }
    } else {
      // Handling errors from Promise rejection
      const errorMessage = result.reason instanceof Error ? result.reason.message : 'Unknown error';
      return { 'FAILURE': errorMessage };
    }
  });
}

export const getArnieQuotes = async (urls : string[]) : Promise<TResult[]> => {
  // Choose Promise.allSettled instead of Promise.all,
  // because partial results is better than showing none here
  const results = await Promise.allSettled(urls.map(url => httpGet(url)));

  return processResults(results);
};
