const subjects = {
  basicHtml: {
    link: 'https://coconut-snow-88e.notion.site/HTML-200027be029e80cead9cf6b47e10cf35',
    title: 'HTML',
    subtitle: 'Aprenda o básico sobre HTML',
    classes: ['sW-oHVHUzq0', 'lWDUBJ_iAWI', 'Ek9Uwsm4kpE', '1oPkdZxVdwk', 'mb3sOON6W2o']
  },
  css: {
    link: 'https://coconut-snow-88e.notion.site/CSS-200027be029e806b9764c44af790a88e?pvs=25',
    title: 'CSS',
    subtitle: 'Aprenda o básico sobre CSS',
    classes: ['Sc6yKm3AFW0', 'VYLX2NtXPK4', 'dUm9BXLh98E', 'RHrbWo_Bjc0', 'MrXDpgWVOFk']
  },
  js: {
    link: 'https://coconut-snow-88e.notion.site/JavaScript-200027be029e805b8146f14b783a5622',
    title: 'JavaScript',
    subtitle: 'Aprenda o básico sobre JavaScript',
    classes: ['VaqSO1QyGDc', 'tNFsZB_ysp4', 'b1o2BvuFQLk', 'pUqbOu6d2e4', 'YMeBFGfM3d8', '8hmkOHmvSWA', 'SnO2r973Pb0', 'ww4w4GtxplA', 'KhNv4bYyLM4', 'Hrwy50ObWUM', 'cx6jqYYOX3Y']
  },
  jsDinamico: {
    link: 'https://coconut-snow-88e.notion.site/JavaScript-Din-mico-200027be029e80fc9d7cdd28e312fed5',
    title: 'JavaScript Dinâmico',
    subtitle: 'Aprenda o básico sobre JavaScript Dinâmico',
    classes: ['8lLH217_tI0', 'fEGnMBgRPWA', 'eVC9hYqgY0g', 'BFA-XsMZRxA', 'mOm2dADD5ms']
  }
}

const youtubeKey = 'AIzaSyC2_xwF9WrvMnmGPJSb_jz-_SmD_8pu1Qg';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const content = urlParams.get('content');

function getSubjectInfos() {
  const materialLink = document.querySelector('.button-bookwork');
  const containerTitle = document.querySelector('.container-title');

  console.log('content: ', content);
  console.log('subjects[content]: ', subjects[content]);
  materialLink.href = subjects[content].link;

  if (containerTitle) {
    containerTitle.innerHTML = `
      <h2 class="title">${subjects[content].title}</h2>
      <p class="subtitle">${subjects[content].subtitle}</p>
    `
  }
}

async function fetchYouTubeVideoDetails(videoId) {
  if (youtubeKey) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${youtubeKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        const snippet = video.snippet;
        const contentDetails = video.contentDetails;

        const title = snippet.title;
        const thumbnailUrl = snippet.thumbnails.high.url;

        const durationISO = contentDetails.duration;
        const durationFormatted = formatYouTubeDuration(durationISO);

        const details = {
          title,
          thumb: thumbnailUrl,
          duration: durationFormatted,
        };

        return details;

      } else {
        console.log(`Vídeo com ID "${videoId}" não encontrado ou informações indisponíveis.`)
      }
    } catch (error) {
      console.error('Falha ao buscar detalhes do vídeo:', error);
    }
  }
}

function formatYouTubeDuration(isoDuration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);

  if (!matches) {
    return "00:00";
  }

  const hours = parseInt(matches[1] || 0);
  const minutes = parseInt(matches[2] || 0);
  const seconds = parseInt(matches[3] || 0);

  let formattedTime = '';

  if (hours > 0) {
    formattedTime += `${hours.toString().padStart(2, '0')}:`;
  }

  formattedTime += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return formattedTime;
}

async function getVideos() {
  const container = document.querySelector('.container-videos');
  container.innerHTML = '';

  const videos = subjects[content].classes;

  if (!videos) {
    console.error(`Conteúdo "${content}" não encontrado no objeto 'classes'.`);
    container.innerHTML = `<p>Conteúdo não encontrado.</p>`;
    return;
  }

  for (const item of videos) {
    try {
      const data = await fetchYouTubeVideoDetails(item);

      if (data) {
        const videoElement = document.createElement('a');
        videoElement.classList.add('video');
        videoElement.href = `/detail.html?videoId=${item}&content=${content}`;

        videoElement.innerHTML = `
          <img class="image" alt="Thumb do vídeo ${data.title}" src="${data.thumb}">
          <div class="video-details">
            <p class="video-title">${data.title}</p>
            <span class="video-duration">${data.duration}</span>
          </div>
        `;
        container.appendChild(videoElement);
      } else {
        console.warn(`Não foi possível obter dados para o vídeo com ID: ${item.id}`);
      }
    } catch (error) {
      console.error(`Erro ao processar o vídeo com ID: ${item.id}`, error);
    }
  }
}

if (window.location.pathname === '/aulas.html') {
  getSubjectInfos();
  getVideos();
}

export default subjects;