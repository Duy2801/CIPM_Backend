import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";
import { CreateUserDto } from "./user.create.dto.js";
import { UserResponseDto } from "./userResponseDto.js";

describe("user profile DTOs", () => {
    it("accepts the director role and rejects an unknown role", async () => {
        const director = Object.assign(new CreateUserDto(), {
            email: "director@example.com",
            fullName: "Huynh Thai Hai",
            password: "password",
            roleCodes: ["DIRECTOR"],
        });
        const deprecatedType = Object.assign(new CreateUserDto(), {
            email: "admin@example.com",
            fullName: "Huynh Thai Hai",
            password: "password",
            roleCodes: ["SYSTEM_ADMIN"],
        });

        const [directorErrors, deprecatedTypeErrors] = await Promise.all([
            validate(director),
            validate(deprecatedType),
        ]);

        expect(directorErrors).toHaveLength(0);
        expect(deprecatedTypeErrors.map((error) => error.property)).toContain("roleCodes");
    });

    it("rejects malformed phone, citizen ID, and age when creating a user", async () => {
        const dto = Object.assign(new CreateUserDto(), {
            email: "user@example.com",
            fullName: "Nguyen Van A",
            password: "password",
            roleCodes: ["DIRECTOR"],
            phone: "not-a-phone",
            citizenId: "123",
            age: -1,
        });

        const errors = await validate(dto);

        expect(errors.map((error) => error.property)).toEqual(
            expect.arrayContaining(["phone", "citizenId", "age"]),
        );
    });

    it("exposes phone and age but not citizen ID in a user response", () => {
        const response = plainToInstance(
            UserResponseDto,
            {
                id: "7b1e4f11-66c2-4e5a-86dc-0104c9e4d20e",
                email: "user@example.com",
                fullName: "Nguyen Van A",
                phone: "0912345678",
                citizenId: "001234567890",
                age: 30,
            },
            { excludeExtraneousValues: true },
        );

        expect(response).toMatchObject({ phone: "0912345678", age: 30 });
        expect(response).not.toHaveProperty("citizenId");
    });
});
