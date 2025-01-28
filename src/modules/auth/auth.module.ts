import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';

@Module({
	imports: [],
	providers: [LocalStrategy],
})
export class AuthModule {}
