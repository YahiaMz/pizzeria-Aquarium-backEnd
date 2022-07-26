import { Cart } from "src/carts/entities/cart.entity";
import { Food } from "src/foods/entities/food.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['food','size'])
export class FoodSize {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({type : 'varchar' , length : 30})
    size : string;

    @Column({type: 'integer' , unsigned :true , nullable : false})
    price : number;

    @ManyToOne(_type => Food , food => food.sizes , {onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'food_Id'} )
    food : Food;

    @OneToMany(_type => Cart , cart => cart.foodSize  ,{nullable : true , onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    cart : Cart[];
}
