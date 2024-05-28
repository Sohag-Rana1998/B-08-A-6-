const cardContainer = document.getElementById('card-container');
const buttonContainer = document.getElementById('button-container');
const error = document.getElementById('Error');
let sortByView = false;
let selectedCategory = 1000;


const sortBtn = document.getElementById("sort-button");
sortBtn.addEventListener('click', () => {
  sortByView = true;
  fetchDataByCategories(selectedCategory, sortByView);
})

const loadCategory = async () => {
  const response = await fetch('https://openapi.programming-hero.com/api/videos/categories');
  const data = await response.json();
  const category = data.data;

  category.forEach((item) => {

    const button = document.createElement('button');
    button.className = 'btn category-btn';
    button.innerText = item.category;

    button.addEventListener('click', () => {
      fetchDataByCategories(item.category_id, sortByView)

      const allBtn = document.querySelectorAll('.category-btn');
      for (btn of allBtn) {
        btn.classList.remove('bg-red-500');
      }
      button.classList.add('bg-red-500');
    });
    buttonContainer.appendChild(button);

  })
}




const fetchDataByCategories = async (categoryId, sortByView) => {
  selectedCategory = categoryId
  const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
  const data = await response.json();
  const allData = data.data;

  if (sortByView) {
    allData.sort((a, b) => {
      const firstView = a.others?.views;
      const secondView = b.others?.views;
      const firstViewNum = parseFloat(firstView.replace("K", '')) || 0;
      const secondViewNum = parseFloat(secondView.replace("K", '')) || 0;

      return secondViewNum - firstViewNum;
    })
  }

  if (allData.length === 0) {
    error.classList.remove('hidden')
  }
  else {
    error.classList.add('hidden')
  }

  cardContainer.innerHTML = '';
  allData.forEach((card) => {

    const newCard = document.createElement('div');
    let verifiedBadge = '';
    let postTime = '';
    if (card.authors[0].verified) {
      verifiedBadge = `<img class="w-6 h-6" src="./images/verified.png" alt="">`;
    }

    if (card.others.posted_date) {
      let time = parseFloat(card.others.posted_date);
      postTime = secondsToHoursMinutes(time);
    }
    newCard.innerHTML = `<div class="card w-full h-96 bg-base-100 shadow-xl">
        <figure class="overflow-hidden "><img class="w-full p-5 h-60 rounded-xl" src="${card.thumbnail}" alt="video" />
          <h6 class="absolute bottom-[40%] right-12">${postTime}</h6>
        </figure>
        <div class="card-body">
          <div class="flex space-x-4 justify-start items-start">
            <div>
              <img class="w-12 h-12 rounded-full" src="${card.authors[0].profile_picture}" alt="">
            </div>
            <div>
              <h2 class="card-title">${card.title}</h2>
              <div class="flex mt-3">
                <p>${card.authors[0].profile_name}</p>
                ${verifiedBadge}
              </div>
              <p class="mt-3">${card.others.views}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    cardContainer.appendChild(newCard);
  })
}

const secondsToHoursMinutes = (seconds) => {
  // Convert seconds to hours
  let hours = Math.floor(seconds / (60 * 60));

  // Convert the remaining seconds to minutes
  let minutes = Math.floor((seconds % (60 * 60)) / 60);
  console.log(hours)
  return `${hours} hours ${minutes} minutes ago`;
}







loadCategory();
fetchDataByCategories(selectedCategory, sortByView);