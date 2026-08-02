// Crea los usuarios iniciales (1 admin y 2 lideres) con contrasena cifrada.
// Ejecutar con: npm run seed  (una sola vez, despues de crear las tablas con database/create_tables.sql)
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { Usuario, RolUsuario } from './usuarios/entities/usuario.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usuariosRepo = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));

  const usuarios = [
    { nombre: 'Administrador General', username: 'admin', password: 'admin123', rol: RolUsuario.ADMIN },
    { nombre: 'Juan Perez', username: 'jperez', password: 'lider123', rol: RolUsuario.LIDER },
    { nombre: 'Maria Lopez', username: 'mlopez', password: 'lider123', rol: RolUsuario.LIDER },
  ];

  for (const u of usuarios) {
    const existente = await usuariosRepo.findOne({ where: { username: u.username } });
    if (existente) {
      console.log(`Usuario "${u.username}" ya existe, se omite.`);
      continue;
    }
    const hash = await bcrypt.hash(u.password, 10);
    await usuariosRepo.save(usuariosRepo.create({ ...u, password: hash }));
    console.log(`Usuario creado: ${u.username} / ${u.password} (rol: ${u.rol})`);
  }

  console.log('Seed completado. Ahora puedes correr database/insert_data.sql para los datos de ejemplo.');
  await app.close();
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
