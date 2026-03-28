import { IsEmail, IsNotEmpty} from 'class-validator'

export class LoginDto{
    @IsEmail({},{message: 'Please enter valid email format'})
    email: string;

    @IsNotEmpty({message: 'Enter password'})
    password: string;
}