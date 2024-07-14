/***
    Lenis is a lightweight, robust, and performant smooth scroll library.
    It's designed by @darkroom.engineering to be simple to use and easy to integrate into your projects. 
    It's built with performance in mind and is optimized for modern browsers. 
    It's perfect for creating smooth scrolling experiences on your website such as webgl scroll synching, parallax effects and much more.
    * Licensed under MIT (https://github.com/darkroomengineering/lenis?tab=MIT-1-ov-file#readme)
    * Lenis v1.1.3 designed by darkroomengineering https://github.com/darkroomengineering/lenis
  */

!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? (module.exports = e()) : "function" == typeof define && define.amd ? define(e) : ((t = "undefined" != typeof globalThis ? globalThis : t || self).Lenis = e());
})(this, function () {
    "use strict";
    function clamp(t, e, i) {
        return Math.max(t, Math.min(e, i));
    }
    class Animate {
        advance(t) {
            if (!this.isRunning) return;
            let e = !1;
            if (this.duration && this.easing) {
                this.currentTime += t;
                const i = clamp(0, this.currentTime / this.duration, 1);
                e = i >= 1;
                const s = e ? 1 : this.easing(i);
                this.value = this.from + (this.to - this.from) * s;
            } else
                this.lerp
                    ? ((this.value = (function damp(t, e, i, s) {
                          return (function lerp(t, e, i) {
                              return (1 - i) * t + i * e;
                          })(t, e, 1 - Math.exp(-i * s));
                      })(this.value, this.to, 60 * this.lerp, t)),
                      Math.round(this.value) === this.to && ((this.value = this.to), (e = !0)))
                    : ((this.value = this.to), (e = !0));
            e && this.stop(), this.onUpdate?.(this.value, e);
        }
        stop() {
            this.isRunning = !1;
        }
        fromTo(t, e, { lerp: i, duration: s, easing: o, onStart: n, onUpdate: l }) {
            (this.from = this.value = t), (this.to = e), (this.lerp = i), (this.duration = s), (this.easing = o), (this.currentTime = 0), (this.isRunning = !0), n?.(), (this.onUpdate = l);
        }
    }
    class Dimensions {
        constructor({ wrapper: t, content: e, autoResize: i = !0, debounce: s = 250 } = {}) {
            (this.wrapper = t),
                (this.content = e),
                i &&
                    ((this.debouncedResize = (function debounce(t, e) {
                        let i;
                        return function () {
                            let s = arguments,
                                o = this;
                            clearTimeout(i),
                                (i = setTimeout(function () {
                                    t.apply(o, s);
                                }, e));
                        };
                    })(this.resize, s)),
                    this.wrapper === window ? window.addEventListener("resize", this.debouncedResize, !1) : ((this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize)), this.wrapperResizeObserver.observe(this.wrapper)),
                    (this.contentResizeObserver = new ResizeObserver(this.debouncedResize)),
                    this.contentResizeObserver.observe(this.content)),
                this.resize();
        }
        destroy() {
            this.wrapperResizeObserver?.disconnect(), this.contentResizeObserver?.disconnect(), window.removeEventListener("resize", this.debouncedResize, !1);
        }
        resize = () => {
            this.onWrapperResize(), this.onContentResize();
        };
        onWrapperResize = () => {
            this.wrapper === window ? ((this.width = window.innerWidth), (this.height = window.innerHeight)) : ((this.width = this.wrapper.clientWidth), (this.height = this.wrapper.clientHeight));
        };
        onContentResize = () => {
            this.wrapper === window ? ((this.scrollHeight = this.content.scrollHeight), (this.scrollWidth = this.content.scrollWidth)) : ((this.scrollHeight = this.wrapper.scrollHeight), (this.scrollWidth = this.wrapper.scrollWidth));
        };
        get limit() {
            return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
        }
    }
    class Emitter {
        constructor() {
            this.events = {};
        }
        emit(t, ...e) {
            let i = this.events[t] || [];
            for (let t = 0, s = i.length; t < s; t++) i[t](...e);
        }
        on(t, e) {
            return (
                this.events[t]?.push(e) || (this.events[t] = [e]),
                () => {
                    this.events[t] = this.events[t]?.filter((t) => e !== t);
                }
            );
        }
        off(t, e) {
            this.events[t] = this.events[t]?.filter((t) => e !== t);
        }
        destroy() {
            this.events = {};
        }
    }
    const t = 100 / 6;
    class VirtualScroll {
        constructor(t, { wheelMultiplier: e = 1, touchMultiplier: i = 1 }) {
            (this.element = t),
                (this.wheelMultiplier = e),
                (this.touchMultiplier = i),
                (this.touchStart = { x: null, y: null }),
                (this.emitter = new Emitter()),
                window.addEventListener("resize", this.onWindowResize, !1),
                this.onWindowResize(),
                this.element.addEventListener("wheel", this.onWheel, { passive: !1 }),
                this.element.addEventListener("touchstart", this.onTouchStart, { passive: !1 }),
                this.element.addEventListener("touchmove", this.onTouchMove, { passive: !1 }),
                this.element.addEventListener("touchend", this.onTouchEnd, { passive: !1 });
        }
        on(t, e) {
            return this.emitter.on(t, e);
        }
        destroy() {
            this.emitter.destroy(),
                window.removeEventListener("resize", this.onWindowResize, !1),
                this.element.removeEventListener("wheel", this.onWheel, { passive: !1 }),
                this.element.removeEventListener("touchstart", this.onTouchStart, { passive: !1 }),
                this.element.removeEventListener("touchmove", this.onTouchMove, { passive: !1 }),
                this.element.removeEventListener("touchend", this.onTouchEnd, { passive: !1 });
        }
        onTouchStart = (t) => {
            const { clientX: e, clientY: i } = t.targetTouches ? t.targetTouches[0] : t;
            (this.touchStart.x = e), (this.touchStart.y = i), (this.lastDelta = { x: 0, y: 0 }), this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: t });
        };
        onTouchMove = (t) => {
            const { clientX: e, clientY: i } = t.targetTouches ? t.targetTouches[0] : t,
                s = -(e - this.touchStart.x) * this.touchMultiplier,
                o = -(i - this.touchStart.y) * this.touchMultiplier;
            (this.touchStart.x = e), (this.touchStart.y = i), (this.lastDelta = { x: s, y: o }), this.emitter.emit("scroll", { deltaX: s, deltaY: o, event: t });
        };
        onTouchEnd = (t) => {
            this.emitter.emit("scroll", { deltaX: this.lastDelta.x, deltaY: this.lastDelta.y, event: t });
        };
        onWheel = (e) => {
            let { deltaX: i, deltaY: s, deltaMode: o } = e;
            (i *= 1 === o ? t : 2 === o ? this.windowWidth : 1),
                (s *= 1 === o ? t : 2 === o ? this.windowHeight : 1),
                (i *= this.wheelMultiplier),
                (s *= this.wheelMultiplier),
                this.emitter.emit("scroll", { deltaX: i, deltaY: s, event: e });
        };
        onWindowResize = () => {
            (this.windowWidth = window.innerWidth), (this.windowHeight = window.innerHeight);
        };
    }
    return class Lenis {
        constructor({
            wrapper: t = window,
            content: e = document.documentElement,
            wheelEventsTarget: i = t,
            eventsTarget: s = i,
            smoothWheel: o = !0,
            syncTouch: n = !1,
            syncTouchLerp: l = 0.075,
            touchInertiaMultiplier: r = 35,
            duration: h,
            easing: a = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: c = 0.1,
            infinite: u = !1,
            orientation: d = "vertical",
            gestureOrientation: p = "vertical",
            touchMultiplier: m = 1,
            wheelMultiplier: v = 1,
            autoResize: g = !0,
            prevent: S = !1,
            __experimental__naiveDimensions: w = !1,
        } = {}) {
            (this.__isScrolling = !1),
                (this.__isStopped = !1),
                (this.__isLocked = !1),
                (this.direction = 0),
                (this.onVirtualScroll = ({ deltaX: t, deltaY: e, event: i }) => {
                    if (i.ctrlKey) return;
                    const s = i.type.includes("touch"),
                        o = i.type.includes("wheel");
                    this.isTouching = "touchstart" === i.type || "touchmove" === i.type;
                    if (this.options.syncTouch && s && "touchstart" === i.type && !this.isStopped && !this.isLocked) return void this.reset();
                    const n = 0 === t && 0 === e,
                        l = ("vertical" === this.options.gestureOrientation && 0 === e) || ("horizontal" === this.options.gestureOrientation && 0 === t);
                    if (n || l) return;
                    let r = i.composedPath();
                    r = r.slice(0, r.indexOf(this.rootElement));
                    const h = this.options.prevent;
                    if (
                        r.find((t) => {
                            var e, i, n, l, r;
                            return (
                                t instanceof Element &&
                                (("function" == typeof h ? (null == h ? void 0 : h(t)) : h) ||
                                    (null === (e = t.hasAttribute) || void 0 === e ? void 0 : e.call(t, "data-lenis-prevent")) ||
                                    (s && (null === (i = t.hasAttribute) || void 0 === i ? void 0 : i.call(t, "data-lenis-prevent-touch"))) ||
                                    (o && (null === (n = t.hasAttribute) || void 0 === n ? void 0 : n.call(t, "data-lenis-prevent-wheel"))) ||
                                    ((null === (l = t.classList) || void 0 === l ? void 0 : l.contains("lenis")) && !(null === (r = t.classList) || void 0 === r ? void 0 : r.contains("lenis-stopped"))))
                            );
                        })
                    )
                        return;
                    if (this.isStopped || this.isLocked) return void i.preventDefault();
                    if (!((this.options.syncTouch && s) || (this.options.smoothWheel && o))) return (this.isScrolling = "native"), void this.animate.stop();
                    i.preventDefault();
                    let a = e;
                    "both" === this.options.gestureOrientation ? (a = Math.abs(e) > Math.abs(t) ? e : t) : "horizontal" === this.options.gestureOrientation && (a = t);
                    const c = s && this.options.syncTouch,
                        u = s && "touchend" === i.type && Math.abs(a) > 5;
                    u && (a = this.velocity * this.options.touchInertiaMultiplier),
                        this.scrollTo(this.targetScroll + a, Object.assign({ programmatic: !1 }, c ? { lerp: u ? this.options.syncTouchLerp : 1 } : { lerp: this.options.lerp, duration: this.options.duration, easing: this.options.easing }));
                }),
                (this.onNativeScroll = () => {
                    if ((clearTimeout(this.__resetVelocityTimeout), delete this.__resetVelocityTimeout, this.__preventNextNativeScrollEvent)) delete this.__preventNextNativeScrollEvent;
                    else if (!1 === this.isScrolling || "native" === this.isScrolling) {
                        const t = this.animatedScroll;
                        (this.animatedScroll = this.targetScroll = this.actualScroll),
                            (this.lastVelocity = this.velocity),
                            (this.velocity = this.animatedScroll - t),
                            (this.direction = Math.sign(this.animatedScroll - t)),
                            (this.isScrolling = "native"),
                            this.emit(),
                            0 !== this.velocity &&
                                (this.__resetVelocityTimeout = setTimeout(() => {
                                    (this.lastVelocity = this.velocity), (this.velocity = 0), (this.isScrolling = !1), this.emit();
                                }, 400));
                    }
                }),
                (window.lenisVersion = "1.1.3"),
                (t && t !== document.documentElement && t !== document.body) || (t = window),
                (this.options = {
                    wrapper: t,
                    content: e,
                    wheelEventsTarget: i,
                    eventsTarget: s,
                    smoothWheel: o,
                    syncTouch: n,
                    syncTouchLerp: l,
                    touchInertiaMultiplier: r,
                    duration: h,
                    easing: a,
                    lerp: c,
                    infinite: u,
                    gestureOrientation: p,
                    orientation: d,
                    touchMultiplier: m,
                    wheelMultiplier: v,
                    autoResize: g,
                    prevent: S,
                    __experimental__naiveDimensions: w,
                }),
                (this.animate = new Animate()),
                (this.emitter = new Emitter()),
                (this.dimensions = new Dimensions({ wrapper: t, content: e, autoResize: g })),
                this.updateClassName(),
                (this.userData = {}),
                (this.time = 0),
                (this.velocity = this.lastVelocity = 0),
                (this.isLocked = !1),
                (this.isStopped = !1),
                (this.isScrolling = !1),
                (this.targetScroll = this.animatedScroll = this.actualScroll),
                this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1),
                (this.virtualScroll = new VirtualScroll(s, { touchMultiplier: m, wheelMultiplier: v })),
                this.virtualScroll.on("scroll", this.onVirtualScroll);
        }
        destroy() {
            this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, !1), this.virtualScroll.destroy(), this.dimensions.destroy(), this.cleanUpClassName();
        }
        on(t, e) {
            return this.emitter.on(t, e);
        }
        off(t, e) {
            return this.emitter.off(t, e);
        }
        setScroll(t) {
            this.isHorizontal ? (this.rootElement.scrollLeft = t) : (this.rootElement.scrollTop = t);
        }
        resize() {
            this.dimensions.resize();
        }
        emit() {
            this.emitter.emit("scroll", this);
        }
        reset() {
            (this.isLocked = !1), (this.isScrolling = !1), (this.animatedScroll = this.targetScroll = this.actualScroll), (this.lastVelocity = this.velocity = 0), this.animate.stop();
        }
        start() {
            this.isStopped && ((this.isStopped = !1), this.reset());
        }
        stop() {
            this.isStopped || ((this.isStopped = !0), this.animate.stop(), this.reset());
        }
        raf(t) {
            const e = t - (this.time || t);
            (this.time = t), this.animate.advance(0.001 * e);
        }
        scrollTo(
            t,
            {
                offset: e = 0,
                immediate: i = !1,
                lock: s = !1,
                duration: o = this.options.duration,
                easing: n = this.options.easing,
                lerp: l = this.options.lerp,
                onStart: r,
                onComplete: h,
                force: a = !1,
                programmatic: c = !0,
                userData: u = {},
            } = {}
        ) {
            if ((!this.isStopped && !this.isLocked) || a) {
                if ("string" == typeof t && ["top", "left", "start"].includes(t)) t = 0;
                else if ("string" == typeof t && ["bottom", "right", "end"].includes(t)) t = this.limit;
                else {
                    let i;
                    if (("string" == typeof t ? (i = document.querySelector(t)) : t instanceof HTMLElement && (null == t ? void 0 : t.nodeType) && (i = t), i)) {
                        if (this.options.wrapper !== window) {
                            const t = this.rootElement.getBoundingClientRect();
                            e -= this.isHorizontal ? t.left : t.top;
                        }
                        const s = i.getBoundingClientRect();
                        t = (this.isHorizontal ? s.left : s.top) + this.animatedScroll;
                    }
                }
                if ("number" == typeof t && ((t += e), (t = Math.round(t)), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : (t = clamp(0, t, this.limit)), t !== this.targetScroll)) {
                    if (((this.userData = u), i))
                        return (this.animatedScroll = this.targetScroll = t), this.setScroll(this.scroll), this.reset(), this.preventNextNativeScrollEvent(), this.emit(), null == h || h(this), void (this.userData = {});
                    c || (this.targetScroll = t),
                        this.animate.fromTo(this.animatedScroll, t, {
                            duration: o,
                            easing: n,
                            lerp: l,
                            onStart: () => {
                                s && (this.isLocked = !0), (this.isScrolling = "smooth"), null == r || r(this);
                            },
                            onUpdate: (t, e) => {
                                (this.isScrolling = "smooth"),
                                    (this.lastVelocity = this.velocity),
                                    (this.velocity = t - this.animatedScroll),
                                    (this.direction = Math.sign(this.velocity)),
                                    (this.animatedScroll = t),
                                    this.setScroll(this.scroll),
                                    c && (this.targetScroll = t),
                                    e || this.emit(),
                                    e && (this.reset(), this.emit(), null == h || h(this), (this.userData = {}), this.preventNextNativeScrollEvent());
                            },
                        });
                }
            }
        }
        preventNextNativeScrollEvent() {
            (this.__preventNextNativeScrollEvent = !0),
                requestAnimationFrame(() => {
                    delete this.__preventNextNativeScrollEvent;
                });
        }
        get rootElement() {
            return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
        }
        get limit() {
            return this.options.__experimental__naiveDimensions
                ? this.isHorizontal
                    ? this.rootElement.scrollWidth - this.rootElement.clientWidth
                    : this.rootElement.scrollHeight - this.rootElement.clientHeight
                : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
        }
        get isHorizontal() {
            return "horizontal" === this.options.orientation;
        }
        get actualScroll() {
            return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
        }
        get scroll() {
            return this.options.infinite
                ? (function modulo(t, e) {
                      return ((t % e) + e) % e;
                  })(this.animatedScroll, this.limit)
                : this.animatedScroll;
        }
        get progress() {
            return 0 === this.limit ? 1 : this.scroll / this.limit;
        }
        get isScrolling() {
            return this.__isScrolling;
        }
        set isScrolling(t) {
            this.__isScrolling !== t && ((this.__isScrolling = t), this.updateClassName());
        }
        get isStopped() {
            return this.__isStopped;
        }
        set isStopped(t) {
            this.__isStopped !== t && ((this.__isStopped = t), this.updateClassName());
        }
        get isLocked() {
            return this.__isLocked;
        }
        set isLocked(t) {
            this.__isLocked !== t && ((this.__isLocked = t), this.updateClassName());
        }
        get isSmooth() {
            return "smooth" === this.isScrolling;
        }
        get className() {
            let t = "lenis";
            return this.isStopped && (t += " lenis-stopped"), this.isLocked && (t += " lenis-locked"), this.isScrolling && (t += " lenis-scrolling"), "smooth" === this.isScrolling && (t += " lenis-smooth"), t;
        }
        updateClassName() {
            this.cleanUpClassName(), (this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim());
        }
        cleanUpClassName() {
            this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim();
        }
    };
});
//# sourceMappingURL=lenis.min.js.map
