/* ==========================================================
   SCRIPT PRINCIPAL DEL PORTAFOLIO — Keiner Posada
   Maneja: navegación, scroll, animaciones, validación
   del formulario y envío real con Web3Forms.
   Correo destino: keinerposada0402@gmail.com
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ----------------------------------------------------------
       1. NAVBAR — cambia apariencia al hacer scroll
    ---------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const handleNavbarScroll = function () {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    /* ----------------------------------------------------------
       2. MENÚ MÓVIL — abre y cierra con el botón hamburguesa
    ---------------------------------------------------------- */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            menuToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    /* ----------------------------------------------------------
       3. ENLACE ACTIVO EN NAV según la sección visible
    ---------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const updateActiveLink = function () {
        const scrollPos = window.scrollY + 120;
        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) link.classList.add('active');
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveLink);

    /* ----------------------------------------------------------
       4. ANIMACIÓN REVEAL ON SCROLL
    ---------------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });

    /* ----------------------------------------------------------
       5. BARRAS DE HABILIDADES — se llenan al ser visibles
    ---------------------------------------------------------- */
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.fill + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    skillFills.forEach(function (el) { skillObserver.observe(el); });

    /* ----------------------------------------------------------
       6. BOTÓN VOLVER ARRIBA
    ---------------------------------------------------------- */
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) backToTop.classList.add('show');
        else backToTop.classList.remove('show');
    });
    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ----------------------------------------------------------
       7. AÑO DINÁMICO EN EL FOOTER
    ---------------------------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ----------------------------------------------------------
       8. PARALLAX SUAVE DE BLOBS en el hero
    ---------------------------------------------------------- */
    const blobs = document.querySelectorAll('.blob');
    window.addEventListener('scroll', function () {
        var scrolled = window.scrollY;
        blobs.forEach(function (blob, i) {
            blob.style.transform = 'translateY(' + scrolled * (i + 1) * 0.12 + 'px)';
        });
    });

    /* ----------------------------------------------------------
       9. FORMULARIO — Web3Forms
       Llega directo a keinerposada0402@gmail.com
       Access Key: ee999815-af17-45de-94a0-e33548ea93aa (ya en el HTML)
    ---------------------------------------------------------- */
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');
    const submitBtn = document.getElementById('submitBtn');

    /* Muestra u oculta error por campo */
    const setError = function (inputId, errorId, message) {
        var input = document.getElementById(inputId);
        var error = document.getElementById(errorId);
        if (message) {
            input.classList.add('invalid');
            error.textContent = message;
        } else {
            input.classList.remove('invalid');
            error.textContent = '';
        }
    };

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    /* Valida todos los campos */
    var validateForm = function () {
        var isValid = true;
        var name    = document.getElementById('name').value.trim();
        var email   = document.getElementById('email').value.trim();
        var subject = document.getElementById('subject').value.trim();
        var message = document.getElementById('message').value.trim();

        if (name.length < 2) { setError('name', 'errName', 'Por favor ingresa tu nombre completo.'); isValid = false; }
        else setError('name', 'errName', '');

        if (!email) { setError('email', 'errEmail', 'El correo es obligatorio.'); isValid = false; }
        else if (!emailRegex.test(email)) { setError('email', 'errEmail', 'Correo no válido.'); isValid = false; }
        else setError('email', 'errEmail', '');

        if (subject.length < 3) { setError('subject', 'errSubject', 'Mínimo 3 caracteres.'); isValid = false; }
        else setError('subject', 'errSubject', '');

        if (message.length < 10) { setError('message', 'errMessage', 'Mínimo 10 caracteres.'); isValid = false; }
        else setError('message', 'errMessage', '');

        return isValid;
    };

    /* Validación en tiempo real al salir del campo */
    ['name', 'email', 'subject', 'message'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('blur', validateForm);
    });

    /* Envío a Web3Forms */
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (!validateForm()) return;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            successMsg.classList.remove('show');
            errorMsg.classList.remove('show');

            try {
                const formData = new FormData(form);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                /* Llamada a la API de Web3Forms */
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const data = await response.json();

                if (data.success) {
                    /* ✅ Éxito — el mensaje llega a Gmail */
                    successMsg.classList.add('show');
                    form.reset();
                    console.log('Mensaje enviado a keinerposada0402@gmail.com');
                } else {
                    /* ❌ Error devuelto por Web3Forms */
                    console.error('Web3Forms error:', data);
                    errorMsg.classList.add('show');
                }

            } catch (err) {
                /* ❌ Error de red */
                console.error('Error de red:', err);
                errorMsg.classList.add('show');
            }

            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar mensaje';

            /* Oculta los mensajes después de 6 segundos */
            setTimeout(function () {
                successMsg.classList.remove('show');
                errorMsg.classList.remove('show');
            }, 6000);
        });
    }

});
