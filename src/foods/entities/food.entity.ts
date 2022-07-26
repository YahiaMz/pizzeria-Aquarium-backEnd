import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { FoodSize } from 'src/food_size/entities/food_size.entity';


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

  @Column({ type: 'integer', unsigned: true, nullable: true })
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


@OneToMany(_type => FoodSize , _size => _size.food , {nullable : true , onDelete : "CASCADE" , onUpdate : 'CASCADE'})
sizes : FoodSize[];

}
