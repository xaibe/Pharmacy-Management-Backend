import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    username: string;
    dateOfBirth: Date;
    emailAddress: string;
    password: string;
    roles: Role;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { emailAddress: email },
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // Alias for findByEmail to match auth service expectations
  async getByEmail(email: string): Promise<User | null> {
    return this.findByEmail(email);
  }

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<User | null> {
    // Trim and normalize inputs
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    
    const user = await this.findByEmail(normalizedEmail);
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(normalizedPassword, user.password);
    if (!isPasswordValid) {
      return null;
    }
    
    return user;
  }

  // Verify email for user
  async verifyEmail(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { emailVerifiedAt: new Date() },
    });
  }

  // Activate user (set emailVerifiedAt)
  async activate(id: number): Promise<User> {
    return this.verifyEmail(id);
  }
} 