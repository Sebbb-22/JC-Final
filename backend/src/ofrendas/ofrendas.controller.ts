import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, UsuarioAutenticado } from '../common/decorators/current-user.decorator';
import { OfrendasService } from './ofrendas.service';
import { CreateOfrendaDto } from './dto/create-ofrenda.dto';

@Controller('ofrendas')
@UseGuards(JwtAuthGuard)
export class OfrendasController {
  constructor(private readonly ofrendasService: OfrendasService) {}

  @Post()
  registrar(@Body() dto: CreateOfrendaDto, @CurrentUser() usuario: UsuarioAutenticado) {
    return this.ofrendasService.registrar(dto, usuario);
  }
}
