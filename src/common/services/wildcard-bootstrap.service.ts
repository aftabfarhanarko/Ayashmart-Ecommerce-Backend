import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { WildcardDomainService } from './wildcard-domain.service';

/**
 * Runs wildcard DNS setup on application startup (non-blocking).
 * Set WILDCARD_AUTO_SETUP=true to enable.
 */
@Injectable()
export class WildcardBootstrapService implements OnApplicationBootstrap {
  constructor(private readonly wildcardDomainService: WildcardDomainService) {}

  onApplicationBootstrap() {
    const autoSetup = process.env.WILDCARD_AUTO_SETUP === 'true';
    if (!autoSetup) return;

    if (!this.wildcardDomainService.isConfigured()) {
      return;
    }

    this.wildcardDomainService
      .setupWildcard()
      .then((r) => {
        if (r.success) {
          console.log('✅ Wildcard DNS setup completed on startup');
        } else {
          console.warn('⚠️ Wildcard DNS setup had issues:', r.errors);
        }
      })
      .catch((err) => console.error('Wildcard startup setup error:', err?.message));
  }
}
