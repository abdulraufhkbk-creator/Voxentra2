document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('page-status');
  const snippetEl = document.getElementById('post-snippet');
  const btn = document.getElementById('analyze-btn');
  const btnText = document.getElementById('btn-text');
  const resultSec = document.getElementById('result-section');
  const riskPill = document.getElementById('risk-pill');
  const summaryEl = document.getElementById('summary-text');
  const openFullLink = document.getElementById('open-full-link');

  let currentContext = {
    platform: 'instagram',
    url: 'https://instagram.com/p/sample',
    text: 'Viral claim observed on active page...'
  };

  // Attempt to query active tab if running inside real Chrome extension
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'GET_ACTIVE_POST_CONTEXT' }, (res) => {
          if (res?.context) {
            currentContext = res.context;
            statusEl.textContent = `Platform: ${currentContext.platform.toUpperCase()}`;
            snippetEl.textContent = `"${currentContext.text.slice(0, 100)}..."`;
          }
        });
      }
    } catch (e) {
      statusEl.textContent = 'Standby mode';
    }
  } else {
    statusEl.textContent = 'Simulator active';
    snippetEl.textContent = 'Simulated social feed post ready for extraction';
  }

  btn.addEventListener('click', async () => {
    btnText.textContent = 'Analyzing...';
    btn.disabled = true;

    try {
      const apiUrl = 'http://localhost:3000/api/analyze/content';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: currentContext.platform,
          text: currentContext.text,
          url: currentContext.url
        })
      });

      const data = await response.json();
      resultSec.style.display = 'block';
      riskPill.className = `risk-badge risk-${data.risk.risk_level}`;
      riskPill.textContent = `RISK: ${data.risk.risk_level}`;
      summaryEl.textContent = data.answers.what_is_happening;
      openFullLink.href = `http://localhost:3000?analysisId=${data.id}`;
      btnText.textContent = 'Re-Analyze';
    } catch (err) {
      resultSec.style.display = 'block';
      riskPill.className = 'risk-badge risk-CAUTION';
      riskPill.textContent = 'SERVER STANDBY';
      summaryEl.textContent = 'Connected in offline simulation mode. Open main Voxentra app to view full intelligence.';
      openFullLink.href = 'http://localhost:3000';
      btnText.textContent = 'Analyze This';
    } finally {
      btn.disabled = false;
    }
  });
});
