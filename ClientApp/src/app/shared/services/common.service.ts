import { Injectable } from "@angular/core";
import { Message } from "primeng-lts";
import { ResponseModel } from "../response.model";

@Injectable()
export class CommonService {
    isResponseValid<T>(response: ResponseModel<T>): boolean {
        return response.errorCode === 0;
    }

    getMessage(detail: string, summary: string, severity: string): Message {
        const message: Message = { detail: detail, severity: severity, summary: summary };
        return message;
    }
}