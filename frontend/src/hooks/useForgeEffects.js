import { useEffect } from "react";

export default function useForgeEffects() {

    /* ===========================
       PRELOADER
    =========================== */

    useEffect(() => {

        const preloader = document.getElementById("preloader");

        const hideLoader = () => {
            setTimeout(() => {
                preloader?.classList.add("hidden");
            }, 600);
        };

        window.addEventListener("load", hideLoader);

        const timer = setTimeout(() => {
            preloader?.classList.add("hidden");
        }, 2500);

        return () => {
            window.removeEventListener("load", hideLoader);
            clearTimeout(timer);
        };

    }, []);





    /* ===========================
       SCROLL PROGRESS + NAVBAR
    =========================== */

    useEffect(() => {

        const progress = document.getElementById("scrollProgress");
        const nav = document.getElementById("mainNav");
        const topBtn = document.getElementById("backToTop");

        const handleScroll = () => {

            const scrollTop = window.scrollY;

            const height =
                document.documentElement.scrollHeight -
                window.innerHeight;

            if (progress) {

                progress.style.width =
                    ((scrollTop / height) * 100) + "%";

            }

            if (scrollTop > 60)
                nav?.classList.add("scrolled");
            else
                nav?.classList.remove("scrolled");

            if (scrollTop > 500)
                topBtn?.classList.add("show");
            else
                topBtn?.classList.remove("show");

        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {

            window.removeEventListener("scroll", handleScroll);

        };

    }, []);





    /* ===========================
       REVEAL ANIMATION
    =========================== */

    useEffect(() => {

        const items = document.querySelectorAll(

            ".reveal-up,.reveal-left,.reveal-right,.reveal-scale"

        );

        const observer = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("in-view");

                        observer.unobserve(entry.target);

                    }

                });

            },

            {

                threshold: 0.15,
                rootMargin: "0px 0px -60px 0px"

            }

        );

        items.forEach(item => observer.observe(item));

        requestAnimationFrame(() => {

            document.querySelectorAll(

                ".hero .reveal-up,.hero .reveal-scale"

            ).forEach(el => {

                el.classList.add("in-view");

            });

        });

        return () => observer.disconnect();

    }, []);





    /* ===========================
       COUNTERS
    =========================== */

    useEffect(() => {

        const counters = document.querySelectorAll(".counter");

        const animate = (counter) => {

            const target = Number(counter.dataset.target);

            const duration = 1800;

            const start = performance.now();

            const update = (now) => {

                const progress =
                    Math.min((now - start) / duration, 1);

                const eased =
                    1 - Math.pow(1 - progress, 3);

                counter.textContent =
                    Math.floor(target * eased).toLocaleString();

                if (progress < 1) {

                    requestAnimationFrame(update);

                } else {

                    counter.textContent =
                        target.toLocaleString();

                }

            };

            requestAnimationFrame(update);

        };

        const observer = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        animate(entry.target);

                        observer.unobserve(entry.target);

                    }

                });

            },

            {

                threshold: 0.5

            }

        );

        counters.forEach(counter => observer.observe(counter));

        return () => observer.disconnect();

    }, []);





    /* ===========================
       CUSTOM CURSOR
    =========================== */

    useEffect(() => {

        if (window.matchMedia("(hover:none)").matches)
            return;

        const dot = document.getElementById("cursorDot");
        const ring = document.getElementById("cursorRing");

        if (!dot || !ring)
            return;

        let mouseX = 0;
        let mouseY = 0;

        let ringX = 0;
        let ringY = 0;

        const move = (e) => {

            mouseX = e.clientX;
            mouseY = e.clientY;

            dot.style.left = mouseX + "px";
            dot.style.top = mouseY + "px";

        };

        window.addEventListener("mousemove", move);

        let animation;

        const animate = () => {

            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            ring.style.left = ringX + "px";
            ring.style.top = ringY + "px";

            animation = requestAnimationFrame(animate);

        };

        animate();

        const targets = document.querySelectorAll(

            "a,button,input,textarea,.feature-card,.service-card,.price-card,.gallery-item,.trainer-card"

        );

        const enter = () => ring.classList.add("hovered");
        const leave = () => ring.classList.remove("hovered");

        targets.forEach(item => {

            item.addEventListener("mouseenter", enter);
            item.addEventListener("mouseleave", leave);

        });

        return () => {

            window.removeEventListener("mousemove", move);

            cancelAnimationFrame(animation);

            targets.forEach(item => {

                item.removeEventListener("mouseenter", enter);
                item.removeEventListener("mouseleave", leave);

            });

        };

    }, []);





    /* ===========================
       BUTTON RIPPLE
    =========================== */

    useEffect(() => {

        const buttons = document.querySelectorAll(

            ".btn-forge-primary,.btn-forge-ghost"

        );

        const clickHandler = function (e) {

            const rect = this.getBoundingClientRect();

            const ripple = document.createElement("span");

            const size = Math.max(rect.width, rect.height);

            ripple.className = "ripple";

            ripple.style.width = size + "px";
            ripple.style.height = size + "px";

            ripple.style.left =
                (e.clientX - rect.left - size / 2) + "px";

            ripple.style.top =
                (e.clientY - rect.top - size / 2) + "px";

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);

        };

        buttons.forEach(btn =>
            btn.addEventListener("click", clickHandler)
        );

        return () => {

            buttons.forEach(btn =>
                btn.removeEventListener("click", clickHandler)
            );

        };

    }, []);





    /* ===========================
       BACK TO TOP
    =========================== */

    useEffect(() => {

        const btn = document.getElementById("backToTop");

        if (!btn)
            return;

        const click = () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        };

        btn.addEventListener("click", click);

        return () => {

            btn.removeEventListener("click", click);

        };

    }, []);

}