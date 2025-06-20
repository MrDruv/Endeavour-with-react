import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Post()
  create(@Body() body: { text: string }) {
    return this.todoService.create({ text: body.text });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateData: {
      text?: string;
      completed?: boolean;
      due_date?: string;
      notes?: string;
    },
  ) {
    return this.todoService.update(Number(id), updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.todoService.delete(Number(id));
  }
}
