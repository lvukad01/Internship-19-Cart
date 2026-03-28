import { IsEmail, IsNotEmpty, Matches, maxLength, MaxLength, MinLength} from 'class-validator'

export class RegisterDto{
    @IsEmail({},{message: 'Please enter valid email format'})
    @MaxLength(50, { message: 'Email is too long (max 50 characters)' })
    email: string;

    @IsNotEmpty()
    @MinLength(6, {message: 'Password should have at least 6 characters'})
    password: string;

    @IsNotEmpty()
    @MaxLength(30, {message:'Name should have less than 30 characters'})
    @MinLength(2, {message: 'Name should have at least 2 characters'})
    @Matches(/^[a-zA-Z\s'-]+$/, { 
        each: true, 
        message: 'Invalid characters in name' 
    })
    name: string;
    
    
}