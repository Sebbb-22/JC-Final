import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GruposModule } from './grupos/grupos.module';
import { MiembrosModule } from './miembros/miembros.module';
import { AsistenciasModule } from './asistencias/asistencias.module';
import { OfrendasModule } from './ofrendas/ofrendas.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // las tablas se crean con database/create_tables.sql
        dateStrings: true,
      }),
    }),
    AuthModule,
    GruposModule,
    MiembrosModule,
    AsistenciasModule,
    OfrendasModule,
    ReportesModule,
  ],
})
export class AppModule {}
