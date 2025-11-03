    function registerUser() {
      let name = document.getElementById("name").value.trim();
      let email = document.getElementById("email").value.trim();
      let password = document.getElementById("password").value.trim();
      let message = document.getElementById("message");

      message.textContent = "";
      message.className = "message";

      if (name === "" || email === "" || password === "") {
        message.textContent = "⚠️ All fields are required!";
        message.className = "message error";
        return;
      }

      let users = JSON.parse(localStorage.getItem("bankUsers")) || [];

      let userExists = users.some(u => u.email === email);
      if (userExists) {
        message.textContent = "❌ Email already registered!";
        message.className = "message error";
        return;
      }

      let newUser = { name, email, password };

      users.push(newUser);

      localStorage.setItem("bankUsers", JSON.stringify(users));

      message.textContent = "✅ Registration Successful! Redirecting to login...";
      message.className = "message success";

      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    }