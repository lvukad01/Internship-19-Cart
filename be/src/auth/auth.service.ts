import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'generated/prisma';

@Injectable()
export class AuthService {
    constructor(    
        private prisma: PrismaService,
        private jwtService: JwtService,
    ){}


    async register(data: RegisterDto){
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        const hashedPassword=await bcrypt.hash(data.password,10)
        
        return this.prisma.user.create({
            data:{
                email: data.email,
                password: hashedPassword,
                role: Role.USER,
                name: data.name,
            },
        })
    }

    async login(data: LoginDto){
        const user = await this.prisma.user.findUnique({
            where: {email: data.email}
        });

        if (!user) throw new UnauthorizedException('Wrong username or password');

        const isPasswordValid = await bcrypt.compare(data.password,user.password)
        if (!isPasswordValid) throw new UnauthorizedException('Wrong username or password')
    
        const payload = {sub: user.id, email: user.email, role: user.role};
        return{
            access_token: this.jwtService.sign(payload),
            userId: user.id,
        }
    }

}
