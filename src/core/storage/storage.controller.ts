import { Controller, All, Req, Res } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller()
export class StorageController {

    constructor(private storageService: StorageService) { }

    @All('files')
    tus(@Req() req, @Res() res) {
        return this.storageService.handleTus(req, res);
    }
}
