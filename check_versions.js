import https from 'https';
https.get('https://registry.npmjs.org/@splinetool/react-spline', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(JSON.parse(body)['dist-tags']));
});
https.get('https://registry.npmjs.org/@splinetool/runtime', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(JSON.parse(body)['dist-tags']));
});
