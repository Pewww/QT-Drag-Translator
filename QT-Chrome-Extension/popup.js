(function init () {
  getSelectedText();
  translateEvent();
}());


// Get Selected Data
function getSelectedText () {
  const inputText = document.getElementById('get-selected-text-form');

  chrome.tabs.executeScript({
    code: 'window.getSelection().toString();'
  }, (selection) => {
    inputText.innerText = selection;
    chrome.storage.sync.set({
      textData: selection
    }, () => { 
      console.log('Saved Successfully!');
    })
  });
}

function translateEvent () {
  const translateBtn = document.querySelector('button');

  translateBtn.addEventListener('click', () => {
    getPapagoResult();
  });
}

function getPapagoResult () {
  let papagoResult = document.getElementById('papago-translated-form');

  // 번역할 텍스트 가져와서 적용
  chrome.storage.sync.get(val => {
    const query = val.textData.join('');
    axios.post('http://localhost:3000/api/translation', {
      text: query,
      language: 'en' // 임시 테스트용
    })
    .then(response => {
      console.log(response);
      papagoResult.innerText = response.data.translatedText;
    })
    .catch(err => {
      console.log(err);
    });
  });
}