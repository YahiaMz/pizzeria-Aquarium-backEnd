import { Food } from "src/foods/entities/food.entity";
import { FoodSize } from "src/food_size/entities/food_size.entity";
import { Orders } from "src/orders/entities/order.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn()
    id : number ;
    
    @Column({type : "int" , nullable : false , default : 1 , unsigned : true})
    quantity : number;
     
    @ManyToOne(_t => Orders , {nullable : false , onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'order_Id' , referencedColumnName : 'id'} ,)
    public order : Orders;
    
    @ManyToOne(_t => Food , {nullable : false , onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'food_Id' , referencedColumnName : 'id'} ,)
    public food : Food;

    @ManyToOne(_t => FoodSize , { nullable : true,onDelete : 'CASCADE' , onUpdate : 'CASCADE'} )
    @JoinColumn({name:'size_Id'})
    public foodSize : FoodSize;

    @Column({type : "int" , nullable : false , unsigned : true})
    itemPrice : number;

}
