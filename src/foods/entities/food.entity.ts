import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';


@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;

  @Column({ unique: true })
  imageUrl: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'integer', unsigned: true, nullable: false })
  price: number;

  @CreateDateColumn()
  created_at : string;

  @UpdateDateColumn()
  updated_at : string;

  @ManyToOne((type) => Category, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id' , name : 'category_Id' })
  Category: Category;
}
