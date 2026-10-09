import { ConfigService } from "@nestjs/config";
import { describe, expect, it } from "vitest";
import { RedisService } from "./redis.service.js";

describe("RedisService", () => {
    it("closes safely before its client has been initialized", () => {
        const service = new RedisService({} as ConfigService);

        expect(() => service.onModuleDestroy()).not.toThrow();
    });
});
