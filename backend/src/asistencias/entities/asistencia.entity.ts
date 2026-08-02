import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Miembro } from '../../miembros/entities/miembro.entity';
import { Grupo } from '../../grupos/entities/grupo.entity';

export enum TipoAsistencia {
  GRUPO = 'grupo',
  DOMINGO = 'domingo',
}

@Entity('asistencias')
export class Asistencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_miembro' })
  id_miembro: number;

  @ManyToOne(() => Miembro)
  @JoinColumn({ name: 'id_miembro' })
  miembro: Miembro;

  @Column({ name: 'id_grupo' })
  id_grupo: number;

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'id_grupo' })
  grupo: Grupo;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'enum', enum: TipoAsistencia })
  tipo: TipoAsistencia;

  @Column({ default: true })
  asistio: boolean;
}
