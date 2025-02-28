//! 1 dynamic add song-duration for any song
//!  dynamic sum all songs duration into stats for whole album duration

const songDurations = document.querySelectorAll(".song-duration");
let totalDurationInSeconds = 0;

const formatTime = (seconds) => {
  // format loeadmetadata which was with seconds to minutes now
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  // format time 'minutes : seconds ' and if seconds < 10 seconds add 0 before seconds
  const formattedTime = `${minutes}:${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds}`;
  return formattedTime;
};

// listening starts if dom is loaded , site is reload or load
window.addEventListener("DOMContentLoaded", (event) => {
  const audioElements = document.querySelectorAll(".audio-song");

  audioElements.forEach((audio) => {
    // listener loadmetadata for any audio song to find audio duration every song
    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration;
      //
      const formattedDuration = formatTime(duration);
      // finding a song duration which represents duration  in his 'parent' =  audio-song
      const songDurationElement =
        audio.parentElement.querySelector(".song-duration");
      if (songDurationElement) {
        songDurationElement.textContent = formattedDuration;
        updateTotalDuration();
      }
    });
  });
  //
  const updateTotalDuration = () => {
    totalDurationInSeconds = 0;
    // Extracts song durations from metadata (separated into minutes and seconds) to convert the total duration in seconds
    songDurations.forEach((song) => {
      const time = song.textContent.split(":");
      const min = parseInt(time[0]);
      const sec = parseInt(time[1]);
      totalDurationInSeconds += min * 60 + sec;
    });

    // convert and round duration for minutes:seconds and display total time for any album
    const totalMin = Math.floor(totalDurationInSeconds / 60);
    const totalSec = Math.floor(totalDurationInSeconds % 60);

    const displayAllTime =
      totalMin === 1
        ? `${totalMin} minute`
        : totalMin < 1
        ? `${totalSec} seconds`
        : `${totalMin} minutes`;

    const allSongsDuration = document.getElementById("all-songs-duration");
    allSongsDuration.textContent = displayAllTime;
  };
});

//! 2 dynamic sum quantity of tracks in any album

const anySong = document.querySelectorAll(".song");
const showQuantity = document.getElementById("all-songs-quantity");
const allAnySongs = anySong.length;

showQuantity.textContent =
  allAnySongs === 1 ? `${allAnySongs} song` : `${allAnySongs} songs`;

//! 3 toggle menu, and if you click everywhere you close toggle menu without click on icon

//react to load our dom structure
document.addEventListener("DOMContentLoaded", function () {
  const toggleMenu = document.getElementById("toggle_menu");
  const menuIcon = document.getElementById("dropdown-menu-icon");

  //click icon to activate toggle menu
  if (menuIcon && toggleMenu) {
    menuIcon.addEventListener("click", (e) => {
      toggleMenu.classList.toggle("active");
    });

    //! Handle Enter key press for icon
    function handleKeyPress(event) {
      if (event.key === "Enter") {
        toggleMenu.classList.toggle("active");
      }
    }

    menuIcon.addEventListener("keydown", handleKeyPress);

    //if you click anywhere besides toggleMenu you close it

    document.addEventListener("click", (e) => {
      //if you click into toggle menu you wont close it
      const isClickInsideMenu = toggleMenu.contains(e.target);
      //checking if click is on icon
      const isClickOnMenuIcon = menuIcon.contains(e.target);

      //if you click anywhere besides toggleMenu and icon - you close it
      if (!isClickInsideMenu && !isClickOnMenuIcon) {
        toggleMenu.classList.remove("active");
      }
    });
  }
});

//! 4 if logo was clicked go to top

const logoClick = document.getElementById("logo");

logoClick?.addEventListener("click", () => {
  window.scroll({ top: 0, behavior: "smooth" });
});

//clicking by enter

logoClick.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    window.scroll({ top: 0, behavior: "smooth" });
  }
});

//! 5 focused on album introduction

const summaryFocus = document.querySelector(".album-summary-description");
let isFocused = false;

summaryFocus?.addEventListener("click", () => {
  !isFocused
    ? (summaryFocus.classList.add("focused"), (isFocused = true))
    : (summaryFocus?.classList.remove("focused"), (isFocused = false));
});

//! 6 add audio to song div
// fuction when a songDiv is clicked to listen any song, even when only "button" icons is clicked

const songs = document.querySelectorAll(".song");
const audioElements = document.querySelectorAll(".audio-song");
const bigPlayBtn = document.getElementById("playBtn");
const playButtons = document.querySelectorAll(".play-btn-song"); //nowe
let isPlaying = false;
let currentSongIndex = 0;
let currentPlayingSongDiv = null;
let isSequentialPlaying = false;

// handle to tab and enter click for accessability, new code

playButtons.forEach((playBtn, index) => {
  playBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (!playBtn.classList.contains("active")) {
        document.querySelector(".play-btn.active")?.classList.remove("active");
        playBtn.classList.add("active");
        if (!isPlaying) {
          playSong(index);
        } else {
          stopCurrentSong();
        }
      } else {
        stopCurrentSong();
      }
    }
  });
});

