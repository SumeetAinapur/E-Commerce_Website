    function getUserData() {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (!loggedInUser) return null;
      
      const user = JSON.parse(loggedInUser);
      const userData = localStorage.getItem(`userData_${user.email}`);
      
      if (userData) {
        return JSON.parse(userData);
      } else {

        const newUserData = {
          name: user.name,
          email: user.email,
          orders: 0,
          memberSince: new Date().toLocaleDateString()
        };
        localStorage.setItem(`userData_${user.email}`, JSON.stringify(newUserData));
        return newUserData;
      }
    }

    function updateUserData(updatedData) {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (!loggedInUser) return;
      
      const user = JSON.parse(loggedInUser);
      localStorage.setItem(`userData_${user.email}`, JSON.stringify(updatedData));
    }

    function increaseOrderCount() {
      const userData = getUserData();
      if (userData) {
        userData.orders += 1;
        updateUserData(userData);
        return userData.orders;
      }
      return 0;
    }

    let cart = [];
    let cartCount = 0;
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const closeCartModal = document.getElementById('closeCartModal');
    const cartLink = document.getElementById('cartLink');
    const sidebarCart = document.getElementById('sidebarCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');

    const accountModal = document.getElementById('accountModal');
    const userDetails = document.getElementById('userDetails');
    const closeAccountModal = document.getElementById('closeAccountModal');
    const accountLink = document.getElementById('accountLink');
    const sidebarAccount = document.getElementById('sidebarAccount');

    const dealsModal = document.getElementById('dealsModal');
    const closeDealsModal = document.getElementById('closeDealsModal');
    const dealsLink = document.getElementById('dealsLink');
    const sidebarDeals = document.getElementById('sidebarDeals');

    const homeBtn = document.getElementById('homeBtn');
    const homeLink = document.getElementById('homeLink');
    const sidebarHome = document.getElementById('sidebarHome');

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');
    const logoutBtn = document.getElementById('logoutBtn');

    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('hidden');
      hamburger.classList.toggle('active');
    });

    hamburger.addEventListener('dblclick', () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    });

    closeSidebar.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });

    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('loggedInUser');
      window.location.href = 'login.html';
    });

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    homeBtn.addEventListener('click', scrollToTop);
    homeLink.addEventListener('click', scrollToTop);
    sidebarHome.addEventListener('click', scrollToTop);

    dealsLink.addEventListener('click', () => {
      dealsModal.classList.add('active');
    });

    sidebarDeals.addEventListener('click', () => {
      dealsModal.classList.add('active');
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });

    closeDealsModal.addEventListener('click', () => {
      dealsModal.classList.remove('active');
    });

    function updateCountdown() {
      const countdownElement = document.getElementById('countdown');
      let time = 5 * 60;
      
      const timer = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        countdownElement.textContent = `Offer ends in: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (time <= 0) {
          clearInterval(timer);
          countdownElement.textContent = "Offer expired!";
        } else {
          time--;
        }
      }, 1000);
    }


    function updateCartCount() {
      cartCount = cart.reduce((total, item) => total + item.quantity, 0);
      cartCountElements.forEach(element => {
        element.textContent = `(${cartCount})`;
      });

      checkoutBtn.disabled = cartCount === 0;
    }

    function updateCartDisplay() {
      cartItems.innerHTML = '';
      
      if (cart.length === 0) {
        cartItems.innerHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <p>Your cart is empty</p>
          </div>
        `;
        cartTotal.textContent = '₹0.00';
        return;
      }
      
      let total = 0;
      
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <div class="cart-item-info">
            <div class="cart-item-icon">
              <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p>₹${item.price.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div class="cart-item-actions">
            <div class="quantity-controls">
              <button class="quantity-btn decrease" data-id="${item.id}">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn increase" data-id="${item.id}">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="remove-item" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        
        cartItems.appendChild(cartItem);
      });
      
      cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;

      document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          decreaseQuantity(id);
        });
      });
      
      document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          increaseQuantity(id);
        });
      });
      
      document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          removeFromCart(id);
        });
      });
    }

    function addToCart(id, name, price, icon) {
      const existingItem = cart.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id,
          name,
          price: parseFloat(price),
          icon,
          quantity: 1
        });
      }
      
      updateCartCount();
      updateCartDisplay();

      showSuccessMessage(`"${name}" has been added to your cart!`);
    }

    function increaseQuantity(id) {
      const item = cart.find(item => item.id === id);
      if (item) {
        item.quantity += 1;
        updateCartCount();
        updateCartDisplay();
      }
    }

    function decreaseQuantity(id) {
      const item = cart.find(item => item.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          removeFromCart(id);
          return;
        }
        updateCartCount();
        updateCartDisplay();
      }
    }

    function removeFromCart(id) {
      cart = cart.filter(item => item.id !== id);
      updateCartCount();
      updateCartDisplay();
    }

    function showSuccessMessage(message) {
      successText.textContent = message;
      successMessage.classList.add('active');
      
      setTimeout(() => {
        successMessage.classList.remove('active');
      }, 3000);
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const price = this.getAttribute('data-price');
        const icon = this.getAttribute('data-icon');
        
        addToCart(id, name, price, icon);
      });
    });

    cartLink.addEventListener('click', () => {
      cartModal.classList.add('active');
    });

    sidebarCart.addEventListener('click', () => {
      cartModal.classList.add('active');
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });

    closeCartModal.addEventListener('click', () => {
      cartModal.classList.remove('active');
    });

    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const newOrderCount = increaseOrderCount();

      showSuccessMessage(`Order placed successfully! Total: ₹${total.toLocaleString('en-IN')}`);

      cart = [];
      updateCartCount();
      updateCartDisplay();

      setTimeout(() => {
        cartModal.classList.remove('active');
      }, 2000);
    });

    function displayUserDetails() {
      const userData = getUserData();
      
      if (userData) {
        userDetails.innerHTML = `
          <div class="user-field">
            <div class="user-label">Name:</div>
            <div class="user-value">${userData.name}</div>
          </div>
          <div class="user-field">
            <div class="user-label">Email:</div>
            <div class="user-value">${userData.email}</div>
          </div>
          <div class="user-field">
            <div class="user-label">Member Since:</div>
            <div class="user-value">${userData.memberSince}</div>
          </div>
          <div class="user-field">
            <div class="user-label">Orders:</div>
            <div class="user-value">${userData.orders}</div>
          </div>
        `;
      }
    }

    accountLink.addEventListener('click', () => {
      displayUserDetails();
      accountModal.classList.add('active');
    });

    sidebarAccount.addEventListener('click', () => {
      displayUserDetails();
      accountModal.classList.add('active');
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });

    closeAccountModal.addEventListener('click', () => {
      accountModal.classList.remove('active');
    });

    window.addEventListener('DOMContentLoaded', () => {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (!loggedInUser) {
        window.location.href = 'login.html';
      } else {
        const user = JSON.parse(loggedInUser);
        const welcomeMessage = document.getElementById('welcomeMessage');
        welcomeMessage.textContent = `Welcome to Cartify, ${user.name}!`;

        getUserData();

        updateCountdown();
      }
    });

    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');
    
    const productCards = document.querySelectorAll('.carousel .product-card');
    const totalProducts = productCards.length;
    let currentIndex = 0;
    const productsPerView = getProductsPerView();

    for (let i = 0; i < Math.ceil(totalProducts / productsPerView); i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
      if (i === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
      indicatorsContainer.appendChild(indicator);
    }

    function getProductsPerView() {
      if (window.innerWidth < 480) return 1;
      if (window.innerWidth < 768) return 2;
      return 3;
    }

    function updateCarousel() {
      const offset = -currentIndex * (250 + 30);
      carousel.style.transform = `translateX(${offset}px)`;

      document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    }

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = Math.ceil(totalProducts / productsPerView) - 1;
      }
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < Math.ceil(totalProducts / productsPerView) - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    });

    let autoRotate = setInterval(() => {
      nextBtn.click();
    }, 4000);

    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoRotate);
    });

    carousel.addEventListener('mouseleave', () => {
      autoRotate = setInterval(() => {
        nextBtn.click();
      }, 4000);
    });

    window.addEventListener('resize', () => {
      currentIndex = 0;
      updateCarousel();
    });