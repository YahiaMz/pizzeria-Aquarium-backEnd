import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Area {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({unique :true , nullable : false })
    area : string;
}
