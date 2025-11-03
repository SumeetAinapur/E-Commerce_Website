    function loginUser() {
      let email = document.getElementById("email").value.trim();
      let password = document.getElementById("password").value.trim();
      let message = document.getElementById("message");

      message.textContent = "";
      message.className = "message";

      let users = JSON.parse(localStorage.getItem("bankUsers")) || [];

      if (!email || !password) {
        message.textContent = "⚠️ Please fill in all fields!";
        message.className = "message error";
        return;
      }

      if (users.length === 0) {
        message.textContent = "❌ No users found. Please register first.";
        message.className = "message error";
        return;
      }

      let validUser = users.find(u => u.email === email && u.password === password);

      if (validUser) {
        message.textContent = "✅ Login Successful! Redirecting...";
        message.className = "message success";

        localStorage.setItem("loggedInUser", JSON.stringify(validUser));

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      } else {
        message.textContent = "❌ Invalid email or password!";
        message.className = "message error";
      }
    }