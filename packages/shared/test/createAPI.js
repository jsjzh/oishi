const { CreateAPI } = require('../lib');

const api = new CreateAPI('https://extension-ms.juejin.im', {
  handleResp: (data) => data.data,
});

(async () => {
  // const getJSONResult = await api.getJSON('/resources/gold');
  // console.log('getJSONResult', getJSONResult);
  const postJSONResult = await api.postJSON('/resources/gold', {
    category: 'frontend',
    limit: 36,
    offset: 0,
    order: 'heat',
  });
  console.log('postJSONResult', postJSONResult);
  // const postFormResult = await api.postForm('/resources/gold');
  // console.log('postFormResult', postFormResult);
  // const putJSONResult = await api.putJSON('/resources/gold');
  // console.log('putJSONResult', putJSONResult);
  // const patchJSONResult = await api.patchJSON('/resources/gold');
  // console.log('patchJSONResult', patchJSONResult);
  // const deleteJSONResult = await api.deleteJSON('/resources/gold');
  // console.log('deleteJSONResult', deleteJSONResult);
  // const jsonpResult = await api.jsonp('/resources/gold');
  // console.log('jsonpResult', jsonpResult);
  // const requestResult = await api.request('/resources/gold');
  // console.log('requestResult', requestResult);
})();