//core handle song function
function playSong(index) {
  if (currentSongIndex === index && isPlaying) {
    stopCurrentSong();
    isPlaying = false;
  } else {
    stopCurrentSong();
    currentSongIndex = index;
    const audio = audioElements[currentSongIndex];
    const songDiv = songs[currentSongIndex];
    const durationElement = songDiv.querySelector(".song-duration");

    if (audio instanceof HTMLAudioElement) {
      audio.play();
      isPlaying = true;
      songDiv.classList.add("song-clicked");
      currentPlayingSongDiv = songDiv;

      audio.addEventListener("timeupdate", () => {
        const currentTime = audio.currentTime;
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        durationElement.textContent = `${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`;
      });

      audio.onended = () => {
        isPlaying = false;
        songDiv.classList.remove("song-clicked");
        currentPlayingSongDiv = null;
        if (isSequentialPlaying) {
          currentSongIndex++;
          if (currentSongIndex < songs.length) {
            playSong(currentSongIndex);
          } else {
            isSequentialPlaying = false;
            currentSongIndex = 0;
            bigPlayBtn.classList.add("ended-play");
            bigPlayBtn.addEventListener("click", () => {
              bigPlayBtn.classList.remove("ended-play");
            });
          }
        }
      };
    }
  }
}

function stopCurrentSong() {
  if (currentPlayingSongDiv) {
    const index = Array.from(songs).indexOf(currentPlayingSongDiv);
    const audio = audioElements[index];
    if (audio instanceof HTMLAudioElement) {
      audio.pause();

      isPlaying = false;
      currentPlayingSongDiv.classList.remove("song-clicked");
      currentPlayingSongDiv = null;
    }
  }
}

songs.forEach((songDiv, index) => {
  songDiv.addEventListener("click", () => {
    if (!isSequentialPlaying) {
      playSong(index);
    } else {
      isSequentialPlaying = false;
      playSong(index);
    }
  });
});

bigPlayBtn.addEventListener("click", () => {
  isSequentialPlaying = true;
  currentSongIndex = 0;
  playSong(currentSongIndex);
});

//! 7 when you click on the visible dots, the visibility of the information changes
//! 8 heart click which added song to favorite in any song
//const songs = document.querySelectorAll(".song"); was declared

songs.forEach((song) => {
  const visibleInfoDiv = song.querySelector(".visible-info");
  const visibleDots = song.querySelector(".btn-3-dots-visible");
  const hiddenInfoDiv = song.querySelector(".hidden-info");
  const hiddenDots = song.querySelector(".btn-3-dots-hidden");
  const heartInSong = song.querySelectorAll(".heart-btn-in-song");

  //console.log(visibleInfoDiv, visibleDots, hiddenInfoDiv, hiddenDots, heartInSong);

  if (visibleInfoDiv) {
    heartInSong.forEach((heart) => {
      heart.addEventListener("click", (event) => {
        heart.classList.toggle("is-red");
        //if heart is clicked, it won't trigger whole song div
        event.stopPropagation();
      });
    });
    //firstly visible dots
    visibleDots.addEventListener("click", () => {
      hiddenInfoDiv.classList.remove("hidden-info");
      hiddenInfoDiv.classList.add("visible-info");
      visibleInfoDiv.classList.remove("visible-info");
      visibleInfoDiv.classList.add("hidden-info");

      //simulation click after click visible dots, duartion = 10 seconds
      setTimeout(() => {
        hiddenDots.click();
      }, 10000);
    });

    // if VISIBLE dots is clicked, it won't trigger the click for the entire song div
    visibleDots.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    //hidden dots, active when visible dots was clicked
    hiddenDots.addEventListener("click", () => {
      hiddenInfoDiv.classList.remove("visible-info");
      hiddenInfoDiv.classList.add("hidden-info");
      visibleInfoDiv.classList.remove("hidden-info");
      visibleInfoDiv.classList.add("visible-info");
    });

    // if HIDDEN dots is clicked, it won't trigger the click for the entire song div
    hiddenDots.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
});

//! 9 clicking  arrow link enables returning to the previous site that referred to the current page
// and this function using a the browser's history to navigate back to the referring page.

const linkReturn = document.querySelector(".arrow-link");

document.addEventListener("DOMContentLoaded", () => {
  if (linkReturn) {
    linkReturn.addEventListener("click", function (e) {
      e.preventDefault();
      window.history.back();
    });
  }
});

//! 10 for desktops, chevron icon if clicked, it hide a social nav menu

const chevronIcon = document.getElementById("chevron-to-show-social-menu");
const socialMenu = document.querySelector(".top-nav-desktop");

//function for tab press to hide and show elements
function handleKeyPress(event) {
  if (event.key === "Enter") {
    socialMenu.classList.toggle("top-nav-desktop-hidden");
    chevronIcon.classList.toggle("rotate");
  }
}
chevronIcon?.addEventListener("keydown", handleKeyPress);

chevronIcon?.addEventListener("click", () => {
  socialMenu?.classList.toggle("top-nav-desktop-hidden");
  chevronIcon.classList.toggle("rotate");
});

//! 11 form in footer to redirect to greetings page if person complete form with correct email

const form = document.querySelector(".newsletterForm");
//listening submit in form
form.addEventListener("submit", (e) => {
  //to block form action without uncorrect or empty email input
  e.preventDefault();
  //link to redirect page with greetings
  window.location.href = "/src/other/page-greetings/greetings.html";
});
