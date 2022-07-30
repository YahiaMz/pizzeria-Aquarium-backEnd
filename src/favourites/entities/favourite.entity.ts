import { Food } from "src/foods/entities/food.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['food', 'user'])
export class Favourite {

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(_type => Food  , {onDelete  : 'CASCADE', onUpdate : 'CASCADE' , nullable : false})
    @JoinColumn({name : 'food_Id'})
    food : Food;


    @ManyToOne(_type => User  , {onDelete  : 'CASCADE', onUpdate : 'CASCADE' , nullable : false})
    @JoinColumn({name : 'user_Id'})
    user : User;




}
