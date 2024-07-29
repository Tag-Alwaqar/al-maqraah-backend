import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { PageOptionsDto } from './dtos/page-option.dto';
import { PageMetaDto } from './dtos/page-meta.dto';
import { PageDto } from './dtos/page.dto';
import { mapEntityToDto } from './mappers';

@Injectable()
export class PaginationService {
  async paginateWithoutMapping<Entity>({
    query,
    pageOptionsDto,
  }: {
    pageOptionsDto: PageOptionsDto;
    query: SelectQueryBuilder<Entity>;
  }) {
    query.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
    const [entities, itemCount] = await query.getManyAndCount();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async paginate<Entity, EntityDto>({
    pageOptionsDto,
    query,
    dtoClass,
    mapToDto,
  }: {
    pageOptionsDto: PageOptionsDto;
    query: SelectQueryBuilder<Entity>;
    dtoClass?: new () => EntityDto;
    mapToDto?: (entities: Entity[]) => Promise<EntityDto[]>;
  }) {
    query.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    console.time('query');
    const [entities, itemCount] = await query.getManyAndCount();
    console.timeEnd('query');

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    let mappedEntities: EntityDto[];
    if (mapToDto) {
      mappedEntities = await mapToDto(entities);
    } else {
      mappedEntities = entities.map((entity) =>
        mapEntityToDto(entity, dtoClass),
      );
    }
    return new PageDto(mappedEntities, pageMetaDto);
  }
}
