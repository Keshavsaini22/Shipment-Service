import { MapperRegistry } from "http-problem-details-mapper"

export class MappingStrategy {
    private registry: MapperRegistry
    constructor(registry: MapperRegistry) {
        this.registry = registry
    }

    map(error: Error) {
        const errorMapper = this.registry.getMapper(error)
        if (errorMapper) {
            return errorMapper.mapError(error)
        }
        else {
            return {
                status: 500,
                title: 'Internal Server Error',
                detail: error.message
            }
        }
    }
}