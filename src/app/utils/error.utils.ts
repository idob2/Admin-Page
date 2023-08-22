const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message
    return String(error)
};
interface AxiosError {
    response?: {
      status?: number;
      [key: string]: any; // allow other properties
    };
    [key: string]: any; // allow other properties
  }
  
export {getErrorMessage};