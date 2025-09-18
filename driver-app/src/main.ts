import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow the Next dev server (http://localhost:3001) to call the API
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  await app.listen(4000);   // <-- make sure this matches the port you’ll use in the front‑end
}
bootstrap();
