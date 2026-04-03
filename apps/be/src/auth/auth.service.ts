import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async register(data: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: Role.USER,
                name: data.name,
                phone: data.phone,
                address: data.address,
            },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(data: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        const { password, ...userWithoutPassword } = user;

        return {
            token: this.jwtService.sign(payload),
            user: userWithoutPassword,
        };
    }
}