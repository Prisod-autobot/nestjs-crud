import { IsEmail, IsNotEmpty, IsNumberString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumberString()
    tel: string;

    @IsNotEmpty()
    password: string;
}
