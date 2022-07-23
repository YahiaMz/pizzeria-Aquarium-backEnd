import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Category {
   @PrimaryGeneratedColumn()
   id : number ;

   @Column({unique : true , nullable : false})
   name : string;

   @Column({unique : true , })
   imageUrl : string;

   @CreateDateColumn()
   created_at : string;

   @UpdateDateColumn()
   updated_at : string;

}
