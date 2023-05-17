const burger = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");

if (burger) {
  burger.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURl,
  uploadString,
  uploadBytes,
  storageBucket,
  getDownloadURL,
} from "firebase/storage";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getIdToken,
} from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyongI8r6DVOTav06xwdeYOZ98U86jbdc",
  authDomain: "britto-clothing.firebaseapp.com",
  projectId: "britto-clothing",
  storageBucket: "britto-clothing.appspot.com",
  messagingSenderId: "405191445076",
  appId: "1:405191445076:web:9023806727fef499b37bc1",
  measurementId: "G-S9NX2QFWMP",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const colref = collection(db, "products");

// const imgurls = JSON.parse(localStorage.getItem("imgurls"));
// console.log(imgurls);

window.onload = () => {
  //home page~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (
    window.location.href == "http://127.0.0.1:5500/dist/index.html" ||
    window.location.href == "http://127.0.0.1:5500/dist/index.html#"
  ) {
    console.log(`home`);
    const signout = document.getElementById("signout");
    const addproduct = document.querySelector(".addproduct");
    addproduct.classList.add("hideaddproduct");
    const auth = getAuth();

    //checking user null or user or admin

    onAuthStateChanged(auth, (user) => {
      if (user == null) {
        signout.classList.add("hideaddproduct");
      }
      localStorage.setItem("userid", user.uid);
    });
    onAuthStateChanged(auth, (user) => {
      if (user.uid == "jnXvv7O1A9NwERhb9EMvMj18PEa2") {
        addproduct.classList.remove("hideaddproduct");
      }
      console.log(user.uid);
    });

    //signout button

    signout.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          console.log(`user signed out`);
        })
        .catch((err) => {
          console.log(err.message);
        });
      location.reload();
    });

    //going to products page

    document
      .getElementById("gotoproductspage")
      .addEventListener("click", () => {
        window.location.href = "http://127.0.0.1:5500/dist/products.html";
      });

    addproduct.addEventListener("click", () => {
      window.location.href = "http://127.0.0.1:5500/dist/addproducts.html";
    });
  }

  //PRODUCTS--PAGE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (
    window.location.href == "http://127.0.0.1:5500/dist/products.html" ||
    window.location.href == "http://127.0.0.1:5500/dist/products.html#"
  ) {
    const auth = getAuth();
    const products = [];
    const imgs = [];
    const finalimg = [];
    onSnapshot(colref, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        products.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      localStorage.setItem("products", JSON.stringify(products));
      const all = document.getElementById("allproducts");
      all.classList.add("products");
      while (all.firstChild) {
        all.removeChild(all.lastChild);
      }

      console.log("removed");
      products.forEach((product) => {
        const myproduct = document.createElement("div");
        myproduct.classList.add("myproduct");

        const imgone = document.createElement("img");
        imgone.src = product.img1;
        myproduct.appendChild(imgone);
        imgone.classList.add("productimg");
        const description = document.createElement("div");
        description.classList.add("description");
        const span = document.createElement("span");
        const productname = document.createElement("h5");
        const stars = document.createElement("div");
        stars.classList.add("stars");
        const itag = document.createElement("i");

        const price = document.createElement("h4");
        const add = document.createElement("button");
        add.classList.add("addtocart");
        add.innerHTML = `<i class="fa-solid fa-cart-plus"></i>`;
        const deletec = document.createElement("button");
        deletec.classList.add("deleteproduct");
        deletec.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        span.innerHTML = product.brand;

        productname.innerHTML = product.product;

        price.innerHTML = product.price;

        all.appendChild(myproduct);

        myproduct.appendChild(description);
        description.appendChild(span);
        description.appendChild(productname);
        description.appendChild(stars);
        description.appendChild(price);
        myproduct.appendChild(add);
        myproduct.appendChild(deletec);
        const userid = localStorage.getItem("userid");
        add.setAttribute("id", product.id);
        imgone.setAttribute("id", product.id);

        // add.setAttribute("userid", userid);
        // deletec.setAttribute("id", product.id);
        deletec.setAttribute("id", product.id);
        deletec.classList.add("hideaddproduct");

        onAuthStateChanged(auth, (user) => {
          if (user.uid == "jnXvv7O1A9NwERhb9EMvMj18PEa2") {
            deletec.classList.remove("hideaddproduct");
          }
        });

        onAuthStateChanged(auth, (user) => {
          if (user == null) {
            deletec.classList.add("hideaddproduct");
          }
        });

        imgone.addEventListener("click", (e) => {
          console.log(e.target.id);
          localStorage.setItem("productid", e.target.id);

          window.location.href =
            "http://127.0.0.1:5500/dist/singleproduct.html";
        });

        add.addEventListener("click", (e) => {
          console.log(e.target.id);
          const currentuser = localStorage.getItem("userid");

          if (`${currentuser}` in localStorage) {
            const oldcart = JSON.parse(localStorage.getItem(`${currentuser}`));

            const newarray = products.filter((value) => {
              if (e.target.id == value.id) {
                return e.target.id;
              }
            });

            for (let i = 0; i < newarray.length; i++) {
              newarray[i].price = newarray[i].price * 1;
              oldcart.push(newarray[i]);
            }
            console.log(oldcart);
            localStorage.setItem(`${currentuser}`, JSON.stringify(oldcart));
          } else {
            const cartarray = products.filter((value) => {
              if (e.target.id == value.id) {
                return e.target.id;
              }
            });
            localStorage.setItem(`${currentuser}`, JSON.stringify(cartarray));
            console.log(cartarray);
          }
        });

        deletec.addEventListener("click", async (e) => {
          const deleteRef = doc(db, "products", e.target.id);
          await deleteDoc(deleteRef).then((snapshot) => {
            location.reload();
          });
        });
      });
    });

    document.getElementById("user").addEventListener("click", () => {
      console.log("hello hello hello user");
    });

    const search = document.querySelector(".searchinp");
    search.addEventListener("input", () => {
      const tosearch = search.value.toLowerCase();
      const searchin = document.querySelectorAll(".myproduct");

      searchin.forEach((item) => {
        const text = item.textContent;
        if (text.toLowerCase().includes(tosearch.toLowerCase())) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  //ADDPRODUCTS--PAGE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (window.location.href == "http://127.0.0.1:5500/dist/addproducts.html") {
    console.log("hello product");
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user.uid !== "jnXvv7O1A9NwERhb9EMvMj18PEa2") {
        window.location.href = "http://127.0.0.1:5500/dist/index.html";
      }
    });

    onAuthStateChanged(auth, (user) => {
      if (user == null) {
        window.location.href = "http://127.0.0.1:5500/dist/index.html";
      }
    });

    const app = initializeApp(firebaseConfig);

    const getFileURL = async (file, folder) => {
      if (!file) return;
      try {
        const uniqueID = Date.now() + Math.floor(Math.random()).toString();
        const fileRef = ref(getStorage(app), `${uniqueID}${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
      } catch (err) {
        console.log(err.message);
      }
    };

    const desc = document.getElementById("description");
    const brandname = document.getElementById("brand-name");
    const productname = document.getElementById("product-name");
    const img = document.getElementById("imginps");
    const rating = document.getElementById("rating");
    const price = document.getElementById("price");

    img.addEventListener("change", async (e) => {
      const productURLS = [];

      const files = e.target.files;
      for (let index = 0; index < files.length; index++) {
        const photoURL = await getFileURL(files[index], "products");
        productURLS.push(photoURL);
      }
      console.log(productURLS);
      document
        .getElementById("addproducts")
        .addEventListener("submit", async (e) => {
          //getting images
          console.log(productURLS);
          e.preventDefault();
          console.log(`vela seidhu da dei`);
          await addDoc(colref, {
            brand: brandname.value,
            product: productname.value,
            img1: productURLS[0],
            img2: productURLS[1],
            img3: productURLS[2],
            img4: productURLS[3],
            rating: rating.value,
            price: price.value,
            description: desc.value,
            size: "L",
            quantity: 1,
          }).then((doc) => {
            brandname.value = "";
            productname.value = "";
            rating.value = "";
            price.value = "";
            desc.value = "";
            location.reload();
          });
        });
    });
  }

  //LOGIN--PAGE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (window.location.href == "http://127.0.0.1:5500/dist/login.html") {
    console.log("hello login");
    const emailin = document.getElementById("emailin");
    const passwordin = document.getElementById("passwordin");
    document
      .querySelector(".loginform")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, emailin.value, passwordin.value)
          .then((cred) => {
            console.log("user logged in", cred.user);
            window.location.href = "http://127.0.0.1:5500/dist/index.html";
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
    document.getElementById("little").addEventListener("click", () => {
      window.location.href = "http://127.0.0.1:5500/dist/signup.html";
    });
  }

  //SIGNUP--PAGE`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (
    window.location.href ==
      "http://127.0.0.1:5500/dist/signup.html?password=" ||
    window.location.href == "http://127.0.0.1:5500/dist/signup.html"
  ) {
    console.log("signup");
    const auth = getAuth();
    const email = document.getElementById("emailsignup");
    const password = document.getElementById("passwordsign");

    document
      .querySelector(".signupform")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
          ).then((cred) => {
            console.log(cred.user);
            console.log(cred.user.uid);
          });
        } catch (err) {
          console.log(err.message);
        }
        window.location.href = "http://127.0.0.1:5500/dist/index.html";
      });
    document.getElementById("little").addEventListener("click", () => {
      window.location.href = "http://127.0.0.1:5500/dist/login.html";
    });
  }

  //SINGLE--PRODUCT--PAGE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (window.location.href == "http://127.0.0.1:5500/dist/singleproduct.html") {
    const currentproducts = JSON.parse(localStorage.getItem("products"));
    console.log(currentproducts);
    const currentproductid = localStorage.getItem("productid");
    console.log(currentproductid);

    const currentproductshow = currentproducts.filter((product) => {
      if (currentproductid == product.id) {
        return currentproductid;
      }
    });
    console.log(currentproductshow);
    const mainimage = document.getElementById("mainimg");
    const smallimage1 = document.getElementById("small1");
    const smallimage2 = document.getElementById("small2");
    const smallimage3 = document.getElementById("small3");
    mainimage.src = currentproductshow[0].img1;
    smallimage1.src = currentproductshow[0].img2;
    smallimage2.src = currentproductshow[0].img3;
    smallimage3.src = currentproductshow[0].img4;
    smallimage1.addEventListener("click", () => {
      if (mainimage.src == currentproductshow[0].img1) {
        mainimage.src = currentproductshow[0].img2;
        smallimage1.src = currentproductshow[0].img1;
      } else {
        mainimage.src = currentproductshow[0].img1;
        smallimage1.src = currentproductshow[0].img2;
      }
    });
    smallimage2.addEventListener("click", () => {
      if (mainimage.src == currentproductshow[0].img1) {
        mainimage.src = currentproductshow[0].img3;
        smallimage2.src = currentproductshow[0].img1;
      } else {
        mainimage.src = currentproductshow[0].img1;
        smallimage2.src = currentproductshow[0].img3;
      }
    });
    smallimage3.addEventListener("click", () => {
      if (mainimage.src == currentproductshow[0].img1) {
        mainimage.src = currentproductshow[0].img4;
        smallimage3.src = currentproductshow[0].img1;
      } else {
        mainimage.src = currentproductshow[0].img1;
        smallimage3.src = currentproductshow[0].img4;
      }
    });
    document.getElementById("productname").innerText =
      currentproductshow[0].product;

    const size = document.getElementById("selectsize");
    const quantity = document.getElementById("quantity");

    document.getElementById("description").innerText =
      currentproductshow[0].description;
    const addcartbutton = document.getElementById("addcartbutton");

    document.getElementById(
      "price"
    ).innerText = `₹${currentproductshow[0].price}`;

    addcartbutton.addEventListener("click", () => {
      const currentuser = localStorage.getItem("userid");
      currentproductshow[0].size = size.value;
      currentproductshow[0].quantity = quantity.value;
      currentproductshow[0].price =
        currentproductshow[0].price * quantity.value;
      localStorage.setItem("currentid", currentproductshow[0].id);
      if (`${currentuser}` in localStorage) {
        const currentcart = JSON.parse(localStorage.getItem(`${currentuser}`));
        currentcart.push(currentproductshow[0]);
        localStorage.setItem(`${currentuser}`, JSON.stringify(currentcart));
      } else {
        localStorage.setItem(
          `${currentuser}`,
          JSON.stringify(currentproductshow)
        );
      }

      window.location.href = "http://127.0.0.1:5500/dist/index.html";
    });
  }

  //CART--PAGE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (
    window.location.href == "http://127.0.0.1:5500/dist/cartpage.html" ||
    window.location.href == "http://127.0.0.1:5500/dist/cartpage.html#"
  ) {
    console.log("hellocart");

    const currentcartuser = localStorage.getItem("userid");
    const all = document.getElementById("allproducts");

    if (`${currentcartuser}` in localStorage) {
      const currentcartproducts = JSON.parse(
        localStorage.getItem(`${currentcartuser}`)
      );

      currentcartproducts.forEach((product) => {
        const myproduct = document.createElement("div");
        myproduct.classList.add("myproduct");

        const imgone = document.createElement("img");
        imgone.src = product.img1;
        myproduct.appendChild(imgone);
        imgone.classList.add("productimg");
        const description = document.createElement("div");
        description.classList.add("description");
        const span = document.createElement("span");
        const productname = document.createElement("h5");
        const stars = document.createElement("div");
        stars.classList.add("stars");
        const itag = document.createElement("i");
        const quantitylabel = document.createElement("label");
        quantitylabel.innerHTML = "Quantity: ";
        const quantity = document.createElement("p");

        const sizelabel = document.createElement("label");
        sizelabel.innerHTML = "Size: ";
        const size = document.createElement("h");
        const price = document.createElement("h4");

        const deletec = document.createElement("button");
        deletec.classList.add("deleteproduct");
        deletec.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        span.innerHTML = product.brand;
        quantity.innerHTML = product.quantity;
        productname.innerHTML = product.product;
        size.innerHTML = product.size;
        price.innerHTML = product.price;

        all.appendChild(myproduct);

        myproduct.appendChild(description);
        description.appendChild(span);
        description.appendChild(productname);
        description.appendChild(stars);
        description.appendChild(price);
        description.appendChild(quantitylabel);
        description.appendChild(quantity);
        description.appendChild(sizelabel);
        description.appendChild(size);
        myproduct.appendChild(deletec);
        imgone.setAttribute("id", product.id);
        deletec.setAttribute("id", product.id);

        imgone.addEventListener("click", (e) => {
          console.log(e.target.id);
          localStorage.setItem("productid", e.target.id);
          window.location.href =
            "http://127.0.0.1:5500/dist/singleproduct.html";
        });

        const deletecartitem = deletec.addEventListener("click", (e) => {
          const aftedeletecart = currentcartproducts.filter((product) => {
            if (product.id != e.target.id) {
              return product.id;
            }
          });
          localStorage.setItem(
            `${currentcartuser}`,
            JSON.stringify(aftedeletecart)
          );

          window.location.reload();
        });
      });

      const cartsubtotal = document.getElementById("subtotal-cart");
      const carttotal = document.getElementById("totalprice");
      let sum = 0;

      for (let index = 0; index < currentcartproducts.length; index++) {
        sum += currentcartproducts[index].price;
      }
      cartsubtotal.innerHTML = sum;
      carttotal.innerHTML = sum;
    } else {
      myproduct.style.display = "none";
    }
  }
};
