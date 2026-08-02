// ==============================
// ShubhVivah.com - Main JavaScript
// ==============================

// 1. Smooth Scroll for Navigation (Only internal section links starting with '#')
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute("href");

        if (targetId && targetId.startsWith("#")) {
            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    });
});

// 2. Navbar Background Change on Scroll
window.addEventListener("scroll", function () {
    const nav = document.querySelector("nav");
    if (!nav) return;

    if (window.scrollY > 100) {
        nav.style.background = "#650000";
        nav.style.transition = "0.4s";
    } else {
        nav.style.background = "rgba(139,0,0,0.92)";
    }
});

// 3. Partner Search Handler (Connects Index Search Bar -> Profile Page)
const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        const gender = document.getElementById("searchGender") ? document.getElementById("searchGender").value : "";
        const city = document.getElementById("searchCity") ? document.getElementById("searchCity").value : "";

        // Redirect to profile page with chosen filters in URL query parameters
        window.location.href = `profile.html?gender=${encodeURIComponent(gender)}&city=${encodeURIComponent(city)}`;
    });
}

// 4. Card Hover Animations
const cards = document.querySelectorAll(".card");
cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-12px) scale(1.03)";
    });
    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0px) scale(1)";
    });
});

// 5. Hero & Plan Buttons UI Feedback
const heroBtn = document.querySelector(".hero button");
if (heroBtn) {
    heroBtn.addEventListener("click", () => {
        alert("Welcome to ShubhVivah.com ❤️");
    });
}

const premiumButtons = document.querySelectorAll(".plan button");
premiumButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Premium Membership checkout coming soon!");
    });
});

// 6. Statistics Counter Animation
const counters = document.querySelectorAll(".stats h2");
let started = false;

window.addEventListener("scroll", () => {
    const stats = document.querySelector(".stats");
    if (!stats) return;

    const top = stats.offsetTop - 400;

    if (window.scrollY > top && !started) {
        started = true;

        counters.forEach(counter => {
            let target = counter.innerText;
            target = target.replace("+", "").replace("%", "");
            target = parseInt(target);

            let count = 0;
            let speed = target / 100;

            const update = () => {
                count += speed;

                if (count < target) {
                    counter.innerText = Math.floor(count) + "+";
                    requestAnimationFrame(update);
                } else {
                    if (counter.innerText.includes("%")) {
                        counter.innerText = target + "%";
                    } else {
                        counter.innerText = target + "+";
                    }
                }
            };

            update();
        });
    }
});

// 7. Scroll Intersection Fade-In Observer
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0px)";
        }
    });
});

document.querySelectorAll(".card, .profile-card, .plan, .testimonial").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "1s";
    observer.observe(el);
});

// ==============================
// 8. Live Backend Login Integration
// ==============================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/api/auth/profiles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const result = await response.text();

            if (response.ok) {
                alert("🎉 " + result);
                localStorage.setItem("userEmail", email);
                window.location.href = "index.html";
            } else {
                alert("❌ " + result);
            }
        } catch (error) {
            console.error("Server connection error:", error);
            alert("Could not connect to backend server. Make sure Java Spring Boot is running!");
        }
    });
}

// ==============================
// 9. Live Backend Registration Integration
// ==============================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const gender = document.getElementById("gender") ? document.getElementById("gender").value : "";
        const city = document.getElementById("city") ? document.getElementById("city").value : "";

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: fullName,
                    email: email,
                    password: password,
                    gender: gender,
                    city: city
                })
            });

            const result = await response.text();

            if (response.ok) {
                alert("🎉 " + result);
                window.location.href = "login.html";
            } else {
                alert("❌ " + result);
            }
        } catch (error) {
            console.error("Server connection error:", error);
            alert("Could not connect to backend server!");
        }
    });
}

// ==============================
// 10. Active Session & Logout Manager
// ==============================
window.addEventListener("DOMContentLoaded", () => {
    const userEmail = localStorage.getItem("userEmail");
    const loginBtn = document.querySelector('nav a.login, nav a[href="login.html"]');

    if (userEmail && loginBtn) {
        loginBtn.innerText = "Logout";
        loginBtn.href = "#";
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("userEmail");
            alert("Logged out successfully!");
            window.location.href = "index.html";
        });
    }
});

console.log("ShubhVivah.com initialized successfully ❤️");