import { Controller, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const accessToken = await this.authService.login(req.user);
    res.cookie('accessToken', accessToken, { httpOnly: true });
    return res.send({ message: 'Logged in' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Response() res) {
    res.clearCookie('accessToken');
    return res.send({ message: 'Logged out' });
  }
}
