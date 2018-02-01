import normalizeUrl from 'normalize-url';

const normalizeOpts = {
  stripFragment: false,
  stripWWW: false,
};

export default ({ body }) => {
  try {
    const url = JSON.parse(body).url;
    return url && url.length > 0 ? normalizeUrl(url, normalizeOpts) : null;
  } catch (_e) {
    return null;
  }
};
