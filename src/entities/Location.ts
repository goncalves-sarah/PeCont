import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { User } from "./User";

@Entity("locations")
class Location {

    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;

    @Column()
    total_people_inside: number;

    @Column()
    owner: string;

    @JoinColumn({ name: "owner"})
    @ManyToOne(() => User)
    userOwner: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor() {
        if(!this.id){
            this.id = uuid();
        }
    }
}

export { Location };