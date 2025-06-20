import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.todo.findMany();
  }

  create(data: { text: string }) {
    return this.prisma.todo.create({ data });
  }

  update(
    id: number,
    data: Partial<{
      text: string;
      completed: boolean;
      due_date: string;
      notes: string;
    }>,
  ) {
    return this.prisma.todo.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
