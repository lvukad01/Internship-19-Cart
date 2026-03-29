import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));

  const config=new DocumentBuilder()
    .setTitle('Cart App API')
    .setDescription('API documentation for mobile app and admin dashboard')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

    const document=SwaggerModule.createDocument(app,config);
    SwaggerModule.setup('api',app, document)


    app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
