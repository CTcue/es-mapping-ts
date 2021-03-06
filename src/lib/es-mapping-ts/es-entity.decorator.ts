import { EsMappingService } from './es-mapping.service';

/**
 * Argument for an elasticsearch index
 */
export class EsEntityArgs {
  /** Name of the index */
  index: string;
  /** Type of the index */
  type?: string;
  /** create mapping or not **/
  readonly?: boolean;
}

/**
 * @EsEntity decorator : registrer the entity in the mapping through the EsMappingService
 * @param args decorator annotation
 */
export function EsEntity(args?: EsEntityArgs): ClassDecorator {
  return function (target: any) {
    if (args && !args.type) {
      args.type = args.index;
    }
    EsMappingService.getInstance().addEntity(args, target);
  };
}
