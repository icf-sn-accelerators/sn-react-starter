export async function client(endpoint, { body, ...customConfig } = {}) {
  let auth = {};
  if (process.env.NODE_ENV === 'development') {
    const credentials = `${process.env.SERVICENOW_USERNAME}:${process.env.SERVICENOW_PASSWORD}`;
    auth = {
      Authorization: `Basic ${window.btoa(credentials)}`,
    };
  } else {
    auth = { 'X-UserToken': window.serviceNowUserToken || window.g_ck };
  }

  const headers = {
    'Content-Type': 'application/json',
    ...auth,
  };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await window.fetch(endpoint, config);
  if (response.status === 401) {
    window.location.assign(window.location);
    return;
  }

  if (response.ok) {
    return response.json();
  }

  const { result } = await response.json();
  throw new Response(JSON.stringify(result), {
    status: response.status || 500,
    statusText: response.statusText || 'Unknown Error',
  });
}
