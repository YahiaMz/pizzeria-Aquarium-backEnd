import { Cart } from "src/carts/entities/cart.entity";
import { OrderItem } from "src/order-items/entities/order-item.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id : number ;

    @Column({type : 'tinyint' , nullable : false , default : 1})
    status : number ;

    @Column({type : 'varchar' ,nullable : false  })
    address : string;

    @Column({type : 'varchar' , nullable : false , length : 10 })
    phoneNumber : string;

    @ManyToOne(_type => User , {nullable : true , onDelete : 'SET NULL' , onUpdate : 'SET NULL' })
    @JoinColumn({name : 'user_Id'})
    user : User;

    @OneToMany(_type => OrderItem , _item => _item.order )
    orderItems : OrderItem[];

    @Column({type : "integer" , unsigned : true ,nullable : false , default : 100})
    totalPrice : number;
    
    @Column({type : 'varchar' , nullable : false  })
    area : string;

    @Column({type : 'bool' , nullable : false , default : false})
    isReceived : boolean

    @CreateDateColumn()
    created_at : string;
 
    @UpdateDateColumn()
    updated_at : string;
}
