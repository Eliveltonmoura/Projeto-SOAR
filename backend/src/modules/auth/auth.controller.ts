import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CriarProfessorDto } from './dto/criar-professor.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { PapelUsuario } from './usuario.entity';
import { CurrentUsuario } from './current-usuario.decorator';
import { UsuarioAutenticado } from './jwt.strategy';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login — retorna o token JWT do usuário' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dados do usuário autenticado' })
  me(@CurrentUsuario() usuario: UsuarioAutenticado) {
    return this.authService.me(usuario.id);
  }

  @Get('professores')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PapelUsuario.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista as contas de professor' })
  listarProfessores() {
    return this.authService.listarProfessores();
  }

  @Post('professores')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PapelUsuario.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria uma conta de acesso para um professor' })
  criarProfessor(@Body() dto: CriarProfessorDto) {
    return this.authService.criarProfessor(dto);
  }
}
