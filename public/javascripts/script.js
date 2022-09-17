function _(element) {
  return document.getElementById(element);
}
_("sizes").onchange = function () {
  let id = _("sizes").value;
  console.log(id);
  fetch("/v1/get-size-of-quantity/" + id, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      var buttonId = document.getElementById("add-cart-desable");
      var bagButton = document.getElementById("bagButton");
      var html = "";
      if (response.productQuantity.qauntity === 0) {
        html = '<p class="text-danger">out of stock</p>';
        bagButton.setAttribute("hidden", "hidden");
        buttonId.setAttribute("disabled", "disabled");
        buttonId.removeAttribute("hidden");
        buttonId.classList.remove("hov-btn1");
      } else {
        document.getElementById("product-constants").innerHTML =
          response.productQuantity._id;

        if (response.productInCartExistOrNot) {
          html = '<p class="text-success">instock</p>';
          if (response.productInCartExistOrNot.products.length === 0) {
            html = '<p class="text-success">instock</p>';
            bagButton.setAttribute("hidden", "hidden");
            buttonId.removeAttribute("hidden");
            buttonId.removeAttribute("disabled");
            buttonId.classList.add("hov-btn1");
          } else {
            html = '<p class="text-success">instock</p>';
            buttonId.setAttribute("hidden", "hidden");
            bagButton.removeAttribute("hidden");
          }
        } else {
          html = '<p class="text-success">instock</p>';
          buttonId.removeAttribute("disabled");
          buttonId.classList.add("hov-btn1");
        }
      }
      document.getElementById("qauntityOfProduct").innerHTML = html;
    });
};

//add to cart
async function addToCart(productId) {
  var productConstants = document.getElementById("product-constants").innerHTML;
  console.log(productConstants);
  await fetch("/v1/add-product-to-cart/" + productId + "/" + productConstants, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      var buttonId = document.getElementById("add-cart-desable");
      var bagButton = document.getElementById("bagButton");
      var cartBadge = document.getElementById("cartBadge");
      if (response.condition) {
        var galleryModal = new bootstrap.Modal(
          document.getElementById("mymodal1234"),
          {
            keyboard: false,
          }
        );
        galleryModal.show();
      } else {
        buttonId.setAttribute("hidden", "hidden");
        bagButton.removeAttribute("hidden");
        cartBadge.setAttribute("data-notify", response.length);
        

        Swal.fire({
          icon: 'success',
          title: 'Good job.',
          text: 'Product added to cart',
        
        })
        document.getElementById("cart-status").innerHTML="";
      }
    });
}
//login form inside cart or modal
const formlogin = document.getElementById("form123");
const password = document.querySelector("#password");
let loginbutton = document.getElementById("loginbutton");
loginbutton.addEventListener("click", (e) => {
  let id = e.target.getAttribute("data-id");
  updateQuestion(e, id);
});
async function updateQuestion(e, id) {
  e.preventDefault();
  var formData = new FormData(formlogin);
  dataToSend = Object.fromEntries(formData);
  await fetch(`/login?id=${id}`, {
    method: "POST",
    body: JSON.stringify(dataToSend),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (response) => {
      if (response.condition) {
        document.getElementById("err-msg").innerHTML = response.message;
      } else {
        await fetch("/v1/add-product-to-cart/", {
          method: "POST",
        }).then((response) => {
          if (response) {
            window.location.reload();
            document.getElementById("cart-status").innerHTML="<h4>Cart is empty</h4>";
            Swal.fire({
              icon: 'success',
              title: 'Good job.',
              text: 'Product added to cart',
            
            })
          }
        });
      }
    });
}
o;

//increment or decrement cart item count

async function updateProductCountInCart(cartId, productConstantId, num) {
  var count = parseInt(await document.getElementById(productConstantId).value);

  if (num === 1) {
    count = count + 1;
  } else {
    if (count === 0) {
      fetch("/v1/increment-or-decrement-cart-item-count/" + productConstantId, {
        method: "POST",
        body: JSON.stringify({ cartId, productConstantId, count }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.removeProduct) {
            document.getElementById(productConstantId + "cart-row").remove();
            Swal.fire("Good job!", "Product deleted!", "success");
          }

        });
    } else {
      count = count - 1;
    }
  }
  // let data = JSON.stringify({ "count": value })
  
  fetch("/v1/increment-or-decrement-cart-item-count", {
    method: "POST",
    body: JSON.stringify({ cartId, productConstantId, count }),
    headers: { "Content-Type": "application/json" },
  }).then((response) => response.json()).then((response) => {
    document.getElementById(productConstantId + "ab").innerHTML = response.totalPriceOfEachProduct
    document.getElementById("subTotal-cart").innerHTML=response.subTotal
    document.getElementById("cart-total").innerHTML=response.subTotal
    

    
  
  })
}
//delete from cart
function deleteProductFromCart(cartId, productConstantId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("/v1/delete-product-from-cart", {
        method: "POST",
        body: JSON.stringify({ cartId, productConstantId, count:1 }),
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => response.json())
        .then((response) => {
          if (response.removeProduct) {
            document.getElementById(productConstantId + "cart-row").remove();
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            if (response.length <= 1) {
              document.getElementById("cart-status").innerHTML="<h4>Cart is empty</h4>";
            }
          }
        })



      // Swal.fire(
      //   'Deleted!',
      //   'Your file has been deleted.',
      //   'success'
      // )
    }
  })
}


