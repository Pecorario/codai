let player;

import subjectsFromFile from './aulas.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const content = urlParams.get('content');
const currentVideoId = urlParams.get('videoId');

function loadYouTubePlayer(videoId) {
  if (player) {
    player.destroy();
  }
  player = new YT.Player('container-player', {
    height: '100%',
    width: '100%',
    videoId: videoId,
    playerVars: {
      'playsinline': 1,
      'autoplay': 1,
    },
    events: {
      'onReady': onPlayerReady,
      'onError': onPlayerError,
    },
  });
}

window.onYouTubeIframeAPIReady = function () {
  if (currentVideoId) {
    loadYouTubePlayer(currentVideoId);
  } else {
    console.error("Nenhum videoId encontrado na URL para carregar o player.");
    const playerContainer = document.getElementById('container-player');
    if (playerContainer) {
      playerContainer.innerHTML = "<p>Erro: ID do vídeo não especificado na URL.</p>";
    }
  }
};

function onPlayerReady(event) {
  console.log("Player pronto!");
  event.target.playVideo();
}

function onPlayerError(event) {
  console.error('Erro no player do YouTube:', event.data);
  const playerContainer = document.getElementById('container-player');
  if (playerContainer) {
    playerContainer.innerHTML = `<p style="color:red;">Ocorreu um erro ao carregar o vídeo (código: ${event.data}). Verifique se o ID é válido e o vídeo permite incorporação.</p>`;
  }
}

function handleNavigation(direction) {
  if (!content || !subjectsFromFile[content] || !subjectsFromFile[content].classes) {
    console.error("Conteúdo ou lista de classes não encontrado para:", content);
    return;
  }

  const videoList = subjectsFromFile[content].classes;
  const currentIndex = videoList.findIndex(videoObj => videoObj === currentVideoId);

  if (direction === 'previous' && currentIndex > 0) {
    const previousVideoId = videoList[currentIndex - 1];
    window.location.href = `/detail.html?videoId=${previousVideoId}&content=${content}`;
  } else if (direction === 'next' && currentIndex !== -1 && currentIndex < videoList.length - 1) {
    const nextVideoId = videoList[currentIndex + 1];
    window.location.href = `/detail.html?videoId=${nextVideoId}&content=${content}`;
  } else {
    console.log(direction === 'previous' ? "Já está no primeiro vídeo." : "Já está no último vídeo.");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btnPrevious = document.getElementById('btnPrevious');
  const btnNext = document.getElementById('btnNext');

  if (content && subjectsFromFile[content] && subjectsFromFile[content].classes) {
    const videoList = subjectsFromFile[content].classes;
    const currentIndex = videoList.findIndex(videoObj => videoObj === currentVideoId);

    if (btnPrevious) {
      btnPrevious.disabled = (currentIndex <= 0);
      btnPrevious.addEventListener('click', () => handleNavigation('previous'));
    }
    if (btnNext) {
      btnNext.disabled = (currentIndex === -1 || currentIndex >= videoList.length - 1);
      btnNext.addEventListener('click', () => handleNavigation('next'));
    }
  } else {
    if (btnPrevious) btnPrevious.disabled = true;
    if (btnNext) btnNext.disabled = true;
  }

  if (currentVideoId) {
    loadYouTubePlayer(currentVideoId);
  }
});

