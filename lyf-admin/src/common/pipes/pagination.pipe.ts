import { Injectable, PipeTransform } from '@nestjs/common';
import { PaginationDto } from '../dtos/pagination.dto';

/**
 * 分页器管道
 */
@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: PaginationDto) {
    const take = value.pageSize ?? 0;
    const skip = value.pageNum ? (value.pageNum - 1) * take : 0;

    value.take = take;
    value.skip = skip;
    return value;
  }
}
