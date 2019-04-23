import w from '../index';

interface Yeetus
{
    yes: boolean;
}

(async() => {
    const res = await w('https://myurl.org', { method: 'GET' }).send();
    const res1 = await w('https://myurl.org', { method: 'GET', chaining: false });
    
    const d = res.json<Yeetus>();
    const d1 = res.json();
})();
