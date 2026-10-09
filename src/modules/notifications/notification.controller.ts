import { Controller, Get } from "@nestjs/common";
import { NotificationService } from "./notification.service.js";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) { }

    @Get()
    getDelayedProjects() {
        return this.notificationService.countDelayedProjects()
    }
}