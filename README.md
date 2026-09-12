# 🍕 Pokket Pizza — Official Website

> **Handmade Pizza. Delivered Fresh.**
> A fast, mobile-first website for Pokket Pizza — featuring a full browse-to-order flow with WhatsApp order notifications.

---

## 📌 Project Overview

This is the official website for **Pokket Pizza**, a local pizza shop known for its handmade sourdough pizza base. The site allows customers to browse the menu, add items to a cart, and place orders (paid on delivery/pickup) — inspired by the Domino's ordering experience, scoped for a local business.

**Built by:** KLNBS
**Client:** Rajendra Virendra — Pokket Pizza
**Budget:** ₹10,000–₹18,000

---

## 🌐 Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, Bestsellers, About teaser, Sourdough section, Reviews |
| Menu | `menu.html` | Full product catalog with Add to Cart + sticky order sidebar |
| Cart | `cart.html` | Mobile cart page — review items, update qty |
| Checkout | `checkout.html` | Order form → WhatsApp notification to shop |
| About Us | `about.html` | Brand story, Handmade Base USP, Sourdough craft, Reviews |
| Contact | `contact.html` | Map, Click-to-call, WhatsApp, Contact form |

---

## ✨ Features

- 🛒 **Add to Cart** — per-item cart button, quantity stepper, running total
- 💾 **Persistent Cart** — LocalStorage-backed, survives page navigation
- 📲 **WhatsApp Order Notifications** — order details sent directly to shop via WhatsApp
- 📍 **Google Maps Embed** — shop location on Contact page
- 📞 **Click-to-Call & WhatsApp Chat** — floating buttons on every page
- ⭐ **Google Reviews** — social proof embed on Home & About pages
- 📱 **Mobile-First Responsive** — optimized for 18–30 age group on mobile

---

## 🚫 Out of Scope

- Online payment gateway (Razorpay, etc.) — *payment collected on delivery/pickup*
- Admin panel / CMS — *KLNBS manages all content updates via maintenance plan*
- Inventory management
- Native mobile app

---

## 🎨 Design

| Token | Value |
|-------|-------|
| Primary Accent | Red (`#E63946`) |
| Background | White (`#FFFFFF`) |
| Footer / Dark sections | Near-black (`#1A1A1A`) |
| Font | Poppins / Inter |
| Floating buttons | WhatsApp green + Call blue |

Figma Design: [View Design](https://www.figma.com/design/FU9XiHfLAS95rDGgJEdbd5/Untitled?node-id=0-1)

---

## 🗂️ Project Structure

```
/
├── index.html              ← Home
├── about.html              ← About Us
├── menu.html               ← Menu + Cart Sidebar
├── cart.html               ← Cart (Mobile)
├── checkout.html           ← Checkout
├── contact.html            ← Contact
├── css/
│   ├── tokens.css          ← Design tokens
│   ├── global.css          ← Base styles + resets
│   ├── components.css      ← Shared components
│   └── pages/             ← Per-page styles
├── js/
│   ├── cart.js             ← Cart engine (LocalStorage)
│   ├── order.js            ← WhatsApp order builder
│   └── menu.js             ← Category filter logic
├── data/
│   └── menu.js             ← Menu items (categories, prices, images)
├── assets/
│   ├── images/
│   └── icons/
└── docs/
    ├── Pokket Pizza BRD.pdf
    └── design screens.png
```

---

## 🛒 Order Flow

```
Browse Menu → Add to Cart → Review Cart → Checkout Form → WhatsApp Order Sent → Pay on Delivery/Pickup
```

1. Customer browses Menu, taps **Add to Cart** on items
2. Cart icon shows item count + running total
3. Customer proceeds to **Checkout** (no login required)
4. Selects **Home Delivery** (free under 1.5 km) or **In-store Pickup**
5. Fills name, phone, address/note
6. On submit → order sent to shop via **WhatsApp message**
7. Payment collected **cash/UPI on delivery or pickup**

---

## 🏃 Agile Team (5 Members)

| Role | Responsibility |
|------|----------------|
| Lead Dev / Architect | Setup, shared components, cart JS, deployment |
| UI Dev — Home | Home page (desktop + mobile) |
| UI Dev — About Us | About Us page |
| UI Dev — Menu + Cart | Menu page, product cards, cart sidebar, mobile cart |
| UI Dev — Checkout + Contact + QA | Checkout, Contact, WhatsApp order logic, SEO, responsive QA |

**Sprints:** 3 × 1 week | See [`docs/`](./docs/) for full implementation plan.

---

## 📋 Maintenance

Content updates (menu items, prices, photos) are handled by **KLNBS** on behalf of the client:
- Client sends changes via WhatsApp or email
- KLNBS updates `data/menu.js` and `assets/images/`
- No admin panel or CMS login required for client

---

## 📄 Docs

- [Business Requirements Document](./docs/Pokket%20Pizza%20BRD%20(1).pdf)
- [Design Screens](./docs/design%20screens.png)

---

*© 2026 Pokket Pizza. Built with ❤️ by KLNBS.*