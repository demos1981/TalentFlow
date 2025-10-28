import { Candidate } from './candidateService';

export class ShareService {
  static generateShareData(candidate: Candidate, candidateId: string) {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('Share functionality is only available in browser environment');
    }

    const shareUrl = `${window.location.origin}/candidates/${candidateId}`;
    const candidateName = `${candidate.user?.firstName} ${candidate.user?.lastName}`;
    const shareText = `Check out this candidate profile: ${candidateName}`;
    
    return {
      url: shareUrl,
      text: shareText,
      title: `${candidateName} - Candidate Profile`,
      candidateName
    };
  }

  static getShareOptions(shareData: ReturnType<typeof ShareService.generateShareData>) {
    const shareOptions = [
      {
        name: 'Telegram',
        url: `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`,
        icon: '✈️'
      },
      {
        name: 'LinkedIn',
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
        icon: '💼'
      },
      {
        name: 'Copy Link',
        action: 'copy',
        icon: '📋'
      }
    ];

    // Add native share option if available
    if (navigator.share && typeof navigator.share === 'function') {
      shareOptions.unshift({
        name: 'More Options',
        action: 'native',
        icon: '📤'
      });
    }

    return shareOptions;
  }

  static showShareModal(
    shareData: ReturnType<typeof ShareService.generateShareData>,
    t: (key: any) => string
  ) {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new Error('Share modal is only available in browser environment');
    }

    const shareOptions = this.getShareOptions(shareData);

    // Create custom share modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;

    const shareBox = document.createElement('div');
    shareBox.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;

    shareBox.innerHTML = `
      <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">${t('shareProfile')}</h3>
      <div style="display: grid; gap: 12px;">
        ${shareOptions.map(option => `
          <button onclick="handleShareOption('${option.name}', '${option.url || ''}', '${option.action || ''}')" 
                  style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; width: 100%; text-align: left; transition: background-color 0.2s;">
            <span style="font-size: 20px;">${option.icon}</span>
            <span style="font-weight: 500;">${option.name}</span>
          </button>
        `).join('')}
      </div>
      <button onclick="closeShareModal()" 
              style="margin-top: 16px; padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">
        ${t('cancel')}
      </button>
    `;

    modal.appendChild(shareBox);
    document.body.appendChild(modal);

    // Add global functions
    (window as any).handleShareOption = async (name: string, url: string, action: string) => {
      if (action === 'copy') {
        try {
          await navigator.clipboard.writeText(shareData.url);
          alert(t('linkCopiedToClipboard'));
        } catch (error) {
          alert(t('shareError'));
        }
      } else if (action === 'native') {
        try {
          const nativeShareData = {
            title: shareData.title,
            text: shareData.text,
            url: shareData.url
          };
          await navigator.share(nativeShareData);
        } catch (error) {
          console.log('Native share cancelled or failed');
        }
      } else if (url) {
        window.open(url, '_blank', 'width=600,height=400');
      }
      (window as any).closeShareModal();
    };

    (window as any).closeShareModal = () => {
      document.body.removeChild(modal);
      delete (window as any).handleShareOption;
      delete (window as any).closeShareModal;
    };

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        (window as any).closeShareModal();
      }
    });
  }
}
