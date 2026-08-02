import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Grupo } from '../../grupos/entities/grupo.entity';

@Entity('ofrendas')
export class Ofrenda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_grupo' })
  id_grupo: number;

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'id_grupo' })
  grupo: Grupo;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;
}
