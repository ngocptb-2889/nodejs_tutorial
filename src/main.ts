import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DEFAULT_VERSION, PREFIX_API } from './common';
import { ConfigService } from '@nestjs/config';
import {
  I18nValidationPipe,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import { useContainer } from 'class-validator';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix(PREFIX_API);

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: DEFAULT_VERSION,
    prefix: 'v',
  });

 app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Real world API')
    .setDescription('API documentation for the real world application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
}

bootstrap();
