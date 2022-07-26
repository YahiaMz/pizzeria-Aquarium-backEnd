import { Food } from "src/foods/entities/food.entity";
import { FoodSize } from "src/food_size/entities/food_size.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {

    @PrimaryGeneratedColumn()
    id : number ;
    
    @ManyToOne(_t => User  , {nullable : false , onDelete:'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'user_Id', referencedColumnName : 'id'}   )
    public user : User;
    
    @Column({type : "int" , nullable : false , default : 1 , unsigned : true})
    quantity : number;
     
    @ManyToOne(_t => Food , {nullable : false , onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'food_Id' , referencedColumnName : 'id'} ,)
    public food : Food;

    @ManyToOne(_t => FoodSize , fs => fs.cart , {onDelete : 'CASCADE' , onUpdate : 'CASCADE'} )
    @JoinColumn({name:'size_Id'})
    public foodSize : FoodSize;

}
