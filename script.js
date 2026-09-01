/* =====================================================
   SPCLASSES — INTERACTIVE 3D JAVASCRIPT
   ===================================================== */


/* ================= LOADER ================= */

window.addEventListener("load", () => {

    setTimeout(() => {
        document.getElementById("loader").classList.add("hide");
    }, 1900);

});


/* ================= MOBILE MENU ================= */

const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("nav-menu");

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
});


document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
    });

});


/* ================= CURSOR GLOW ================= */

const cursorGlow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (e) => {

    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;

});


/* ================= SCROLL REVEAL ================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }

        });

    },

    {
        threshold: 0.12
    }

);

revealElements.forEach(element => {
    revealObserver.observe(element);
});


/* ================= 3D TILT ================= */

const tiltCards = document.querySelectorAll(".tilt");

tiltCards.forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX =
            ((y - centerY) / centerY) * -6;

        const rotateY =
            ((x - centerX) / centerX) * 6;

        card.style.transform =
            `perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-5px)`;

    });


    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";

    });

});


/* ================= THREE.JS ================= */

const canvas = document.getElementById("three-canvas");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 5;


const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


/* ================= PARTICLE FIELD ================= */

const particleGeometry =
    new THREE.BufferGeometry();

const particleCount = 1800;

const positions =
    new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {

    positions[i] =
        (Math.random() - 0.5) * 16;

}

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);


const particleMaterial =
    new THREE.PointsMaterial({
        color: 0x8f6cff,
        size: 0.018,
        transparent: true,
        opacity: 0.65
    });


const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );

scene.add(particles);


/* ================= WIREFRAME SPHERE ================= */

const sphereGeometry =
    new THREE.IcosahedronGeometry(
        1.5,
        2
    );

const sphereMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x7549d8,
        wireframe: true,
        transparent: true,
        opacity: 0.07
    });

const sphere =
    new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    );

sphere.position.set(
    2.8,
    0.2,
    -1
);

scene.add(sphere);


/* ================= TORUS ================= */

const torusGeometry =
    new THREE.TorusGeometry(
        2.3,
        0.012,
        16,
        120
    );

const torusMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x9d7aff,
        transparent: true,
        opacity: 0.16
    });

const torus =
    new THREE.Mesh(
        torusGeometry,
        torusMaterial
    );

torus.rotation.x = 1.1;

scene.add(torus);


/* ================= MOUSE PARALLAX ================= */

let mouseX = 0;
let mouseY = 0;

document.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            (event.clientX /
                window.innerWidth) *
            2 - 1;

        mouseY =
            (event.clientY /
                window.innerHeight) *
            2 - 1;

    }
);


/* ================= ANIMATION LOOP ================= */

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();


    /* particles */

    particles.rotation.y =
        time * 0.015;

    particles.rotation.x =
        mouseY * 0.04;


    /* sphere */

    sphere.rotation.x =
        time * 0.12;

    sphere.rotation.y =
        time * 0.16;


    sphere.position.x =
        2.8 + mouseX * 0.3;

    sphere.position.y =
        0.2 - mouseY * 0.25;


    /* torus */

    torus.rotation.z =
        time * 0.08;

    torus.rotation.y =
        time * 0.05;


    /* camera */

    camera.position.x +=
        (mouseX * 0.18 -
         camera.position.x) * 0.03;

    camera.position.y +=
        (-mouseY * 0.12 -
         camera.position.y) * 0.03;

    camera.lookAt(
        scene.position
    );


    renderer.render(
        scene,
        camera
    );

}

animate();


/* ================= RESIZE ================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


/* ================= SCROLL PARALLAX ================= */

window.addEventListener(
    "scroll",
    () => {

        const scroll =
            window.scrollY;

        sphere.position.y =
            0.2 + scroll * 0.0004;

        torus.position.y =
            -scroll * 0.0002;

    },
    { passive: true }
);


/* ================= COURSE HOVER SOUNDLESS FX ================= */

const courseCards =
    document.querySelectorAll(
        ".course-card"
    );

courseCards.forEach((card, index) => {

    card.style.transitionDelay =
        `${index * 50}ms`;

});


/* ================= ACTIVE NAV ================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );

const navLinks =
    document.querySelectorAll(
        "nav a"
    );

window.addEventListener(
    "scroll",
    () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 200;

            if (
                window.scrollY >=
                sectionTop
            ) {
                current =
                    section.getAttribute(
                        "id"
                    );
            }

        });

        navLinks.forEach(link => {

            link.style.color = "#999";

            if (
                link.getAttribute("href") ===
                `#${current}`
            ) {
                link.style.color = "white";
            }

        });

    },
    { passive: true }
);
