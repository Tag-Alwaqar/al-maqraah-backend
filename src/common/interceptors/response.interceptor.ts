import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { snakeCase } from 'lodash';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (this.isSuccess(context.switchToHttp().getResponse().statusCode)) {
          return {
            status_code: context.switchToHttp().getResponse().statusCode,
            data: this.convertToSnakeCase(data),
          };
        } else {
          return {
            status_code: context.switchToHttp().getResponse().statusCode,
            ...data,
          };
        }
      }),
    );
  }

  private convertToSnakeCase(data: any): any {
    try {
      if (typeof data !== 'object' || data == null || data instanceof Date) {
        return data;
      }

      if (Array.isArray(data)) {
        return data.map((item) => this.convertToSnakeCase(item));
      }

      const convertedData = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const convertedKey = snakeCase(key);
          convertedData[convertedKey] = this.convertToSnakeCase(data[key]);
        }
      }

      return convertedData;
    } catch (err) {
      return data;
    }
  }

  isSuccess(statusCode: number): boolean {
    // Add your custom logic here to determine if the status code represents success
    // For example, you can check if the status code falls within the 2xx range
    return statusCode >= HttpStatus.OK && statusCode < 400;
  }
}
