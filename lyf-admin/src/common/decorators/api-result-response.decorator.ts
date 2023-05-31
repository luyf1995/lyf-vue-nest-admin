import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseResultDto } from 'src/common/dto/result-response.dto';
import { PaginatedDto } from '../dto/paginated.dto';

const baseTypeNames = ['String', 'Number', 'Boolean'];
/**
 * swagger 封装响应的统一格式
 * @param {TModel} model
 * @param {Boolean} isArray 是否是数组
 * @param {Boolean} isPage 是否是分页
 */
export const ApiResultResponse = <TModel extends Type<any>>(
  model?: TModel,
  { isArray = false, isPage = false } = {}
) => {
  const applyDecoratorArr = [ApiExtraModels(ResponseResultDto)];
  let data: Record<string, any>;

  if (model !== undefined) {
    if (isPage) {
      // 分页
      applyDecoratorArr.push(ApiExtraModels(PaginatedDto));
      data = {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              list: {
                type: 'array',
                items: { $ref: getSchemaPath(model) }
              }
            }
          }
        ]
      };
    } else if (baseTypeNames.includes(model?.name)) {
      if (isArray) {
        data = {
          type: 'array',
          items: {
            type: model.name.toLocaleLowerCase()
          }
        };
      } else {
        data = {
          type: model.name.toLocaleLowerCase()
        };
      }
    } else {
      applyDecoratorArr.push(ApiExtraModels(model));

      if (isArray) {
        data = {
          type: 'array',
          items: {
            $ref: getSchemaPath(model)
          }
        };
      } else {
        data = {
          $ref: getSchemaPath(model)
        };
      }
    }
  }

  applyDecoratorArr.push(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseResultDto) },
          {
            properties: {
              data
            }
          }
        ]
      }
    })
  );

  return applyDecorators(...applyDecoratorArr);
};
