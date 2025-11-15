import { PartialType } from '@nestjs/swagger';
import { CreateSubtypeDto } from './create-subtype.dto';

export class UpdateSubtypeDto extends PartialType(CreateSubtypeDto) {}
