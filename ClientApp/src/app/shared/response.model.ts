export class ResponseModel<T>{
    errorCode: number;
    errorMessage: string;
    data: T;
}