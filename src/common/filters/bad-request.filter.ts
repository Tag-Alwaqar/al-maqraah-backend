import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.getStatus() === 400) {
      const errorMessages = exception.getResponse()['message'];
      if (Array.isArray(errorMessages)) {
        const errors = this.flattenValidationErrors(errorMessages);

        response.status(422).json({
          status_code: 422,
          message: 'Error occurred',
          error: errors,
        });
        return;
      }
    }

    const { statusCode, message } = exception.getResponse() as any;
    response.status(exception.getStatus()).json({
      status_code: statusCode,
      message,
    });
  }

  private flattenValidationErrors(errors) {
    const errorMessage: Record<string, string> = {};
    errors.forEach((error) => {
      const errorObj = this.flattenValidationError(error);
      errorMessage[errorObj.field] = errorObj.message;
    });
    return errorMessage;
  }

  private flattenValidationError(error: string) {
    return {
      field: error.split(' ')[0],
      message: this.formatFieldMessage(error),
    };
  }

  private formatFieldMessage(message: string) {
    let upperCase = true;
    return message
      .split('_')
      .map((word) => {
        if (upperCase) {
          upperCase = false;
          return word.charAt(0).toUpperCase() + word.slice(1);
        } else {
          return word;
        }
      })
      .join(' ');
  }
}
