import { instanceToPlain, plainToClass } from 'class-transformer';

export function mapEntityToDto<Entity, Dto>(
  entity: Entity,
  dtoClass: new () => Dto,
) {
  const plain = instanceToPlain(entity);
  return plainToClass(dtoClass, plain, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
