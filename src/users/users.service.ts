import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private db = admin.firestore();
  private usersCollection = this.db.collection('users');

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, phone } = createUserDto;

    const existingUser = await this.usersCollection.where('email', '==', email).limit(1).get();
    if (!existingUser.empty) {
      throw new ConflictException('User with this email or phone already exists');
    }

    const userRef = this.usersCollection.doc();
    const newUser: User = {
      id: userRef.id,
      name,
      email,
      phone,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await userRef.set(newUser);
    return newUser;
  }

  async getUsers(limit = 10, cursor?: string): Promise<User[]> {
    let query = this.usersCollection.orderBy('createdAt').limit(limit);

    if (cursor) {
      const snapshot = await this.usersCollection.doc(cursor).get();
      if (!snapshot.exists) throw new NotFoundException('Cursor not found');
      query = query.startAfter(snapshot);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as User);
  }

  async getUserById(id: string): Promise<User> {
    const userDoc = await this.usersCollection.doc(id).get();
    if (!userDoc.exists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return userDoc.data() as User;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userRef = this.usersCollection.doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedData = {
      ...updateUserDto,
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await userRef.update(updatedData);
    return { ...(userDoc.data() as User), ...updatedData };
  }
}