import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as passport from 'passport';
import { ClsService } from 'nestjs-cls';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: console,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes all invalid data from body
      transform: true, // Automatically transforms body to DTO
    }),
  );
  const configService = app.get(ConfigService);
  // RequestContext.setCls(app.get(ClsService));
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: true, // true allows all origins
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('Tag Al-waqaar')
    .setDescription('API Documentation for Tag Al-waqaar')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  await app.listen(
    configService.get('PORT') ? parseInt(configService.get('PORT')) : 3000,
  );
}
bootstrap();
