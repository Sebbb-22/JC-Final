import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RolUsuario {
  ADMIN = 'admin',
  LIDER = 'lider',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  username: string;

  // select: false -> nunca se incluye por defecto en los SELECT (evita filtrar el hash
  // por accidente, como en las relaciones "lider" de Grupo). auth.service.ts lo pide
  // explicitamente con addSelect() para poder comparar el password en el login.
  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: RolUsuario })
  rol: RolUsuario;
}
