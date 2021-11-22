import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Location } from "./Location";
import { User } from "./User";

@Entity("cameras")
class Camera {

    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;

    @Column()
    location: string;

    @JoinColumn({ name: "location"})
    @ManyToOne(() => Location)
    current_location: Location;

    @Column()
    status: Number;

    @Column()
    ip: string;

    @Column()
    pid: number;

    @Column()
    user: string;

    @JoinColumn({ name: "user"})
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

export { Camera };