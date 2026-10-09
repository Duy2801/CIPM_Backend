import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;
    constructor(
        private configService: ConfigService,
    ) { }
    onModuleInit() {
        this.client = new Redis({
            host: this.configService.get('REDIS_HOST'),
            port: Number(this.configService.get('REDIS_PORT')),
            password: this.configService.get('REDIS_PASSWORD'),
        })
    }

    onModuleDestroy() {
        this.client?.quit();
    }

    async get(key: string) {
        return this.client.get(key);
    }
    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds) {
            await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
            await this.client.set(key, value);
        }
    }
    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

}
