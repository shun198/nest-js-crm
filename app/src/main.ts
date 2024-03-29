import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    credentials: true,
    origin: [process.env.TRUSTED_ORIGINS],
  });
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Todo API Project')
      .setDescription('Todo API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs/', app, document);
    // Swaggerによるキャッシュ制御を無効にする
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', '0');
      next();
    });
  }
  await app.listen(8000);
}
bootstrap();
