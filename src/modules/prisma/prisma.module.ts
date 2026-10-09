import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prima.service.js";
@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService]
})
export class PrismaModule { }
