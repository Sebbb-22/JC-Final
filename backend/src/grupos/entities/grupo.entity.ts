import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum DiaSemana {
  LUNES = 'Lunes',
  MARTES = 'Martes',
  MIERCOLES = 'Miercoles',
  JUEVES = 'Jueves',
  VIERNES = 'Viernes',
  SABADO = 'Sabado',
  DOMINGO = 'Domingo',
}

@Entity('grupos')
export class Grupo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ name: 'id_lider' })
  id_lider: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_lider' })
  lider: Usuario;

  @Column({ type: 'enum', enum: DiaSemana, name: 'dia_semana' })
  dia_semana: DiaSemana;

  @Column({ type: 'time' })
  hora: string;

  @Column({ nullable: true })
  ubicacion: string;
}
