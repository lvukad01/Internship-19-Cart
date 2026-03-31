import { IsEmail, IsNotEmpty, MaxLength} from 'class-validator'

export class LoginDto{
    @IsEmail({},{message: 'Please enter valid email format'})
    email: string;

    @IsNotEmpty({message: 'Enter password'})
    @MaxLength(30, {message:'Name should have less than 30 characters'})
    password: string;
}