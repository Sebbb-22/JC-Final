import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Grupo } from '../../grupos/entities/grupo.entity';

@Entity('miembros')
export class Miembro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  edad: number;

  @Column({ nullable: true })
  telefono: string;

  @Column({ name: 'id_grupo' })
  id_grupo: number;

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'id_grupo' })
  grupo: Grupo;
}