function deleteFromWishList(productId, userId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("/v1/delete-product-from-wishList", {
        method: "POST",
        body: JSON.stringify({ productId, userId }),
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => response.json())
        .then((response) => {
          if (response.removeProduct) {
            document.getElementById(productId + "wishList-row").remove();
            Swal.fire(
              'Deleted!',
              'Your Item has been deleted.',
              'success'
            )
            // if (response.length <= 1) {
            //   // document.getElementById("cart-status").innerHTML="<h4>Cart is empty</h4>";
            // }
          }
        })



      // Swal.fire(
      //   'Deleted!',
      //   'Your file has been deleted.',
      //   'success'
      // )
    }
  })
}



function getAllCountries(addressId) {
  fetchStateData(addressId)
  // var headers = new Headers();
  // headers.append("X-CSCAPI-KEY", "dr5hn");

  var requestOptions = {
      method: 'GET',
    //  headers: headers,
    //   redirect: 'follow'
  };

  fetch("https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json", requestOptions)
      .then(response => response.json())
    .then(result => {
      var html = ""
      html='<option value="" selected>Choose...</option>'
      // console.log(result[0])
      var list
      if (addressId) {
      list=document.getElementById("countryList"+addressId)
        
      } else {
      list=document.getElementById("countryList")
        
      }

      result.map(country => {
        html += `<option value="${country.name}">${country.name}</option>`
  
      }
      )
      list.innerHTML = html

    })
      .catch(error => console.log('error', error));
}
var allStates;

function fetchStateData() {
  fetch("https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/states.json",
    {
    method: 'GET',
  })
      .then(response => response.json())
    .then(result => {
      allStates=result

    })
      .catch(error => console.log('error', error));
}

function fetchStateDataEach(addressId) {
  // fetch("https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/states.json",
  //   {
  //   method: 'GET',
  // })
  //     .then(response => response.json())
  //   .then(result => {
      var html2 = ""
      html2='<option value="" selected>Choose...</option>'
      // console.log(result)
  var stateList
  var countryList
  if (addressId) {
    stateList = document.getElementById("stateList"+addressId)
    countryList=document.getElementById("countryList"+addressId)
    
    
  } else {
    stateList=document.getElementById("stateList")
    countryList=document.getElementById("countryList")
    
  }
  
      allStates.map(state => {
        // console.log(countryList)
        if (countryList.value == state.country_name) {
          // console.log(state)
        html2 += `<option value="${state.name}">${state.name}</option>`

        }
  
      }
      )
      stateList.innerHTML = html2

}
    
// )
//       .catch(error => console.log('error', error));
// }

function changeCountryList(addressId){

  fetchStateDataEach(addressId)
}

// const formCheckOut123 = document.getElementById("checkoutFormSubmission123")
// const formCheckOutButton123 = document.getElementById("formCheckOutButton123");


//   formCheckOutButton123.addEventListener("click", (e) => {
//     let id = e.target.getAttribute("data-id");
//     submitCheckOutForm(e, id);
//   });


// async function submitCheckOutForm(e) {
//   console.log("sdfcsda")
//   e.preventDefault();
//   let formData = new FormData(formCheckOut123);
//   dataToSend = Object.fromEntries(formData);
//   console.log(dataToSend);
//    await fetch('/v1/checkout-user', {
//     method: "POST",
//     body: JSON.stringify(dataToSend),
//     headers: {
//       "Content-Type": "application/json",
//     },
//    }).then(response => response.json())
//      .then(response => { console.log('success', response)})
// }
