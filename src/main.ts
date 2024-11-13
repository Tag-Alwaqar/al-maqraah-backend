import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { ClsService } from 'nestjs-cls';
import { RequestContext } from '@common/utils/request-context.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes all invalid data from body
      transform: true, // Automatically transforms body to DTO
    }),
  );
  const configService = app.get(ConfigService);

  RequestContext.setCls(app.get(ClsService));

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.setGlobalPrefix('api');

  app.use(passport.initialize());
  app.use(passport.session());

  const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };

  app.enableCors(corsOptions);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Tag Al-waqaar')
    .setDescription('API Documentation for Tag Al-waqaar')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup('docs', app, document);

  await app.listen(
    configService.get('PORT') ? parseInt(configService.get('PORT')) : 3000,
  );
}
bootstrap();
