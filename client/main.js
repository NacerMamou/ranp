//const apiUrl = "http://localhost:8016/mailing";
const apiUrl = "https://www.ranmamou.com/mailing";

let numberOfImages;
let xTranslationMax;
let xTranslationAmount;

const headerElt = document.getElementById("header");
const darkOverlay = document.getElementById("dark-overlay");
const projectDetailsContainer = document.getElementById(
  "project-details-container"
);

const carousselContainer = document.getElementById("caroussel-container");

const exitButton = document.getElementById("project-details-exit");

const projectsContainer = document.getElementById("projects-container");

const carouselRightButton = document.getElementById("right-button");

const carousselLeftButton = document.getElementById("left-button");

const projectTextContainer = document.getElementById("text-container");

const contactForm = document.getElementById("contact-form");

const formName = document.getElementById("name");
const formEmail = document.getElementById("email");
const formMessage = document.getElementById("message");

const setSlidePosition = (slide, index) => {
  slide.style.left = `${index * 100}%`;
};

const handler = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const clickedProjectId = e.target.id;
  const clickedProjectData = data.get(clickedProjectId);
  carousselContainer.textContent = "";

  numberOfImages = clickedProjectData.images.length;
  xTranslationMax = +((numberOfImages - 1) * 100);
  xTranslationAmount = 0;

  for (let i = 0; i < clickedProjectData.images.length; i++) {
    const newImage = document.createElement("img");
    newImage.src = clickedProjectData.images[i];

    const newSlide = document.createElement("li");
    newSlide.classList.add("caroussel-slide");
    newSlide.id = "caroussel-slide";

    newSlide.appendChild(newImage);
    carousselContainer.appendChild(newSlide);
    setSlidePosition(newSlide, i);
  }

  darkOverlay.show();
  darkOverlay.style.zIndex = "3";
  carousselconfigure(clickedProjectData);
};

const exitClickHandler = (e) => {
  e.preventDefault();
  e.stopPropagation();
  carousselLeftButton.removeEventListener("click", prevClickHandler);
  carousselLeftButton.removeEventListener("click", nextClickHandler);

  console.log(numberOfImages);
  numberOfImages = 0;
  console.log(numberOfImages);
  xTranslationMax = 0;
  xTranslationAmount = 0;
  carousselContainer.style.transform = `translateX(-${xTranslationAmount}%`;

  darkOverlay.setAttribute("closing", "");

  darkOverlay.addEventListener(
    "animationend",
    () => {
      darkOverlay.removeAttribute("closing");
      darkOverlay.close();
    },
    { once: true }
  );
};

async function displayProjects() {
  for (let [key, value] of data) {
    //Create a new project Topic and update its elements
    const newProjectTopic = document.createElement("div");
    newProjectTopic.classList.add("project-topic");

    const textTopDiv = document.createElement("div");
    textTopDiv.classList.add("text-top");

    const h3Elt = document.createElement("h3");
    h3Elt.textContent = value.nameOnHover;
    textTopDiv.appendChild(h3Elt);

    const pElt = document.createElement("p");
    pElt.textContent = value.techStack;
    textTopDiv.appendChild(pElt);

    const textBottomDiv = document.createElement("div");
    textBottomDiv.classList.add("text-bottom");

    const imgElt = document.createElement("img");
    imgElt.src = value.mainImageUrl;

    const aElt = document.createElement("a");
    aElt.classList.add("project-learn-more");
    aElt.id = key;
    aElt.textContent = "LEARN MORE";
    aElt.addEventListener("click", handler);
    textBottomDiv.appendChild(aElt);

    newProjectTopic.appendChild(textTopDiv);
    newProjectTopic.appendChild(imgElt);
    newProjectTopic.appendChild(textBottomDiv);

    projectsContainer.appendChild(newProjectTopic);
  }
}

// Carousel Animation

function carousselconfigure(clickedProjectData) {
  carouselRightButton.addEventListener("click", nextClickHandler);

  carousselLeftButton.addEventListener("click", prevClickHandler);

  exitButton.addEventListener("click", exitClickHandler);

  projectTextContainer.textContent = "";

  const h4Elt = document.createElement("h4");
  h4Elt.textContent = clickedProjectData.name;
  projectTextContainer.appendChild(h4Elt);

  const h5Elt = document.createElement("h5");
  h5Elt.textContent = clickedProjectData.title;
  projectTextContainer.appendChild(h5Elt);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  const demoButton = document.createElement("a");
  demoButton.id = "demo-link";
  demoButton.textContent = "VIEW SITE";
  demoButton.href = clickedProjectData.demoUrl;
  buttonsContainer.appendChild(demoButton);

  const githubButton = document.createElement("a");
  githubButton.classList.add("github");
  githubButton.textContent = "Github";
  githubButton.href = clickedProjectData.githubLink;
  buttonsContainer.appendChild(githubButton);

  projectTextContainer.appendChild(buttonsContainer);

  for (let i = 0; i < clickedProjectData.description.length; i++) {
    const pElt = document.createElement("p");
    pElt.textContent = clickedProjectData.description[i];
    pElt.classList.add("description");
    projectTextContainer.appendChild(pElt);
  }
}
const prevClickHandler = (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log(xTranslationAmount);
  if (xTranslationAmount == 0) {
    xTranslationAmount = xTranslationMax;
  } else if (xTranslationAmount >= 100) {
    xTranslationAmount -= 100;
  } else {
    xTranslationAmount = xTranslationAmount;
  }
  carousselContainer.style.transform = `translateX(-${xTranslationAmount}%`;
  console.log(xTranslationAmount);
};

const nextClickHandler = (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log(xTranslationAmount);
  if (xTranslationAmount == xTranslationMax) {
    xTranslationAmount = 0;
  } else if (xTranslationAmount < xTranslationMax) {
    xTranslationAmount += 100;
  } else {
    xTranslationAmount = xTranslationAmount;
  }
  carousselContainer.style.transform = `translateX(-${xTranslationAmount}%`;
  console.log(xTranslationAmount);
};

async function postRequest(url, reqObj) {
  // let newUrl = url+"/order";
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqObj),
    })
      .then(function (res) {
        if (res.status === 200 && res.ok) {
          return res.json();
        }
      })
      .then(function (v) {
        resolve(v);
      })
      .catch(function (err) {
        reject(new Error("fetching data from Api" + url + " is failed"));
      });
  });
}

async function sendMessage(url) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let formData = {
      name: formName.value,
      email: formEmail.value,
      message: formMessage.value,
    };

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(function (res) {
        if (res.ok) {
          window.alert("Thank you!! your message is sent successfuly");
          formName.value = "";
          formEmail.value = "";
          formMessage.value = "";
        }
      })
      .catch(function (err) {
        reject(new Error("fetching data from Api" + url + " is failed"));
        window.alert(
          "An error occured when sending your message, please try again!"
        );
      });
  });
}

displayProjects();
sendMessage(apiUrl);
