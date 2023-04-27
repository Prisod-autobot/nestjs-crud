import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, name, tel, password } = createUserDto;
        const hash = await bcrypt.hash(password, 10);

        const user = new User();
        user.email = email;
        user.name = name;
        user.tel = tel;
        user.password = hash;
        user.created_at = new Date();
        user.updated_at = new Date();

        const queryRunner = this.userRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const createdUser = await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            return createdUser;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        const { email, name, tel, password } = updateUserDto;
        if (email) user.email = email;
        if (name) user.name = name;
        if (tel) user.tel = tel;
        if (password) user.password = password;
        user.updated_at = new Date();

        return await this.userRepository.save(user);
    }

    async remove(id: number): Promise<string> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);

        return "deleted";
    }
}
