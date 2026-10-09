import { CallHandler, ExecutionContext, Injectable } from "@nestjs/common";
import { NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class TranFormInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const reponse = ctx.getResponse();
        const statusCode = reponse.statusCode;

        const statusVal = statusCode >= 200 && statusCode < 300;

        return next.handle().pipe(
            map(data => {
                if (data === undefined || data === null) {
                    return { status: statusVal, statusCode }
                }
                if (data !== 'object' || Array.isArray(data)) {
                    return { status: statusVal, statusCode, data }
                }
                if (data && ('data' in data || 'meta' in data || 'accsetToken' in data)) {
                    return { status: statusVal, statusCode, ...data }
                }

                return {
                    status: statusVal,
                    statusCode,
                    data
                }
            })
        )

    }
}