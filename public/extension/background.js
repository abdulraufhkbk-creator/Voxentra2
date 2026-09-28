/**
 * Voxentra Background Service Worker (Manifest V3)
 */

chrome.runtime.onInstalled?.addListener(() => {
  console.log('[Voxentra Extension] Installed and initialized.');
  chrome.storage?.local.set({
    voxentraApiUrl: 'http://localhost:3000',
    privacyMode: 'strict',
  });
});
