import { useEffect } from 'react';
import { CLOAK_PRESETS } from '../data/workbookData';
import { StealthSettings } from '../types/workspace';

export function useTabCloak(settings: StealthSettings) {
  useEffect(() => {
    const preset = CLOAK_PRESETS.find((p) => p.id === settings.cloakPreset) ?? CLOAK_PRESETS[0];
    const nextTitle =
      settings.cloakPreset === 'custom' && settings.customTitle.trim()
        ? settings.customTitle.trim()
        : preset.title;

    document.title = nextTitle;

    const encodedSvg = encodeURIComponent(preset.faviconSvg);
    const dataUrl = `data:image/svg+xml,${encodedSvg}`;

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = dataUrl;
  }, [settings.cloakPreset, settings.customTitle]);
}
