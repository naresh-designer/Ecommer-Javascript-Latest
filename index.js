const productApi = `https://fakestoreapi.com/products`;
const productContentElm = document.querySelector(".product-content");
const cartIconElm = document.querySelector(".cart-icon");
const cartElm = document.querySelector(".cart");
const cartCloseElm = document.querySelector(".cart-close");
const filterListElm = document.querySelector(".filter-list");
const selectFilterElm = document.querySelector(".filter-select");
const cartContentElm = document.querySelector(".cart-content");
const cartItemCountElm = document.querySelector(".cart-item-count");
const btnElm = document.querySelector(".btn-buy");
const searchInputElm = document.querySelector(".search__input");
let allProducts = [];
let allFilterList = [];
let allCartFilterList = [];
let showCountDisplay = 0;

cartIconElm.addEventListener("click", () => {
  cartElm.classList.add("active");
});
cartCloseElm.addEventListener("click", () => {
  cartElm.classList.remove("active");
});

// Show Data................................................
const showData = (data) => {
  const html = data.map((curProduct) => {
    if (!allFilterList.includes(curProduct.category)) {
      filterListElm.innerHTML += `
            <li><lable><input type="checkbox" value="${curProduct.category}">${curProduct.category}</lable></li>
        `;

      selectFilterElm.innerHTML += `
            <option value="${curProduct.category}">${curProduct.category}</option>
        `;
      allFilterList.push(curProduct.category);
    }

    if (allCartFilterList.length === 0) {
      allCartFilterList = allFilterList;
    }

    if (allCartFilterList.includes(curProduct.category)) {
      return `
                <div class="product-box">
                    <div class="img-box">
                        <img src="${curProduct.image}" alt="">
                    </div>
                    <h2 class="product-name">${curProduct.title.slice(
                      0,
                      10
                    )}</h2>
                    <div class="price-and-cart">
                        <span class="price">${curProduct.price}</span>
                        <button class="add-cart">Add to cart</button>
                    <a href="details.html?id=${
                      curProduct.id
                    }" class="details">Details</a>
                    </div>
                </div>
            `;
    }
  });
  productContentElm.innerHTML = html.join("");
  showCart();
  showFilterList();
  showSelectList();
};

// Show Cart..............................................
const showCart = () => {
  const cartBtn = document.querySelectorAll(".add-cart");
  cartBtn.forEach((curElm) => {
    curElm.addEventListener("click", (e) => {
      const productBox = e.target.closest(".product-box");
      addCart(productBox);
    });
  });
};

// Add Cart...............................................
const addCart = (productBox) => {
  const productName = productBox.querySelector(".product-name").innerText;
  const productPrice = productBox.querySelector(".price").innerText;
  const productImg = productBox.querySelector("img").src;

  const cartBox = document.createElement("div");
  cartBox.classList.add("cart-box");
  cartBox.innerHTML = `
    <img src="${productImg}" alt="" class="cart-img">
        <div class="cart-detail">
            <h2 class="product-name">${productName}</h2>
            <span class="price">${productPrice}</span>
            <div class="cart-quantity">
                <button class="decrement">-</button>
                <span class="number">1</span>
                <button class="increment">+</button>
            </div>
        </div>
    <button class="cart-remove">Delete</button>
  `;
  cartContentElm.appendChild(cartBox);
  removeItems(cartBox);
  countDisplay(1);
  amountToggle(cartBox);
  cartPrice();
};

// Remove Items............................................
const removeItems = (cartBox) => {
  cartBox.querySelector(".cart-remove").addEventListener("click", () => {
    cartBox.remove();
    countDisplay(-1);
    cartPrice();
  });
};

// Count Dispaly...........................................
const countDisplay = (change) => {
  showCountDisplay += change;
  if (showCountDisplay > 0) {
    cartItemCountElm.classList.add("active");
    cartItemCountElm.innerHTML = showCountDisplay;
  } else {
    cartItemCountElm.classList.remove("active");
    cartItemCountElm.innerHTML = "";
  }
};

// Amount Toggle............................................
const amountToggle = (cartBox) => {
  const incrementElm = cartBox.querySelector(".increment");
  const decrementElm = cartBox.querySelector(".decrement");
  const numberElm = cartBox.querySelector(".number");

  incrementElm.addEventListener("click", () => {
    numberElm.innerText++;
    cartPrice();
  });

  decrementElm.addEventListener("click", () => {
    if (numberElm.innerText > 1) {
      numberElm.innerText--;
      cartPrice();
    } else {
      cartBox.remove();
      countDisplay(-1);
      cartPrice();
    }
  });
};

// Cart Price.................................................
const cartPrice = () => {
  const totalPrice = document.querySelector(".total-price");
  const cartBoxElm = document.querySelectorAll(".cart-box");
  let total = 0;

  cartBoxElm.forEach((curElm) => {
    const cartPrice = curElm.querySelector(".price");
    const quantityElm = curElm.querySelector(".number");
    const totalQuntity = quantityElm.innerText;
    const totlaCartPrice = cartPrice.innerText;

    total += totalQuntity * totlaCartPrice;
  });
  totalPrice.innerText = `${total}`;
};

// Buy Button..............................................
btnElm.addEventListener("click", () => {
  if (showCountDisplay > 0) {
    alert("Thanks For Shopping");
    cartContentElm.innerHTML = "";
    cartElm.classList.remove("active");
    countDisplay(-1);
    cartPrice();
  } else {
    alert("Cart Is Empty");
  }
});

// Show Filter List........................................
const showFilterList = () => {
  filterListElm.addEventListener("click", () => {
    const inputCheckBox = document.querySelectorAll("input[type='checkbox']");
    allCartFilterList = [];
    inputCheckBox.forEach((curElm) => {
      if (curElm.checked) {
        allCartFilterList.push(curElm.value);
      }
    });
    showData(allProducts);
  });
};

// Show Select List.............................................
const showSelectList = () => {
  selectFilterElm.addEventListener("change", () => {
    allCartFilterList = [selectFilterElm.value];
    showData(allProducts);
  });
};

// Product Details................................................
const productDetaislElm = document.querySelector(".product-details");
const productDetails = () => {
  const showProduct = async () => {
    const id = window.location.search.split("=")[1];
    const res = await fetch(productApi);
    const data = await res.json();
    const findData = data.find((curElm) => curElm.id == id);
    productDetaislElm.innerHTML = `
        <h1>${findData.title}</h1>
        ${Array.from({ length: 5 }, (_, index) => {
          let num = index + 0.5;

          if (findData.rating.rate >= num + 1) {
            return `<i class="fa fa-star" aria-hidden="true"></i>`;
          } else if (findData.rating.rate >= num) {
            return `<i class="fa fa-star-half-o" aria-hidden="true"></i>`;
          } else {
            return `<i class="fa fa-star-o" aria-hidden="true"></i>`;
          }
        }).join("")}
        
    `;
  };
  showProduct();
};
productDetails();

// Get Data.................................................
const getData = async () => {
  try {
    const res = await fetch(productApi);
    const data = await res.json();
    allProducts = data;
    showData(data);
  } catch (error) {
    console.log(error);
  }
};

getData();

searchInputElm.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const filterSearch = allProducts.filter((curElm) => {
    return curElm.category.toLowerCase().includes(value.toLowerCase());
  });
  showData(filterSearch);
});
