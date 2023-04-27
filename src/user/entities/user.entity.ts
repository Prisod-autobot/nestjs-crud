import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum UserRole {
    ADMIN = "admin",
    GUARD = "guard",
    MEMBER = "member",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column()
    name: string;

    @Column()
    tel: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.MEMBER,
    })
    role: UserRole;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}
