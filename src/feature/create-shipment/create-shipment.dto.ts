import { IsArray, IsEnum, IsInt, ValidateNested, IsNotEmpty, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { StopType } from 'src/domain/shipment/enums/stop-type';

class StopDto {
  @IsInt()
  @IsNotEmpty()
  sequence: number;

  @IsEnum(StopType)
  @IsNotEmpty()
  type: StopType;
}

export class CreateShipmentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StopDto)
  @ArrayMinSize(1, { message: 'At least one stop is required' })
  @IsNotEmpty()
  stops: StopDto[];
}
