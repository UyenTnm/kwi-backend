// keyboard-layout.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('keyboard_layouts')
export class KeyboardLayout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}
