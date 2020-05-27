import { Controller, All, Req, Res } from '@nestjs/common';
import { TusService } from './tus.service';
import { UppyService } from './uppy.service';

@Controller()
export class StorageController {

    constructor(
        private tusService: TusService,
        private uppyService: UppyService,
    ) { }

    @All('files')
    tus(@Req() req, @Res() res) {
        return this.tusService.handleTus(req, res);
    }

    @All('uppy-companion')
    companion(@Req() req, @Res() res) {
        return this.uppyService.handleCompanion(req, res);
    }
}
