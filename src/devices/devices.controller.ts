import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { CreateDeviceLocationEntryDto } from './dto/create-device-location-entry.dto';

// import influxdb
import { InfluxDB, Point } from '@influxdata/influxdb-client';

// You can generate an API token from the "API Tokens Tab" in the UI
const token =
  'Dg8v_kFW7ER_saI4wupvxpi_Aba1wANZND5K9DSBKXlAcUr_ODI9RaN7Hy9875HFBXIzK6574yM2vsxfQgNwXA==';
const org = 'DIU';
const bucket = 'Transport';

const client = new InfluxDB({
  url: 'http://ssh.bahon.info:8086',
  token: token,
});

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Post('location')
  createLocationEntry(
    @Body() createDeviceLocationEntryDto: CreateDeviceLocationEntryDto,
  ) {
    //return this.devicesService.create(createDeviceLocationEntryDto);
    console.log(createDeviceLocationEntryDto);

    const writeApi = client.getWriteApi(org, bucket);
    writeApi.useDefaultTags({ host: 'host1' });

    const point = new Point('mem').floatField('used_percent', 23.43234543);
    writeApi.writePoint(point);

    writeApi
      .close()
      .then(() => {
        console.log('FINISHED');
      })
      .catch((e) => {
        console.error(e);
        console.log('Finished ERROR');
      });
    return 'location entry created';
  }

  @Get()
  findAll() {
    return this.devicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.devicesService.update(+id, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devicesService.remove(+id);
  }
}
