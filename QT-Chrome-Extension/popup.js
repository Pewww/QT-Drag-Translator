(function init () {
  getSelectedText();
  translateEvent();
  copyResult();
}());


// 크롬 스토리지에 저장
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

// 번역할 텍스트 언어 설정
function selectLanguage () {
  const e = document.getElementById('language-list');
  const langVal = e.options[e.selectedIndex].value;

  return langVal;
}

// 클릭시 결과 가져옴
function translateEvent () {
  const translateBtn = document.querySelector('button');

  translateBtn.addEventListener('click', () => {
    getPapagoResult();
  });
}

// API 정보 요청 후 실제 적용
function getPapagoResult () {
  let papagoResult = document.getElementById('papago-translated-form');

  // 번역할 텍스트 가져와서 적용
  chrome.storage.sync.get(val => {
    const query = val.textData.join('');
    axios.post('http://localhost:3000/api/translation', {
      text: query,
      language: selectLanguage()
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

// 클릭 시 번역 결과 복사
function copyResult () {
  const copyBtn = document.querySelector('.copy-result');
  copyBtn.addEventListener('click', () => {
    copyText();
  });
}

function copyText () {
  const papagoResult = document.getElementById('papago-translated-form');
  const success = document.querySelector('.success-copy-text');

  if (papagoResult.value !== '') {
    papagoResult.select();
    document.execCommand('copy');
    // 텍스트 애니메이션 추가
    success.classList.remove('success-animation');
    setTimeout(() => success.classList.add('success-animation'), 0);
  }
}
