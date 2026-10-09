import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const FiscalYear = createParamDecorator(
   (data: unknown, ctx: ExecutionContext): number => {
     const request = ctx.switchToHttp().getRequest();

     if (request.query?.year) {
       const qYear = parseInt(request.query.year, 10);
       if (!isNaN(qYear)) return qYear;
     }

     const headerYear = request.headers['x-fiscal-year'];
     if (headerYear) {
       const hYear = parseInt(headerYear, 10);
       if (!isNaN(hYear)) return hYear;
     }

     return new Date().getFullYear(); 
   },
 );