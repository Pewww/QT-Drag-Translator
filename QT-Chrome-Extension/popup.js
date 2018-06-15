(function init () {
  getSelectedText();
  translateEvent();
  copyResult();
  textToSpeech();
}());


// 크롬 스토리지에 저장
function getSelectedText () {
  const inputText = document.getElementById('get-selected-text-form');

  chrome.tabs.executeScript({
    code: 'window.getSelection().toString();'
  }, (selection) => {
    inputText.value = selection;
    console.log(`드래그한 텍스트: ${selection}`);
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
  let inputText = document.getElementById('get-selected-text-form');

  // 번역할 텍스트 가져와서 적용
  const query = inputText.value;
  axios.post('http://localhost:3000/api/translation', {
    text: query,
    language: selectLanguage()
  })
  .then(response => {
    papagoResult.value = response.data.translatedText;
    // 변환할 언어 저장
    chrome.storage.sync.set({
      resultLang: selectLanguage()
    });
  })
  .catch(err => {
    console.log(err);
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

// 클릭 시 텍스트를 음성으로 변환
function textToSpeech () {
  const speechBtn = document.querySelector('.result-speech');
  speechBtn.addEventListener('click', () => {
    speech();
  });
}

function speech () {
  function changeLanguage (val) {
    let langVal = '';

    switch (val.resultLang) {
      case 'ko':
        langVal = 'ko-kr';
        break;
      case 'en':
        langVal = 'en-us';
        break;
      case 'zh-CN':
      case 'zh-TW':
        langVal = 'zh-cn';
        break;
      case 'es':
        langVal = 'es-es';
        break;
      case 'fr':
        langVal = 'fr-fr';
        break;
      case 'th':
        langVal = 'zh-tw';
        break;
      case 'id':
        langVal = 'en-in';
        break;
      default: break;
    }

    return langVal;
  }
  const papagoResult = document.getElementById('papago-translated-form');

  chrome.storage.sync.get(val => {
    VoiceRSS.speech({
      key: 'ce16b05fac694b14b2221b9ccb687746',
      src: papagoResult.value, //나는 형식만 맞춰주면 됨
      hl: changeLanguage(val),
      r: 0,
      c: 'mp3',
      f: '44khz_16bit_stereo',
      ssml: false
    });
  });
}
