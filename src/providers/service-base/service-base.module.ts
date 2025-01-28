import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Agent } from 'https';
import { HttpBaseService } from './http-base.service';
import { BaseService } from './base.service';

@Module({
	imports: [
		ConfigModule,
		HttpModule.register({
			httpsAgent: new Agent({ rejectUnauthorized: false }),
		}),
	],
	providers: [HttpBaseService, BaseService],
	exports: [HttpBaseService],
})
export class ServiceBaseModule {}
