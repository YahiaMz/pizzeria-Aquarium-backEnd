import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Slide {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'varchar' , nullable : false , unique : true})
    imageUrl : string

}
