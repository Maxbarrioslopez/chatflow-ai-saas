import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

  const script = `
(function() {
  var token = false;
  var position = 'right';
  var theme = 'light';

  window.chatmbl = function(config) {
    token = config.token || token;
    position = config.position || position;
    theme = config.theme || theme;
    initWidget();
  };

  function initWidget() {
    if (!token) return;

    var existing = document.getElementById('chatmbl-widget');
    if (existing) return;

    var iframe = document.createElement('iframe');
    iframe.id = 'chatmbl-widget';
    iframe.src = '${baseUrl.replace('/api', '')}/widget/' + token + '?position=' + position + '&theme=' + theme;
    iframe.style.cssText = 'position:fixed;bottom:20px;' + position + ':20px;width:400px;height:600px;border:none;z-index:999999;max-width:100vw;max-height:100vh;';
    iframe.title = 'ChatMBL Assistant';
    document.body.appendChild(iframe);
  }

  if (document.readyState === 'complete') {
    if (window.chatmbl && window.chatmbl !== arguments.callee) initWidget();
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      if (window.chatmbl && window.chatmbl.q) {
        var cmds = window.chatmbl.q;
        for (var i = 0; i < cmds.length; i++) {
          if (typeof cmds[i] === 'object') {
            window.chatmbl(cmds[i]);
          }
        }
      }
    });
  }
})();
`;
  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
