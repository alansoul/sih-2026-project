// apps/api/src/app/app.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService, ScreeningRequest } from './app.service';

@ApiTags('SSB Border Screening')
@Controller('screening')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Checkpoint API Health Check' })
  getHealth() {
    return { status: 'ONLINE', station: 'Raxaul Border Post #04', timestamp: new Date() };
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Execute 4-Stage AI Document Forensics & Verification' })
  @ApiResponse({ status: 200, description: 'Screening report generated successfully.' })
  async analyzeDocument(@Body() body: ScreeningRequest) {
    return this.appService.analyzeDocument(body);
  }
}