import { NestFactory } from '@nestjs/core';
import { SeederModule } from '@seeders/seeder.module';
import { SeederService } from '@seeders/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(SeederModule);
  const seeder = app.get(SeederService);
  await seeder.seed();
  await app.close();
}

bootstrap();
