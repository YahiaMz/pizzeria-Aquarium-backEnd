import { Cart } from "src/carts/entities/cart.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {


    @PrimaryGeneratedColumn()
    id : number ;

    @Column({type : 'varchar' , length : 50 , nullable : true})
    name : string;

    @Column({type : 'varchar' , nullable : false})
    password : string;

    @Column({type:'varchar' , length : 10,nullable : false , unique : true})    
    phoneNumber : string;

    @Column({type:"varchar" , nullable : true})
    imageProfileUrl : string;

    @CreateDateColumn()
    created_at : string;

    @UpdateDateColumn()
    updated_at : string;

   

}
