import { OnApplicationBootstrap } from '@nestjs/common';
import { WildcardDomainService } from './wildcard-domain.service';
export declare class WildcardBootstrapService implements OnApplicationBootstrap {
    private readonly wildcardDomainService;
    constructor(wildcardDomainService: WildcardDomainService);
    onApplicationBootstrap(): void;
}
