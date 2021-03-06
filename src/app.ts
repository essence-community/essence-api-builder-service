import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EssenceCoreAuth } from './modules/EssenceCoreAuth';
import { AppLogger } from './services/AppLogger';
import './Constant';
import { LoggingInterceptor } from './services/LoggingInterceptor';
export async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true, logger: new AppLogger() });

    const config = new DocumentBuilder()
        .setTitle('Essence Api Builder Service')
        .setDescription('Essence Api Builder Service')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('apiDoc', app, document);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new LoggingInterceptor());

    if (process.env.ESSENCE_CORE_URL) {
        app.useGlobalGuards(new EssenceCoreAuth());
    }
    
    await app.listen(parseInt(process.env.HTTP_PORT || '3000', 10));
}
