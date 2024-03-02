import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Proxi reverso para acesso local das APIs
  app.use(
    '/api/v1/test-haytek-api/*',
    createProxyMiddleware({
      target: 'https://stg-api.haytek.com.br',
      changeOrigin: true,
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
    })
  );

  await app.listen(8089);
}
bootstrap();
