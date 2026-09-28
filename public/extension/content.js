/**
 * Voxentra Social Intelligence - Content Script (Manifest V3)
 * Principles:
 * - Only analyzes current active public post when user triggers it.
 * - Never scrapes cookies, passwords, private chats, or browsing history.
 */

function detectPlatform() {
  const host = window.location.hostname;
  if (host.includes('instagram.com')) return 'instagram';
  if (host.includes('x.com') || host.includes('twitter.com')) return 'x';
  if (host.includes('telegram.org')) return 'telegram';
  if (host.includes('reddit.com')) return 'reddit';
  if (host.includes('youtube.com')) return 'youtube';
  if (host.includes('facebook.com')) return 'facebook';
  return 'unknown';
}

function extractPublicPostContext() {
  const platform = detectPlatform();
  const url = window.location.href;
  let text = '';

  if (platform === 'x') {
    const tweetEl = document.querySelector('article [data-testid="tweetText"]');
    if (tweetEl) text = tweetEl.innerText;
  } else if (platform === 'reddit') {
    const titleEl = document.querySelector('h1');
    const bodyEl = document.querySelector('[data-click-id="text"]');
    text = (titleEl?.innerText || '') + '\n' + (bodyEl?.innerText || '');
  } else if (platform === 'youtube') {
    const titleEl = document.querySelector('h1.ytd-watch-metadata');
    text = titleEl?.innerText || '';
  } else {
    // Fallback: look for meta description or title
    const metaDesc = document.querySelector('meta[property="og:description"]');
    text = metaDesc?.getAttribute('content') || document.title;
  }

  return {
    platform,
    url,
    text: text.slice(0, 1000),
    timestamp: new Date().toISOString()
  };
}

// Listen for messages from popup or background worker
chrome.runtime.onMessage?.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_ACTIVE_POST_CONTEXT') {
    const context = extractPublicPostContext();
    sendResponse({ success: true, context });
  }
  return true;
});
