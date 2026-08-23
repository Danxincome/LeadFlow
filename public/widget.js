(function () {
  'use strict';

  var businessId = window.LEADFLOW_BUSINESS_ID;

  if (!businessId) {
    console.error('LeadFlow AI: LEADFLOW_BUSINESS_ID is missing.');
    return;
  }

  var script = document.currentScript;
  var apiBase = script && script.src
    ? new URL(script.src).origin
    : window.location.origin;

  var conversationId = null;
  var messages = [];
  var greetingText = null;
  var greetingShown = false;

  var style = document.createElement('style');
  style.textContent = `
    #leadflow-widget-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 58px;
      height: 58px;
      border: none;
      border-radius: 50%;
      background: #2563eb;
      color: white;
      font-size: 25px;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(0,0,0,.25);
      z-index: 999999;
    }

    #leadflow-widget-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 500px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,.25);
      overflow: hidden;
      display: none;
      flex-direction: column;
      z-index: 999999;
      font-family: Arial, sans-serif;
    }

    #leadflow-widget-header {
      background: #2563eb;
      color: white;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    #leadflow-widget-header-title {
      font-weight: 600;
    }

    #leadflow-widget-close {
      background: transparent;
      border: none;
      color: white;
      font-size: 22px;
      cursor: pointer;
    }

    #leadflow-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      background: #f8fafc;
    }

    .leadflow-message {
      margin-bottom: 10px;
      padding: 10px 13px;
      border-radius: 14px;
      max-width: 80%;
      font-size: 14px;
      line-height: 1.4;
      white-space: pre-wrap;
    }

    .leadflow-user {
      background: #2563eb;
      color: white;
      margin-left: auto;
    }

    .leadflow-assistant {
      background: white;
      color: #111827;
      border: 1px solid #e5e7eb;
    }

    #leadflow-widget-form {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      background: white;
    }

    #leadflow-widget-input {
      flex: 1;
      min-width: 0;
      padding: 11px;
      border: 1px solid #d1d5db;
      border-radius: 10px;
      outline: none;
      font-size: 14px;
    }

    #leadflow-widget-send {
      width: 44px;
      border: none;
      border-radius: 10px;
      background: #2563eb;
      color: white;
      cursor: pointer;
    }

    #leadflow-widget-send:disabled {
      opacity: .5;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);

  var button = document.createElement('button');
  button.id = 'leadflow-widget-button';
  button.innerHTML = '💬';
  button.setAttribute('aria-label', 'Open chat');

  var chat = document.createElement('div');
  chat.id = 'leadflow-widget-window';

  chat.innerHTML = `
    <div id="leadflow-widget-header">
      <div id="leadflow-widget-header-title">AI Assistant</div>
      <button id="leadflow-widget-close" aria-label="Close chat">×</button>
    </div>

    <div id="leadflow-widget-messages"></div>

    <form id="leadflow-widget-form">
      <input
        id="leadflow-widget-input"
        type="text"
        placeholder="Type a message..."
        autocomplete="off"
      />
      <button id="leadflow-widget-send" type="submit">➤</button>
    </form>
  `;

  document.body.appendChild(button);
  document.body.appendChild(chat);

  var messagesContainer = document.getElementById('leadflow-widget-messages');
  var input = document.getElementById('leadflow-widget-input');
  var form = document.getElementById('leadflow-widget-form');
  var sendButton = document.getElementById('leadflow-widget-send');

  function addMessage(role, content) {
    messages.push({ role: role, content: content });

    var message = document.createElement('div');
    message.className =
      'leadflow-message ' +
      (role === 'user' ? 'leadflow-user' : 'leadflow-assistant');

    message.textContent = content;

    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showGreeting() {
    if (greetingShown) {
      return;
    }
    greetingShown = true;
    addMessage('assistant', greetingText || 'Hi there! How can I help you today?');
  }

  button.addEventListener('click', function () {
    var isOpen = chat.style.display === 'flex';
    chat.style.display = isOpen ? 'none' : 'flex';

    if (!isOpen) {
      showGreeting();
      input.focus();
    }
  });

  document.getElementById('leadflow-widget-close').addEventListener('click', function () {
    chat.style.display = 'none';
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    var text = input.value.trim();

    if (!text || sendButton.disabled) {
      return;
    }

    addMessage('user', text);

    input.value = '';
    sendButton.disabled = true;

    try {
      var response = await fetch(apiBase + '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessId: businessId,
          conversationId: conversationId,
          message: text
        })
      });

      var data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chat request failed');
      }

      if (data.conversationId) {
        conversationId = data.conversationId;
      }

      addMessage(
        'assistant',
        data.message || 'Sorry, I could not process that message.'
      );
    } catch (error) {
      console.error('LeadFlow AI error:', error);

      var content = error && error.message === 'Business not found'
        ? 'This chat isn’t set up correctly yet. Please contact the business directly.'
        : 'I’m having trouble connecting right now. Please try again in a moment.';

      addMessage('assistant', content);
    } finally {
      sendButton.disabled = false;
      input.focus();
    }
  });

  fetch(apiBase + '/api/chat?businessId=' + encodeURIComponent(businessId))
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Business not found');
      }
      return response.json();
    })
    .then(function (data) {
      greetingText = data.greeting || null;
    })
    .catch(function (error) {
      console.error('LeadFlow AI: failed to load chat configuration.', error);
    });
})();
