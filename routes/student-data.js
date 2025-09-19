async function getStudentData(username, password) {
    console.log(username)
    const corsProxyUrl = 'http://set.unza.zm:8088/';
    const targetUrl = 'https://sistest.unza.zm/Rest/authenticate.json';
    const url = `http://set.unza.zm/api/all/courses/sis`;
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'origin': 'http://localhost',
        'x-requested-with': 'XMLHttpRequest'
      },
      body: JSON.stringify({ username, password })
    });
  
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
  
    const data = await response.json();
    console.log('Received Data',data)
    
    return data;
  }

  module.exports = getStudentData;