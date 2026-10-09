import { Controller, Get } from "@nestjs/common";
import { HouseholdService } from "./household.service.js";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Household')
@Controller('household')
export class HouseholdController {
    constructor(private householdService: HouseholdService) { }

    @Get()
    getClearedHouseholds() {
        return this.householdService.countClearedHouseholds();
    }
}